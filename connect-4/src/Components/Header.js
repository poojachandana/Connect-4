import React from 'react';

const Header = ({ currentPlayer, winner, isDraw }) => {
  return (
    <div className="panel header">
      <div className="header-text">
        {winner !== 0 
          ? `Player ${winner} Wins!`
          : isDraw 
            ? "It's a Draw!" 
            : `Player ${currentPlayer} Turn`}
      </div>
    </div>
  );
};

export default Header;
