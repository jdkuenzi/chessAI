import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './board/Board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Board />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload this is a test.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
