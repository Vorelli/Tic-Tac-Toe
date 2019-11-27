const ticTacToeManager = (function() {
    const numPlayers = 2;
    const players = [];
    let playing = false;
    let playersTurn;
    const possibleMatches = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function setChar(index, char) {
        gameBoard.setChar(index, char);
    }
    
    function getFromUser(message, conditions) {
        let temp;
        do temp = prompt(message);
        while (eval(conditions));
        return temp;
    }

    const noOneHas = (temp) => {
        for(i in players) {
            if(players[i].getSymbol()==temp) return false;
        }
        return true;
    };

    function playerChoice() {
        players.splice(0,2);
        for(let i = 0; i < numPlayers; i++){
            let playerName = getFromUser(`Enter player ${i+1}'s name:`, `!temp || temp==' ' || temp.length==0`)
            let j = 0;
            let playerChar;
            do {
                if(j>0) alert('Your symbol cannot match another player\'s');
                playerChar = getFromUser(`Enter a character to use as ${playerName}'s symbol:`, `!temp || temp==' ' || temp.length == 0 || temp.length > 1`);
                j=1;
            } while(!noOneHas(playerChar))
            players.push(player(playerName, playerChar))
        }
        playersTurn = players[0];
    }

    function newGame() {
        clearBoard();
        playerChoice();
        displayManager.renderScores();
    };

    function _win(matches) {
        matches.forEach(element => {
            document.querySelector(`#a${element}`).classList.add('win');
        })
        playing = false;
        players.forEach(player => {
            if(player.getSymbol() == document.querySelector(`#a${matches[0]}`).firstElementChild.textContent)
                player.win();
                displayManager.renderScores();
                displayManager.setWinner(player)
        })
    }

    function _match(positions) {
        const chars = [
            document.querySelector(`#a${positions[0]}`).firstElementChild.textContent,
            document.querySelector(`#a${positions[1]}`).firstElementChild.textContent,
            document.querySelector(`#a${positions[2]}`).firstElementChild.textContent
        ];
        return !(chars[0] == '' || chars[0] == ' ' || chars[1] == '' || chars[1] == ' ' || chars[2] == '' || chars[2] == ' ' || chars[0] != chars[1] || chars[0] != chars[2]);
    }

    function checkForMatches() {
        for(i in possibleMatches){
            if(_match(possibleMatches[i])){
                _win(possibleMatches[i]);
                return true;
            }
        }
        return false;
    }

    function switchPlayerTurn() {
        playersTurn = players[0] == playersTurn ? players[1] : players[0];
    }

    function start() {
        displayManager.updateButtons();
        displayManager.fixDisplay();
        newGame();
    }

    function clearBoard() {
        const sideLength = 3;
        for(let i = 0; i < sideLength*sideLength; i++)
            setChar(i, " ");
        document.querySelectorAll('#gameBoard div').forEach(element => {
            element.classList.remove('win');
        })
        playing=true;
        switchPlayerTurn();
        displayManager.renderScores();
    }

    function ping(message, args, event) {
        console.log(message);
        switch(message) {
            case 'newGame': clearBoard();break;
            case 'restart': newGame();break;
        }
    }
    const getPlayers = () => players;
    const getPlayersTurn = () => playersTurn;
    const getPlaying = () => playing;

    return {start, ping, getPlayers, getPlayersTurn, getPlaying};

})()

const gameBoard = (function() {
    const board = [];
    const getChar = (index) => board[index];
    const setChar = (index, char) => board[index] = char;
    const getBoard = () => board;

    return {getChar, setChar, getBoard};
})();

function player(name, symbol, startingWins=0) {
    const getSymbol = () => symbol;
    const getName = () => name;
    const getWins = () => startingWins;
    const win = () => startingWins++;
    const resetWins = () => startingWins = 0;
    return {getSymbol, getName, getWins, win, resetWins}
}

const displayManager = function() {
    const needsToBeCentered = [
        '#buttons',
        '#playerDisplay',
        '#gameBoard'
    ];

    const fixDisplay = function() {
        const marginLength = (window.innerWidth - 600)/2 + 'px';
        needsToBeCentered.forEach(element => {
            document.querySelector(element).style.marginLeft = marginLength;
            document.querySelector(element).style.marginRight = marginLength
        })
    }
    
    const renderBoard = function() {
        for(i in gameBoard.getBoard())
            document.querySelector(`#a${i}`).firstElementChild.textContent = gameBoard.getChar(i);
    }

    const renderScores = () => {
        document.querySelector('#playerDisplay').innerHTML = '';
        for(i in ticTacToeManager.getPlayers()){
            let temp = document.createElement('div');
            temp.classList.add('notSelectable');
            temp.textContent = `(${ticTacToeManager.getPlayers()[i].getSymbol()}) ${ticTacToeManager.getPlayers()[i].getName()}: ${ticTacToeManager.getPlayers()[i].getWins()}`;
            console.log(ticTacToeManager.playing);
            if(ticTacToeManager.getPlayers()[i] == ticTacToeManager.getPlayersTurn() && ticTacToeManager.getPlaying())
                temp.classList.add('turn');
            document.querySelector('#playerDisplay').appendChild(temp);
        }
    }

    const setWinner = (player) => {
        document.querySelectorAll('#playerDisplay div').forEach(element => {
            if(element.textContent[1] == player.getSymbol())
                console.log(element.classList)
                element.classList.remove('turn');
                element.classList.add('win');
        })
    }
    return {fixDisplay, renderBoard, renderScores, setWinner};
}();

const ticTacToeController = function() {
    const updateButtons = () => {
        document.querySelectorAll('#buttons div').forEach(button => {
            button.addEventListener('click', button.textContent == 'New Game' ? ticTacToeManager.ping.bind(button, 'newGame') : ticTacToeManager.ping.bind(button, 'restart'));
        })
    }

    function boxClicked(event) {
        if(playing) {
            if(gameBoard.getBoard()[event.target.id[1]] == '' || gameBoard.getBoard()[event.target.id[1]] == ' ') {
                setChar(event.target.id[1], playersTurn.getSymbol());
            }else return;
            if(!checkForMatches()) switchPlayerTurn();
            displayManager.renderScores();
        }
        if(!(gameBoard.getBoard().indexOf('') == -1 || gameBoard.getBoard().indexOf(' ') == -1)) playing = false;
        displayManager.renderBoard();
    }

    document.querySelectorAll('#gameBoard div').forEach(element => {
        element.addEventListener('click', boxClicked)
    });
    updateButtons();
}()

window.onresize = displayManager.fixDisplay;
ticTacToeManager.start();