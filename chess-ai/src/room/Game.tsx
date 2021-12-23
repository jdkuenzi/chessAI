import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { ChessInstance, Move, PieceType, Square } from 'chess.js'
import { Socket } from 'socket.io-client';
import { Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
const Chessboard = React.lazy(() => import('chessboardjsx'))
const Chess = require('chess.js');

const KingFillIcon = React.lazy(() => import('../assets/king-fill'));
const KingOutlineIcon = React.lazy(() => import('../assets/king-outline'));

type GameProps = {
  playerColor: boolean,
  playerSocket: Socket,
  oponentName: string,
  roomID: string
}

type DropProps = {
  sourceSquare: Square,
  targetSquare: Square,
  piece: string
}

type Board = ({
  type: PieceType,
  color: 'w' | 'b'
} | null)[][]

function arrayEquals(a: Move[], b: Move[]) {
  return a.length === b.length &&
    a.every((val, index) => val.san === b[index].san);
}

const Game: FunctionComponent<GameProps> = ({ playerColor, playerSocket, roomID, oponentName }) => {

  const theme: Theme = useTheme()
  const chessGame: ChessInstance = useMemo(() => new Chess(), []);
  const orientation = useMemo(() => (playerColor) ? 'white' : 'black', [playerColor])
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true)
  const itsMyTurn = useMemo<boolean>(() => (playerColor === isWhiteTurn) ? true : false, [isWhiteTurn, playerColor])
  const [isInCheck, setIsInCheck] = useState<boolean>(false)
  const [isInCheckMate, setIsInCheckMate] = useState<boolean>(false)
  const [position, setPosition] = useState<string>(chessGame.fen())
  const [validMoves, setValidMoves] = useState<Move[]>([])

  const calcWidth = (obj:{screenWidth:number, screenHeight:number}):number => {
    return (obj.screenWidth > theme.breakpoints.values.sm)? 560 : obj.screenWidth-50
  }

  const isKingOnSquare = (board: Board, i: number, j: number, color: string) => {
    return (board[i][j]?.type === 'k' && board[i][j]?.color === color)
  }

  const getSquareNotation = (row: number, col: number) => {
    row = Math.abs(row - 8)
    return String.fromCharCode(97 + col) + row.toString()
  }

  const getKingSquare = useMemo(() => {
    if (itsMyTurn && (isInCheck || isInCheckMate)) {
      console.log('je recalcule getkingsquare');
      let board: Board = chessGame.board()
      let color = (playerColor) ? 'w' : 'b'
      for (let row = 0; row < board.length; row++) {
        if (playerColor) { // White
          for (let col = board[0].length - 1; col > 0; col--) {
            if (isKingOnSquare(board, row, col, color)) {
              return getSquareNotation(row, col)
            }
          }
        } else { // Black
          for (let col = 0; col < board[0].length; col++) {
            if (isKingOnSquare(board, row, col, color)) {
              return getSquareNotation(row, col)
            }
          }
        }
      }
    }
    return ''
  }, [chessGame, playerColor, itsMyTurn, isInCheck, isInCheckMate])

  const squareStyles = useMemo(() => {
    console.log('je recalcule squareStyles')
    let temp = validMoves.reduce(
      (a, x) => {
        if (x.san.includes('+')) {
          return { 
            ...a, 
            [x.to]: { backgroundColor: "rgba(255, 165, 0, 0.75)" }
          }
        } else if (x.san.includes('#')) {
          return { 
            ...a, 
            [x.to]: { backgroundColor: "rgba(255, 0, 0, 1)" } 
          }
        } else if (x.flags === "np") {
          return { 
            ...a, 
            [x.to]: { backgroundColor: "rgba(165, 55, 253, 0.25)" } 
          }
        }else if (x.flags === chessGame.FLAGS.CAPTURE) {
          return { 
            ...a, 
            [x.to]: { backgroundColor: "rgba(255, 0, 0, 0.25)" } 
          }
        } else {
          return { 
            ...a, 
            [x.to]: { backgroundColor: "rgba(0, 255, 0, 0.25)" } 
          }
        }
      },
      {}
    )

    if (getKingSquare !== '') {
      console.log('case de votre roi : ' + getKingSquare)
      temp = (isInCheckMate)? {...temp, [getKingSquare]: { backgroundColor: "rgba(255, 0, 0, 1)" } } : {...temp, [getKingSquare]: { backgroundColor: "rgba(255, 165, 0, 0.75)" } }
    }
    return temp
  }, [validMoves, chessGame, getKingSquare, isInCheckMate])

  useEffect(() => {
    playerSocket.on('oponentMove', (data: { fen: string }) => {
      if (chessGame.load(data.fen)) {
        setPosition(data.fen)
        console.log('send 200 to oponentMove')
      }
    })
  }, [playerSocket, chessGame])

  useEffect(() => {
    console.log('je regarde les règles du jeux ! ' + chessGame.turn())
    console.log('in_check :' + chessGame.in_check());
    console.log('in_checkmate :' + chessGame.in_checkmate())
    setIsInCheck(chessGame.in_check())
    setIsInCheckMate(chessGame.in_checkmate())
    chessGame.in_draw()
    chessGame.insufficient_material()
    setIsWhiteTurn(chessGame.turn() === 'w')
  }, [chessGame, position])

  const onMouseOverSquare = (square: Square) => {
    if (itsMyTurn) {
      let moves = chessGame.moves({ verbose: true, square: square })
      if (!arrayEquals(moves, validMoves)) {
        console.log(validMoves)
        console.log(moves)
        setValidMoves(moves)
      }
    }
  }

  // const onMouseOutSquare = (square: Square) => {
  //   if (validMoves.length) {
  //     setValidMoves([])
  //   }
  // }

  const onDrop = (drop: DropProps) => {
    let tryMove = { 'from': drop.sourceSquare, 'to': drop.targetSquare }
    let isValid = chessGame.move(tryMove)
    // console.log('-------------------------');
    // console.log(chessGame.fen())
    if (isValid) {
      // console.log(chessGame.fen())
      playerSocket.emit('validMove', { roomID: roomID, fen: chessGame.fen() }, (res: { status: number }) => {
        // console.log('validMove response -> ' + res.status)
        if (res.status === 200) {
          setPosition(chessGame.fen())
        } else {
          chessGame.undo()
        }
        setValidMoves([])
      })
    }
    // console.log('-------------------------');
  }

  const boardHeader = useMemo(() => {
    return (
      <>
        <Typography variant="h6" color="initial">
          Your oponent is {oponentName}
        </Typography>
        <Typography variant="h6" color="primary">
          Turn is {(isWhiteTurn) ? 'white' : 'black'}
        </Typography>
        {(isWhiteTurn) ? <KingOutlineIcon viewBox='0 0 45 45' /> : <KingFillIcon viewBox='0 0 45 45' />}
      </>
    )
  }, [oponentName, isWhiteTurn])

  return (
    <>
      {boardHeader}
      <Chessboard
        squareStyles={squareStyles}
        allowDrag={() => itsMyTurn}
        onDrop={onDrop}
        onMouseOverSquare={onMouseOverSquare}
        id="myBoard"
        orientation={orientation}
        position={position}
        transitionDuration={100}
        calcWidth={calcWidth}
        boardStyle={{
          boxShadow: `10px 10px 15px rgba(0, 0, 0, 0.75)`
        }}
      />
    </>
  );
}

export default Game;