import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function GoogleCallback() {
    const [params] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        const userRaw = params.get("user");
        const error = params.get("error");

        if (error) {
            navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
            return;
        }

        if (token && userRaw) {
            try {
                const user = JSON.parse(decodeURIComponent(userRaw));
                login(token, user);
                navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
            } catch {
                navigate("/login?error=Invalid+response+from+Google", { replace: true });
            }
        } else {
            navigate("/login?error=Google+login+failed", { replace: true });
        }
    }, []);

    return (
        <div style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", background: "#fff",
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "3px solid #16a34a", borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ marginTop: 16, color: "#6b7280", fontSize: 14 }}>
                Signing you in with Google…
            </p>
        </div>
    );
}