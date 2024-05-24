import { PropsWithChildren, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import App from "@/App.tsx";
import { NavRoutes } from "@/constants/enums.ts";

const AuthPage = lazy(() => import("@/UI/pages/AuthPage"));

function ProtectedRoute({ children }: PropsWithChildren) {
  const isLoggedIn = false;
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
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
        <Route path="/" element={<App />}>
          <Route index element={<div>HomePage </div>} />
          <Route path={NavRoutes.AUTH} element={<AuthPage />} />
          <Route
            path={NavRoutes.WORK}
            element={
              // <ProtectedRoute>
              <div> WorkPage </div>
              // </ProtectedRoute>
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
              //   <AdminRoute>
              <div> MessagePage </div>
              //   </AdminRoute>
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
