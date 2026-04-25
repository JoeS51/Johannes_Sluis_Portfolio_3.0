import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DarkModeProvider } from './Components/DarkModeContext';

const App = lazy(() => import('./App'));
const Random = lazy(() => import('./Random'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SshPortfolio = lazy(() => import('./pages/SshPortfolio'));
const AboutPage = lazy(() => import('./pages/portfolio/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/portfolio/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/portfolio/ContactPage'));

const RouteFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background-color, #fff)',
      color: 'var(--text-color, #111)',
    }}
  >
    Loading...
  </div>
);

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
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/projects",
    element: <ProjectsPage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/blog",
    element: <Blog />
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />
  },
  {
    path: "/ssh-portfolio",
    element: <SshPortfolio />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </DarkModeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
