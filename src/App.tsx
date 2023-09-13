import React from 'react';
import logo from './logo.svg';
import './App.css';
import PokeCard from './components/poke-card/poke-card.component';
import SearchPage from './pages/search-page/search-page';

function App() {
  return (
    <div className="App">
      <SearchPage/>
    </div>
  );
}

export default App;
