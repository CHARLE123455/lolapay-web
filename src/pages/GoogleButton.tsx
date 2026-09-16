import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/useAuth";
import { useAuthProviders } from "../hooks/queries";
import { errorMessage } from "../lib/types";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const API_URL = import.meta.env.VITE_API_BASE_URL as string;


export function GoogleButton({ onError }: { onError: (m: string) => void }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { data: providers } = useAuthProviders();
  if (!providers?.google) return null;

  return (
    <>
      <div className="divider">or continue with</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {CLIENT_ID ? (
          <GoogleLogin
            width="400"
            onSuccess={async (cred) => {
              if (!cred.credential)
                return onError("Google did not return a token");
              try {
                await loginWithGoogle(cred.credential);
                navigate("/", { replace: true });
              } catch (e) {
                onError(errorMessage(e));
              }
            }}
            onError={() => onError("Google sign-in failed")}
          />
        ) : (
          <a className="btn btn-google" href={`${API_URL}/auth/google`}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.4 17.7 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.8c-.3 2.2-1.7 5.4-4.8 7.6l7.4 5.7c4.4-4.1 7.1-10.1 7.1-16.9z"
              />
              <path
                fill="#FBBC05"
                d="M10.4 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2 1.4-4.7 2.4-8.5 2.4-6.3 0-11.7-4-13.6-9.9l-7.8 6C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
            Google
          </a>
        )}
      </div>
    </>
  );
}
