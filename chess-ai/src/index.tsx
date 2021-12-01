import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';
import { BrowserRouter } from 'react-router-dom';

const app = 'http://localhost:4000'
const playerSocket = io(app, {autoConnect: true, transports: ['websocket'], upgrade: true})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App playerSocket={playerSocket} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
