import Chessboard from 'chessboardjsx'
import { FunctionComponent, useState } from 'react';
import { Chess, ChessInstance } from 'chess.js'

type BoardProps = {
  position?: string
  orientation?: "white" | "black"
}

const Board: FunctionComponent<BoardProps> = ({position = "start", orientation = "white"}) => {

  const [chessGame, setChessGame] = useState<ChessInstance>(Chess());

  // const boardID = 'myBoard'
  // const chessBoard = 

  return (
    // <>
    //   <script src="https://code.jquery.com/jquery-2.1.4.js" />
    //   <script 
    //     src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"
    //     integrity="sha384-8Vi8VHwn3vjQ9eUHUxex3JSN/NFqUg3QbPyX8kWyb93+8AC/pPWTzj+nHtbC5bxD"
    //     crossOrigin="anonymous"
    //   />
    //   <link 
    //     rel="stylesheet"
    //     href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
    //     integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
    //     crossOrigin="anonymous"
    //   />
    //   <div id={boardID}></div>
    // </>
    <Chessboard id="myBoard" orientation={orientation} position={chessGame.fen()} transitionDuration={800} />
  );
}

export default Board;