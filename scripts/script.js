const ticTacToeManager = (function() {
    const players = [];
    let playing = false;
    let playersTurn;
    const sideLength = 3;    
    const board = [];
    const possibleMatches = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    const _switchPlayerTurn = () => playersTurn = players[0] == playersTurn ? players[1] : players[0];
    const _moveisValid = (index) => (board[index] == '' || board[index] == ' ');

    function _clearBoard() {
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
        return !(chars[0] == ' ' || chars[1] == ' ' || chars[2] == ' ' || chars[0] != chars[1] || chars[0] != chars[2]);
    }

    function _checkForMatches() {
        for(i in possibleMatches) if(_match(possibleMatches[i])) return true;
        return false;
    }

    function _makeMove(index) {
        if(_moveisValid(index) && playing){
            board[index] = playersTurn.getSymbol();
            if (_checkForMatches()) {
                playing = false;
                _win(possibleMatches[i]);
            } else _switchPlayerTurn();
        }
    }

    function _start(p) {
        players.splice(0,2);
        players.push(...p);
        _clearBoard();
        displayManager.fixDisplay();
    }

    function ping(message, event, arg) {
        console.log(message);
        switch(message) {
            case 'newGame': _clearBoard();break;
            case 'boxClicked': _makeMove(event.id[1]);break;
            case 'start': _start(ticTacToeController.playerChoice());break;
        }
    }

    return {_clearBoard, ping, getBoard: (() => Array.from(board)), getPlayers : (() => players), getPlayersTurn : (() => playersTurn), getPlaying: (() => playing), numPlayers: () => 2};
})()

function player(name, symbol, startingWins=0) {
    return {getSymbol: () => symbol, getName: () => name, getWins: () => startingWins, win: () => startingWins++, resetWins: () => startingWins = 0}
}

const displayManager = function() {
    const needsToBeCentered = ['#buttons', '#playerDisplay', '#gameBoard'];
    let winner;
    
    const clearBoard = function() {
        for(let i = 0; i < document.querySelectorAll('#gameBoard div').length; i++) {
            let element = document.querySelectorAll('#gameBoard div')[i];
            element.classList.remove('win');
        }
    }

    const fixDisplay = function() {
        const marginLength = (window.innerWidth - 600)/2 + 'px';
        needsToBeCentered.forEach(element => {
            document.querySelector(element).style.marginLeft = marginLength;
            document.querySelector(element).style.marginRight = marginLength
        })
    }
    
    const renderBoard = () => {for(let i=0;i<ticTacToeManager.getBoard().length;i++) document.querySelector(`#a${i}`).firstElementChild.textContent = ticTacToeManager.getBoard()[i]};

    const renderScores = () => {
        document.querySelector('#playerDisplay').innerHTML = '';
        for(i in ticTacToeManager.getPlayers()){
            let temp = document.createElement('div');
            temp.classList.add('notSelectable');
            temp.textContent = `(${ticTacToeManager.getPlayers()[i].getSymbol()}) ${ticTacToeManager.getPlayers()[i].getName()}: ${ticTacToeManager.getPlayers()[i].getWins()}`;
            temp.player = ticTacToeManager.getPlayers()[i];
            if(ticTacToeManager.getPlayers()[i] == ticTacToeManager.getPlayersTurn() && ticTacToeManager.getPlaying())
                temp.classList.add('turn');
            console.log(temp.player);
            console.log(temp.player == winner);
            if(!ticTacToeManager.getPlaying() && winner === temp.player)
                temp.classList.add('win');
            document.querySelector('#playerDisplay').appendChild(temp);
        }
    }

    const setWinner = (matches, player) => {
        winner = !player ? undefined : player;
        for(i in matches) document.querySelector(`#a${matches[i]}`).classList.add('win');
    }
    return {fixDisplay, renderBoard, renderScores, setWinner, clearBoard};
}();

const ticTacToeController = function() {
    const players = [];
    const updateButtons = () => {
        document.querySelectorAll('#buttons div').forEach(button => {
            button.addEventListener('click', button.textContent == 'New Game' ? 
            () => {
                ticTacToeManager.ping('newGame');
                displayManager.clearBoard();
            }
            : ticTacToeManager.ping.bind('start'));
        })
    }
    
    function _getFromUser(message, conditions) {
        let temp;
        do temp = prompt(message);
        while (eval(conditions));
        return temp;
    }

    const _noOneHas = (char) => {
        if(char==' ') return false;
        for(i in players) if(players[i].getSymbol()==char) return false;
        return true;
    };

    function playerChoice() {
        players.splice(0,2);
        for(let i = 0; i < ticTacToeManager.numPlayers(); i++){
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
            ticTacToeManager.ping('boxClicked', element,);
            displayManager.renderBoard();
            displayManager.renderScores();
        })
    });
    updateButtons();
    return {playerChoice};
}()

window.onresize = displayManager.fixDisplay;
ticTacToeManager.ping('start');