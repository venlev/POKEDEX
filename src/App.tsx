import React from 'react';
import './App.css';
import SearchPage from './pages/search-page/search-page';
import WelcomePage from './pages/welcome-page/welcome-page';
import { Routes, Route } from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<WelcomePage/>}></Route>
        <Route path='/search' element={<SearchPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
