import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Random from './Random';
import App from './App';
import Articles from './Articles';

export default function Main() {
  return (
    <Routes>
      <Route exact path='/' element={<App />}></Route>
      <Route exact path='/random' element={<Random />}></Route>
      <Route exact path='/articles' element={<Random />}></Route>
    </Routes>
  );
}
