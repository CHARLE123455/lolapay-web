import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "../components/layout/Brand";
import { useAuth } from "../context/useAuth";
import { errorMessage } from "../lib/types";
import { authService } from "../services";

export default function OAuthCallbackPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const hasMissingTokens =
    !window.location.hash.includes("accessToken=") ||
    !window.location.hash.includes("refreshToken=");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const access = params.get("accessToken");
    const refresh = params.get("refreshToken");
    if (!access || !refresh) {
      return;
    }
    window.history.replaceState(null, "", "/auth/callback");
    authService.acceptTokens(access, refresh);
    refreshUser()
      .then(() => navigate("/", { replace: true }))
      .catch((e) => setError(errorMessage(e)));
  }, [refreshUser, navigate]);

  return (
    <div className="auth-page" style={{ gridTemplateColumns: "1fr" }}>
      <section className="auth-form">
        <div style={{ textAlign: "center" }}>
          <Brand />
          <p className="muted" style={{ marginTop: 16 }}>
            {error ||
              (hasMissingTokens
                ? "Missing tokens in callback"
                : "Signing you in with Google…")}
          </p>
          {(error || hasMissingTokens) && (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ marginTop: 16 }}
            >
              Back to login
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
