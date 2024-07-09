import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Import the layouts
import RootLayout from "./layouts/root-layout";
import DashboardLayout from "./layouts/dashboard-layout";
import AuthLayout from "./layouts/auth-layout";
// Import the components

import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import DashboardPage from "./routes/dashboard";
import Landing from "./routes/landingPage";
import Conversation from "./routes/Conversation";
import CodeGeneration from "./routes/Code";
import ImageGeneration from "./routes/ImageGeneration";
import Music from "./routes/Music";
import VideoGeneration from "./routes/VideoGeneration";
import GetUserInfoLayout from "./layouts/getUserInfoLayout";
import DashboardLayoutComponent from "./layouts/DashboardLayout";
import Settings from "./routes/Settings";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },

      {
        element: <DashboardLayout />,
        children: [
          {
            element: <GetUserInfoLayout />,
            children: [
              {
                element: <DashboardLayoutComponent />,
                children: [
                  { path: "/dashboard", element: <DashboardPage /> },
                  { path: "/conversation", element: <Conversation /> },
                  { path: "/code", element: <CodeGeneration /> },
                  { path: "/image", element: <ImageGeneration /> },
                  {
                    path: "/music",
                    element: <Music />,
                  },
                  {
                    path: "/video",
                    element: <VideoGeneration />,
                  },
                  {
                    path: "/settings",
                    element: <Settings />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "/sign-in/*", element: <SignInPage /> },
          { path: "/sign-up/*", element: <SignUpPage /> },
        ],
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
