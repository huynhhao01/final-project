import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Nav from './components/Nav';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Color from './pages/Color';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute><Nav /></ProtectedRoute>,  // Protect the home page
    children: [
      {
        path: '/seller/products',
        element: <ProtectedRoute><Products /></ProtectedRoute>, // Protect products page
      },
      {
        path: '/seller/categories',
        element: <ProtectedRoute><Categories /></ProtectedRoute>, // Protect categories page
      },
      {
        path: '/seller/color',
        element: <ProtectedRoute><Color /></ProtectedRoute>, // Protect color page
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
