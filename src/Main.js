import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Random from './Random';
import App from './App';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

export default function Main() {
  return (
    <Routes>
      <Route exact path='/' element={<App />}></Route>
      <Route exact path='/random' element={<Random />}></Route>
      <Route exact path='/blog' element={<Blog />}></Route>
      <Route exact path='/blog/:slug' element={<BlogPost />}></Route>
    </Routes>
  );
}
