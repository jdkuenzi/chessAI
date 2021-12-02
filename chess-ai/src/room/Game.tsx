import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { PlayerColor } from '../types/global';
import { ChessInstance, Move, Piece, Square } from 'chess.js'
import { Position } from 'chessboardjsx';
import { Socket } from 'socket.io-client';
const Chessboard = React.lazy(() => import('chessboardjsx'))
const Chess = require('chess.js');
const Board = React.lazy(() => import('../board/Board'));

type GameProps = {
  playerColor: PlayerColor,
  playerSocket: Socket,
  roomID: string
}

type DropProps = {
    sourceSquare: Square, 
    targetSquare: Square, 
    piece: string
}

const Game: FunctionComponent<GameProps> = ({ playerColor, playerSocket, roomID }) => {

  const [chessGame, setChessGame] = useState<ChessInstance>(new Chess());
  const [position, setPosition] = useState<string>(chessGame.fen())
  const [squareStyles, setSquareStyles] = useState({})
  const [validMoves, setValidMoves] = useState<Move[]>([])

  useEffect(() => {
    playerSocket.on('oponentMove', (data:{fen:string}) => {
      console.log(data)
      console.log('-------------')
      chessGame.load(data.fen)
      console.log('oponentMove !')
      setPosition(data.fen)
      console.log('oponentMove 2!')
      console.log('-------------')
    })
  }, [playerSocket, chessGame])

  useEffect(() => {
    setSquareStyles(
      validMoves.reduce(
          (a, x) => {
            if(x.flags === chessGame.FLAGS.CAPTURE) {
              return { ...a, [x.to]: { backgroundColor: "rgba(255, 0, 0, 0.25)" } }
            } else {
              return { ...a, [x.to]: { backgroundColor: "rgba(0, 255, 0, 0.25)" } }
            } 
          },
        {}
      )
    )
  }, [validMoves, chessGame.FLAGS])

  const overSquare = (square: Square) => {
    setValidMoves(
      chessGame.moves({ verbose: true, square: square })
    )
  }

  const onDrop = (drop:DropProps) => {
    let tryMove = {'from':drop.sourceSquare, 'to':drop.targetSquare}
    let isValid = chessGame.move(tryMove)
    // console.log('-------------------------');
    // console.log(chessGame.fen())
    if (isValid) {
      // console.log(chessGame.fen())
      setPosition(chessGame.fen())
      playerSocket.emit('validMove', {roomID:roomID, fen:chessGame.fen()}, (res:{status:number}) => {
        console.log('validMove response -> ' + res.status)
        if (res.status === 200) {
          
        }
      })
    }
    // console.log('-------------------------');
  }

  return (
    <Chessboard 
      squareStyles={squareStyles} 
      onDrop={onDrop} 
      onMouseOverSquare={overSquare} 
      id="myBoard" 
      orientation={playerColor} 
      position={position}
      transitionDuration={100} 
    />
  );
}

export default Game;