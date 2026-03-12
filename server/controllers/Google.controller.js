import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const initGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase().trim();
          if (!email) return done(new Error("No email from Google"));

          // Find by googleId first, then email — never duplicate
          let user = await User.findOne({ googleId: profile.id });
          if (!user) user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              email,
              name: profile.displayName || email.split("@")[0],
              googleId: profile.id,
              isActive: true,
              role: "user",
            });
          } else {
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};

// Lazily calls passport so strategy is already registered
export const googleAuth = (req, res, next) =>
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientUrl}/login?error=google_failed`);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(
      `${clientUrl}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`,
    );
  })(req, res, next);
};
