import Header from './components/Header/Header';
import './App.css'
import UserProfile from './components/userProfile/userProfile';
import Match from './components/match/Match.jsx';
import Pace from './components/pace/Pace.jsx';
import ChessBoard from './components/chessBoard/ChessBoard.jsx';  
import Anotation from './components/anotation/Anotation.jsx';
import { useState } from 'react';
import { GameState } from './components/chessBoard/utils/GameState';
import { CheckService } from './components/chessBoard/utils/CheckService';
function App() {
    const [gameMoves, setGameMoves] = useState([]);
    const [boardState, setBoardState] = useState(null);

    const handleMove = (move, newBoardState, isCapture, currentGameState) => {
        // Get the piece information from the board state
        const fromSquare = move.substring(0, 2);
        const fromRow = 8 - parseInt(fromSquare[1]);
        const fromCol = fromSquare.charCodeAt(0) - 'a'.charCodeAt(0);
        
        // Get the piece from the current game state
        const piece = currentGameState.board[fromRow][fromCol];
        
        // Create new game state to check for check/checkmate
        const newGameState = new GameState();
        newGameState.board = newBoardState;
        newGameState.isWhiteTurn = !currentGameState.isWhiteTurn;
        
        // Check if the move results in check or checkmate
        const opponentColor = currentGameState.isWhiteTurn ? 'black' : 'white';
        const isCheck = CheckService.isKingInCheck(newGameState, opponentColor);
        const isCheckmate = isCheck && CheckService.isCheckmate(newGameState, opponentColor);

        setGameMoves(prevMoves => [...prevMoves, {
            notation: move,
            piece: piece,
            isCapture: isCapture,
            isCheck: isCheck,
            isCheckmate: isCheckmate
        }]);
        setBoardState(newBoardState);
    };

    return (
        <>
            <Header />
            <div className='user-profile-wrapper'>
                <UserProfile />
                <div className='match-pace-container'>
                    <Match />
                    <Pace/>
                </div>
                <UserProfile />
            </div>
            <ChessBoard onMove={handleMove}/>
            <Anotation moves={gameMoves} boardState={boardState} />
        </>
    );
}

export default App;
