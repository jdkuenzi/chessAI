import { FunctionComponent, useEffect, useState } from 'react';
import logo from './logo.svg'
import './App.css';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Room from './room/Room';
import Home from './home/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import RouteError from './routeError/RouteError';

type AppProps = {
  playerSocket: Socket
}

const App = () => {
  const app = 'http://localhost:4000'
  const [playerSocket, setPlayerSocket] = useLocalStorage<Socket>('playerSocket', io(app, { autoConnect: false, transports: ['websocket'], upgrade: true }))
  const [playerName, setPlayerName] = useLocalStorage<string>('playerName', 'Guest')
  const [routeError, setRouteError] = useState<string>('')
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white')
  const [roomID, setRoomID] = useState<string>('')
  const [isJoining, setIsJoining] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    playerSocket.connect()
  });

  const handleError = (err:string) => {
    setRouteError(err)
    navigate('/error')
  }

  return (
    <div className="App">
      <header className="App-header">
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6">
              Welcome player {playerName} !
              {/* 
                <Link to="">Home</Link>
                <Link to="room">Room</Link> 
              */}
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      <main className="App-main">
        <Routes>
          <Route path="/" element={
            <Home
              playerName={playerName}
              roomID={roomID}
              playerSocket={playerSocket}
              setIsJoining={setIsJoining}
              setRoomID={setRoomID}
              setPlayerColor={setPlayerColor}
              setPlayerName={setPlayerName}
              handleError={handleError}
            />
          } />
          <Route path="room/:roomID" element={
            <Room
              playerColor={playerColor}
              playerSocket={playerSocket}
              playerName={playerName}
              isJoining={isJoining}
              setPlayerColor={setPlayerColor}
              handleError={handleError}
            />
          } />
          <Route path="error" element={
            <RouteError
              err={routeError}
            />
          } />
          <Route path="*" element={
            <RouteError
              err={'Il n\'y a rien à voir ici :('}
            />
          } />
        </Routes>
      </main>
      <footer className='App-footer'>
        <img src={logo} className="" alt="logo" />
        <div>Copyright &copy; 2021 - Jean-Daniel Küenzi</div>
      </footer>
    </div>
  );
}

// Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

export default App;
