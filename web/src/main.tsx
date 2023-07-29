import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage, SignupPage } from "./routes/index";
import { ConfirmEmailSentPage } from "./routes/confirm-email-sent-page";
import { ConfirmEmailPage } from "./routes/confirm-email-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignupPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirm-email-sent",
    element: <ConfirmEmailSentPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirm-email",
    element: <ConfirmEmailPage />,
    errorElement: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
