import { Navigate, Outlet, Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { AppShell } from './components/layout/AppShell';
import { FullPageSpinner, ToastProvider } from './components/ui';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import OAuthCallbackPage from './pages/OAuthCallback';
import DashboardPage from './pages/Dashboard';
import SendPage from './pages/Send';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import CardPage from './pages/Card';
import SecurityPage from './pages/Security';
import SettingsPage from './pages/Settings';
import BeneficiariesPage from './pages/Beneficiaries';

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function Home() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function PublicOnly() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/beneficiaries" element={<BeneficiariesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/card" element={<CardPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function App() {
  const tree = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider> : tree;
}
