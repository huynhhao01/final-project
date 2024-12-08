import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Nav from "./components/Nav";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Color from "./pages/Color";
import SideBar from "./components/SideBar";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Nav />,
    // element: <SideBar />,
    children: [
      {
        path: "/seller/products",
        element: <Products />,
      },
      {
        path: "/seller/categories",
        element: <Categories />,
      },
      {
        path: "/seller/color",
        element: <Color />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
