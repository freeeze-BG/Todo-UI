import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme.js";
import { lazy } from "react";

const Layout = lazy(() => import("./components/Layout.jsx"));
const AddNote = lazy(() => import("./components/AddNote.jsx"));
const Notes = lazy(() => import("./components/Notes.jsx"));
const Login = lazy(() => import("./components/LoginUser.jsx"));
const Register = lazy(() => import("./components/RegisterUser.jsx"));
const LayoutLogForm = lazy(() => import("./components/LayoutLogForm.jsx"));
const route = createBrowserRouter([
  {
    path: "/",
    element: <LayoutLogForm />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "todo",
    element: <Layout />,
    children: [
      { index: 1, element: <Notes /> }, //defualt route
      { path: "/todo/notes/:token", element: <Notes /> },
      { path: "/todo/addnotes/:token", element: <AddNote /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={route} />
  </ThemeProvider>
);
