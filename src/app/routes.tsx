import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { Analysis } from "./components/Analysis";
import { Results } from "./components/Results";
import { History } from "./components/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/analysis/:id",
    Component: Analysis,
  },
  {
    path: "/results/:id",
    Component: Results,
  },
  {
    path: "/history",
    Component: History,
  },
]);
