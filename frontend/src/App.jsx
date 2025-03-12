import Header from './components/Header/Header';
import './App.css'
import UserProfile from './components/userProfile/userProfile';
import Match from './components/match/Match.jsx';
import Pace from './components/pace/Pace.jsx';
import ChessBoard from './components/chessBoard/ChessBoard.jsx';  
import Anotation from './components/anotation/Anotation.jsx';
import { useState } from 'react';

function App() {
    const [gameMoves, setGameMoves] = useState([]);

    const handleMove = (move) => {
        setGameMoves(prevMoves => [...prevMoves, move]);
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
            <ChessBoard onMove={handleMove} />
            <Anotation moves={gameMoves} />
        </>
    );
}

export default App;
