import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const initGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:8000/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), null);

          // Find existing user by googleId or email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            // Attach googleId if they previously signed up via OTP
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            if (!user.isActive)
              return done(new Error("Account deactivated"), null);
          } else {
            // Auto-create account on first Google login
            user = await User.create({
              name: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              role: "user",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );

  // Minimal serialize/deserialize (we use JWT, not sessions)
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

// GET /api/auth/google  — kick off OAuth flow
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// GET /api/auth/google/callback  — Google redirects here
export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    const FRONTEND = process.env.CLIENT_URL || "http://localhost:5173";

    if (err || !user) {
      const msg = err?.message || "Google login failed";
      return res.redirect(`${FRONTEND}/login?error=${encodeURIComponent(msg)}`);
    }

    const token = signToken(user);
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    );

    // Redirect to frontend callback page with token + user in query params
    res.redirect(
      `${FRONTEND}/auth/google/callback?token=${token}&user=${userData}`,
    );
  })(req, res, next);
};
