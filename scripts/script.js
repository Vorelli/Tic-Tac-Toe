//  Handles game logic and the back-end so to speak.
//  Can reach out to other methods to generate board.
const ticTacToeManager = (function() {
    const players = [];
    let playing = false;
    let playersTurn;
    const sideLength = 3;    
    const board = [];
    const possibleMatches = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const _switchPlayerTurn = () => playersTurn = players[0] == playersTurn ? players[1] : players[0];
    const _moveisValid = (index) => (board[index] == '' || board[index] == ' ');
    const _isCatScratch = () => board.indexOf(' ') == -1;
    const _checkForMatches = () => {for(i in possibleMatches) if(_match(possibleMatches[i])) return i; return -1;}

    function _clearBoard() {
        displayManager.clearBoard();
        for(let i = 0; i < sideLength*sideLength; i++)
            board[i] = ' ';
        _switchPlayerTurn();
        playing=true;
        displayManager.renderBoard();
        displayManager.renderScores();
    }

    function _win(matches) {
        playersTurn.win();
        displayManager.setWinner(matches, playersTurn)
        playing = false;
    }

    function _match(positions) {
        const chars = [board[positions[0]],board[positions[1]],board[positions[2]]];
        return !(chars[0] == ' ' || chars[1] == ' ' || chars[0] != chars[1] || chars[0] != chars[2]);
    } 

    function _tie() {
        displayManager.setTie();
        playing = false;
        displayManager.renderScores();
    }

    function _makeMove(index) {
        if(_moveisValid(index) && playing){
            board[index] = playersTurn.getSymbol();
            let i = _checkForMatches();
            if (i != -1) _win(possibleMatches[i]);
            else if(_isCatScratch()) _tie(); else _switchPlayerTurn();
        }
    }

    function _start(p) {
        players.splice(0,2);
        players.push(...p);
        _clearBoard();
        displayManager.fixDisplay();
    }
    //  Public methods
    const newGame = () => _clearBoard();
    const boxClicked = (index) => _makeMove(index);
    const start = () => _start(ticTacToeController.playerChoice());
    const getBoard = () => Array.from(board);
    const getPlayers = () => players;
    const getPlayersTurn = () => playersTurn;
    const isPlaying = () => playing

    return {newGame, boxClicked, start, getBoard, getPlayers, getPlayersTurn, isPlaying, numPlayers: 2};
})()

function player(name, symbol, startingWins=0) {
    return {getSymbol: () => symbol, getName: () => name, getWins: () => startingWins, win: () => startingWins++, resetWins: () => startingWins = 0}
}

//Handles display of the game board and everything the player sees.
const displayManager = function() {
    const needsToBeCentered = ['#buttons', '#playerDisplay', '#gameBoard', '#messageBox', '#heading'];
    let winner;
    let tie = false;
    const _addClassToSquares = (squares, tag) => {for(i in squares) document.querySelector(`#a${squares[i]}`).classList.add(tag)};
    const setTie = () => {_addClassToSquares([0,1,2,3,4,5,6,7,8], 'tie');tie=true;};
    const setWinner = (matches, player) => {_addClassToSquares(matches,'win');winner = !player ? undefined : player;};

    const renderBoard = () => {
        for(let i=0;i<ticTacToeManager.getBoard().length;i++) {
            document.querySelector(`#a${i}`).firstElementChild.textContent = ticTacToeManager.getBoard()[i]
            if(ticTacToeManager.getBoard()[i] != ' ')
                document.querySelector(`#a${i}`).classList.add('becomingVisisble');
            else
                document.querySelector(`#a${i}`).classList.remove('becomingVisisble');
        }
    };
    
    const clearBoard = function() {
        for(let i = 0; i < document.querySelectorAll('#gameBoard div').length; i++) {
            let element = document.querySelectorAll('#gameBoard div')[i];
            element.classList.remove('win');
            element.classList.remove('tie');
        }
        tie=false;
        winner=undefined;
        document.querySelector('#messageBox span').textContent = "";
        document.querySelector('#messageBox span').classList.remove('becomingVisible');
    }

    const fixDisplay = function() {
        const marginLengthForWidth = (window.innerWidth - 600)/2 + 'px';
        const marginLengthForHeight = (window.innerHeight-790)/2/2 + 'px';
        document.querySelector('#heading').style.marginTop = marginLengthForHeight;
        needsToBeCentered.forEach(element => {
            document.querySelector(element).style.marginLeft = marginLengthForWidth;
            document.querySelector(element).style.marginRight = marginLengthForWidth
        })
    }

    const renderScores = () => {
        document.querySelector('#playerDisplay').innerHTML = '';
        for(i in ticTacToeManager.getPlayers()){
            let temp = document.createElement('div');
            temp.classList.add('notSelectable');
            temp.textContent = `(${ticTacToeManager.getPlayers()[i].getSymbol()}) ${ticTacToeManager.getPlayers()[i].getName()}: ${ticTacToeManager.getPlayers()[i].getWins()}`;
            temp.player = ticTacToeManager.getPlayers()[i];
            ticTacToeManager.getPlayers()[i] == ticTacToeManager.getPlayersTurn() && ticTacToeManager.isPlaying() ? temp.classList.add('turn') : temp;
            !ticTacToeManager.isPlaying() && winner === temp.player ? temp.classList.add('win') : temp;
            if(temp.player == winner){
                document.querySelector('#messageBox span').textContent = temp.player.getName() + " wins!!!";
                document.querySelector('#messageBox span').classList.add('becomingVisible');
            }
            if(tie) { temp.classList.add('tie');document.querySelector('#messageBox span').textContent = "Catscratch! Try again!";document.querySelector('#messageBox span').classList.add('becomingVisible'); }
            else temp.classList.remove('tie');
            document.querySelector('#playerDisplay').appendChild(temp);
        }
    }
    return {fixDisplay, renderBoard, renderScores, setTie, setWinner, clearBoard};
}();

//Handles everything input from the player.
const ticTacToeController = function() {
    const players = [];
    const _noOneHas = (char) => (char!=' ') && (players.length==0 || players[0].getSymbol()!=char)
    const updateButtons = () => document.querySelectorAll('#buttons div').forEach(button => {button.addEventListener('click', button.textContent == 'New Game' ? () => ticTacToeManager.newGame() : () => ticTacToeManager.start());})
    
    function _getFromUser(message, conditions) {
        let temp;
        do temp = prompt(message);
        while (eval(conditions));
        return temp;
    }

    function playerChoice() {
        players.splice(0,2);
        for(let i = 0; i < ticTacToeManager.numPlayers; i++){
            let playerName = _getFromUser(`Enter player ${i+1}'s name:`, `!temp || temp==' ' || temp.length==0`)
            let j = 0;
            let playerChar = ' ';
            for(let j = 0; !_noOneHas(playerChar); j++) {
                if(j>0) alert('Your symbol cannot match another player\'s');
                playerChar = _getFromUser(`Enter a character to use as ${playerName}'s symbol:`, `!temp || temp==' ' || temp.length == 0 || temp.length > 1`);
            }
            players.push(player(playerName, playerChar))
        }
        return players;
    }

    document.querySelectorAll('#gameBoard div').forEach(element => {
        element.addEventListener('click', () => {
            ticTacToeManager.boxClicked(element.id[1]);
            displayManager.renderBoard();
            displayManager.renderScores();
        })
    });
    updateButtons();
    return {playerChoice};
}()

window.onresize = displayManager.fixDisplay;
setTimeout(ticTacToeManager.start, 10);