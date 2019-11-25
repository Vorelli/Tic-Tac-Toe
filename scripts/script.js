const ticTacToeManager = (function() {
    const numPlayers = 2;
    const possibleMatches = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    function renderBoard() {
        for(i in gameBoard.getBoard())
            document.querySelector(`#a${i}`).firstElementChild.textContent = gameBoard.getChar(i);
    }

    function setChar(index, char) {
        gameBoard.setChar(index, char);
        renderBoard();
    }

    function newGame() {
        for(let i = 0; i < sideLength*sideLength; i++)
            setChar(i, " ");
        playerChoice();
    };

    function _win(matches) {
        matches.forEach(element => {
            document.querySelector(`#a${element}`).classList.add('win');
        })
        console.log('win');
    }

    function _match(positions) {
        const chars = [
            document.querySelector(`#a${positions[0]}`).firstElementChild.textContent,
            document.querySelector(`#a${positions[1]}`).firstElementChild.textContent,
            document.querySelector(`#a${positions[2]}`).firstElementChild.textContent
        ];
        return !(chars[0] == '' || chars[1] == '' || chars[2] == '' || chars[0] != chars[1] || chars[0] != chars[2]);
    }

    function checkForMatches() {
        while(possibleMatches.forEach(element => {
                if(_match(element))
                    _win(element);
        }));
    }

    function boxClicked(event) {
        setChar(event.target.id[1], 'X');
        checkForMatches();
    }

    function start() {
        document.querySelectorAll('#gameBoard div').forEach(element => {
            element.addEventListener('click', boxClicked)
        });
    }

    return {start};

})()

const gameBoard = (function() {
    const sideLength = 3;
    const board = [];
    const getChar = (index) => board[index];
    const setChar = (index, char) => board[index] = char;
    const getBoard = () => board;

    return {getChar, setChar, getBoard};
})();



ticTacToeManager.start();