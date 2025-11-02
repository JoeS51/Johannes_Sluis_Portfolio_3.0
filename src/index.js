import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Random from './Random';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/random",
    element: <Random />
  },
  {
    path: "/blog",
    element: <Blog />
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
