import { PropsWithChildren, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import AppLayout from "@/UI/elements/layout/AppLayout";
import { AuthLayout } from "@/UI/elements/layout/AuthLayout";

import { NavRoutes } from "@/constants";

const AuthPage = lazy(() => import("@/UI/pages/AuthPage"));
const Home = lazy(() => import("@/UI/pages/HomePage"));

function ProtectedRoute({ children }: PropsWithChildren) {
  const isLoggedIn = true;
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate to={`/${NavRoutes.AUTH}`} state={{ from: location }} replace />
    );
  }

  return children;
}

function AdminRoute({ children }: PropsWithChildren) {
  const isAdminUser = false;
  const location = useLocation();

  if (!isAdminUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<AuthLayout />}>
          <Route path={`/${NavRoutes.AUTH}`} element={<AuthPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path={NavRoutes.WORK}
            element={
              <ProtectedRoute>
                <div> WorkPage </div>
              </ProtectedRoute>
            }
          />
          <Route
            path={NavRoutes.PROFILE}
            element={
              <ProtectedRoute>
                <div>ProfilePage </div>
              </ProtectedRoute>
            }
          />
          <Route
            path={NavRoutes.EMAILS}
            element={
              <AdminRoute>
                <div> MessagePage</div>
              </AdminRoute>
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
