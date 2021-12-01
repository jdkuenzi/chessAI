import Chessboard from 'chessboardjsx'
import { FunctionComponent } from 'react';

type BoardProps = {
  position?: string
  orientation?: "white" | "black"
}

const Board: FunctionComponent<BoardProps> = ({position = "start", orientation = "white"}) => {
  return (
    <Chessboard id="myBoard" orientation={orientation} position={position} transitionDuration={800} />
  );
}

export default Board;