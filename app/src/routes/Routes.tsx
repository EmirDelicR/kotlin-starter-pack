import { PropsWithChildren, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import AppLayout from "@/UI/elements/layout/AppLayout";
import DefaultLayout from "@/UI/elements/layout/DefaultLayout";

import { NavRoutes } from "@/constants";

const AuthPage = lazy(() => import("@/UI/pages/AuthPage"));
const HomePage = lazy(() => import("@/UI/pages/HomePage"));
const WorkPage = lazy(() => import("@/UI/pages/WorkPage"));
const ProfilePage = lazy(() => import("@/UI/pages/ProfilePage"));

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
        <Route element={<DefaultLayout />}>
          <Route path={`/${NavRoutes.AUTH}`} element={<AuthPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={NavRoutes.HOME} element={<HomePage />} />

          <Route path={NavRoutes.WORK} element={<WorkPage />} />
          <Route path={NavRoutes.PROFILE} element={<ProfilePage />} />
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
