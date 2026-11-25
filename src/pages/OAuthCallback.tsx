import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "../components/layout/Brand";
import { useAuth } from "../context/useAuth";
import { errorMessage } from "../lib/types";
import { authService } from "../services";

type Tokens = { access: string; refresh: string };

const readTokens = (): Tokens | null => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const access = params.get("accessToken");
  const refresh = params.get("refreshToken");
  return access && refresh ? { access, refresh } : null;
};

export default function OAuthCallbackPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tokens] = useState<Tokens | null>(readTokens);
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    if (!tokens || handled.current) return;
    handled.current = true;
    window.history.replaceState(null, "", "/auth/callback");
    authService.acceptTokens(tokens.access, tokens.refresh);
    refreshUser()
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((e) => setError(errorMessage(e)));
  }, [tokens, refreshUser, navigate]);

  const failure = error || (tokens ? "" : "Missing tokens in callback");

  return (
    <div className="auth-page" style={{ gridTemplateColumns: "1fr" }}>
      <section className="auth-form">
        <div style={{ textAlign: "center" }}>
          <Brand />
          <p
            className="muted"
            style={{ marginTop: 16 }}
            role={failure ? "alert" : "status"}
          >
            {failure || "Signing you in with Google…"}
          </p>
          {failure && (
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
