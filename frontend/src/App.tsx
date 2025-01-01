import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.ts";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.ts";
// import { io, Socket } from "socket.io-client";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <Navbar /> <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: authUser ? <HomePage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/signup",
          element: !authUser ? <SignupPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/login",
          element: !authUser ? <LoginPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/settings",
          element: authUser ? <SettingsPage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/profile",
          element: authUser ? <ProfilePage /> : <Navigate to={"/login"} />,
        },
      ],
    },
  ]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
