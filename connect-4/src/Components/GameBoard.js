import React, { useState } from "react";
import GameCircle from "./GameCircle";
import "../Game.css";
import Header from "./Header";

const NO_CIRCLES = 16;
const NO_PLAYER = 0;
const PLAYER_1 = 1;
const PLAYER_2 = 2;

const GameBoard = () => {
  const [gameBoard, setGameBoard] = useState(Array(NO_CIRCLES).fill(NO_PLAYER));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
  const [winner, setWinner] = useState(NO_PLAYER);
  const [isDraw, setIsDraw] = useState(false);
  const [vsComputer, setVsComputer] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState(null);

  const circleClicked = (id) => {
    if (gameBoard[id] !== NO_PLAYER || winner !== NO_PLAYER || isDraw) return;

    const newBoard = [...gameBoard];
    newBoard[id] = currentPlayer;

    const calculatedWinner = checkWinner(newBoard);
    if (calculatedWinner !== NO_PLAYER) {
      setGameBoard(newBoard);
      setWinner(calculatedWinner);
      return;
    }

    if (!newBoard.includes(NO_PLAYER)) {
      setGameBoard(newBoard);
      setIsDraw(true);
      return;
    }

    if (vsComputer && currentPlayer === PLAYER_1) {
      setGameBoard(newBoard);
      setCurrentPlayer(PLAYER_2);
      setSuggestedMove(null);

      setTimeout(() => {
        const emptyIndices = newBoard.map((val, idx) => val === NO_PLAYER ? idx : null).filter(i => i !== null);
        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        if (randomIdx === undefined) return;

        const compBoard = [...newBoard];
        compBoard[randomIdx] = PLAYER_2;

        const compWinner = checkWinner(compBoard);
        setGameBoard(compBoard);

        if (compWinner !== NO_PLAYER) {
          setWinner(compWinner);
        } else if (!compBoard.includes(NO_PLAYER)) {
          setIsDraw(true);
        } else {
          setCurrentPlayer(PLAYER_1);
        }
      }, 500);
    } else {
      setGameBoard(newBoard);
      setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);
      setSuggestedMove(null);
    }
  };

  const suggestMove = () => {
    const emptyIndices = gameBoard.map((val, idx) => val === NO_PLAYER ? idx : null).filter(i => i !== null);
    if (emptyIndices.length > 0) {
      setSuggestedMove(emptyIndices[0]);
    }
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [0, 5, 10, 15],
      [3, 6, 9, 12],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c, d] = pattern;
      if (
        board[a] !== NO_PLAYER &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === board[d]
      ) {
        return board[a];
      }
    }

    return NO_PLAYER;
  };

  const renderCircle = (id) => {
    const isSuggested = id === suggestedMove;
    return (
      <GameCircle
        key={id}
        id={id}
        className={`player_${gameBoard[id]} ${isSuggested ? "suggested" : ""}`}
        onCircleClicked={circleClicked}
      />
    );
  };

  const initBoard = () => {
    return gameBoard.map((_, idx) => renderCircle(idx));
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: 'white', fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={vsComputer}
            onChange={(e) => setVsComputer(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Play with Computer
        </label>
      </div>
      <Header currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} />
      <div className="gameBoard">
        {initBoard()}
      </div>
      <div style={{ marginTop: '15px' }}>
        <button className="suggestButton" onClick={suggestMove}>
          Suggest Move
        </button>
        <button
          style={{ marginLeft: '10px' }}
          onClick={() => {
            setGameBoard(Array(NO_CIRCLES).fill(NO_PLAYER));
            setCurrentPlayer(PLAYER_1);
            setWinner(NO_PLAYER);
            setIsDraw(false);
            setSuggestedMove(null);
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
