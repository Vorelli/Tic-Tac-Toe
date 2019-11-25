const ticTacToeManager = (function() {
    const numPlayers = 2;

    function renderBoard() {
        for(i in gameBoard.getBoard())
            document.querySelector(`#a${i}`).firstElementChild.textContent = gameBoard.getChar(i);
    }

    function setChar(index, char) {
        gameBoard.setChar(index, char);
        renderBoard();
    }

    const newGame = () => {
        for(let i = 0; i < sideLength*sideLength; i++)
            setChar(i, " ");
        playerChoice();
    };

    return {renderBoard};
})()

const gameBoard = (function() {
    const sideLength = 3;
    const board = [];
    const getChar = (index) => board[index];
    const setChar = (index, char) => board[index] = char;
    const getBoard = () => board;

    return {getChar, setChar, getBoard};
})();



ticTacToeManager.renderBoard();