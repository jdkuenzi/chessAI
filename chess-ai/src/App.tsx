import { useCallback, useMemo, useState } from 'react';
import logo from './logo.svg'
import './App.css';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Room from './room/Room';
import Home from './home/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import RouteError from './routeError/RouteError';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { IconButton, PaletteMode } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const App = () => {
  const app = 'http://192.168.1.14:4000'
  const playerSocket = useMemo(() => io(app, { autoConnect: false, transports: ['websocket'], upgrade: true }), [])
  const [mode, setMode] = useLocalStorage<PaletteMode>('mode', 'light')
  const theme = useMemo(
    () => responsiveFontSizes(
      createTheme(
        {
          breakpoints: {
            values: {
              xs: 0,
              sm: 600,
              md: 900,
              lg: 1200,
              xl: 1536,
            },
          },
          palette: {
            mode: mode
          }
        }
      )
    ), [mode])
  const [playerName, setPlayerName] = useLocalStorage<string>('playerName', 'Guest')
  const [routeError, setRouteError] = useState<string>('')
  const [playerColor, setPlayerColor] = useState<boolean>(true)
  const [isJoining, setIsJoining] = useState<boolean>(true)

  const navigate = useNavigate()

  const handlePlayerConnection = useCallback(
    (room:string) => {
    if (playerSocket.disconnected) {
      console.log('------------------------------------')
      console.log('i\'m connecting in ' + room)
      playerSocket.connect()
      console.log(playerSocket)
      console.log('------------------------------------')
    }
  },[playerSocket])

  const handlePlayerDisconnection = useCallback(
    (room:string) => {
      console.log('------------------------------------')
      console.log('i\'m disconnecting in ' + room)
      playerSocket.disconnect()
      console.log('------------------------------------')
  },[playerSocket])

  const handleError = (err:string) => {
    setRouteError(err)
    navigate('/error', {replace: true})
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6">
              Welcome player {playerName} !
            </Typography>
            <Typography variant="body1" alignItems='center' justifyContent='center'>
              {theme.palette.mode} mode
              <IconButton onClick={() => setMode((mode === 'light')? 'dark' : 'light' )} color="inherit">
                {(theme.palette.mode === 'dark')? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      <main className="App-main">
        <Routes>
          <Route path="/" element={
            <Home
              playerName={playerName}
              playerSocket={playerSocket}
              setIsJoining={setIsJoining}
              setPlayerColor={setPlayerColor}
              setPlayerName={setPlayerName}
              handleError={handleError}
              handlePlayerConnection={handlePlayerConnection}
            />
          } />
          <Route path="room/:roomID" element={
            <Room
              playerColor={playerColor}
              playerSocket={playerSocket}
              playerName={playerName}
              isJoining={isJoining}
              setPlayerColor={setPlayerColor}
              setIsJoining={setIsJoining}
              handlePlayerConnection={handlePlayerConnection}
              handlePlayerDisconnection={handlePlayerDisconnection}
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
              err={'Il n\'y a rien à voir ici :/ 404'}
            />
          } />
        </Routes>
      </main>
      <footer className='App-footer'>
        <img src={logo} className="" alt="logo" />
        <div>Copyright &copy; 2021 - Jean-Daniel Küenzi</div>
      </footer>
    </div>
    </ThemeProvider>
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
