import { PropsWithChildren, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import AppLayout from "@/UI/elements/layout/AppLayout";
import DefaultLayout from "@/UI/elements/layout/DefaultLayout";

import { NavRoutes } from "@/constants";
import { useAppSelector } from "@/store";
import { selectIsUserAdmin, selectIsUserLoggedIn } from "@/store/userSlice";

const AuthPage = lazy(() => import("@/UI/pages/AuthPage"));
const HomePage = lazy(() => import("@/UI/pages/HomePage"));
const WorkPage = lazy(() => import("@/UI/pages/WorkPage"));
const ProfilePage = lazy(() => import("@/UI/pages/ProfilePage"));
const MessagePage = lazy(() => import("@/UI/pages/MessagePage"));
const NotFoundPage = lazy(() => import("@/UI/pages/NotFoundPage"));

function ProtectedRoute({ children }: PropsWithChildren) {
  const isLoggedIn = useAppSelector(selectIsUserLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate to={`/${NavRoutes.AUTH}`} state={{ from: location }} replace />
    );
  }

  return children;
}

function AdminRoute({ children }: PropsWithChildren) {
  const isAdminUser = useAppSelector(selectIsUserAdmin);
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
        <Route element={<AppLayout />}>
          <Route
            path={NavRoutes.HOME}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={NavRoutes.WORK}
            element={
              <ProtectedRoute>
                <WorkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={NavRoutes.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={NavRoutes.EMAILS}
            element={
              <AdminRoute>
                <MessagePage />
              </AdminRoute>
            }
          />
        </Route>
        <Route element={<DefaultLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
