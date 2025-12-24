//DOM Elements
const gameBoard = document.getElementById('gameBoard');
const statusText = document.getElementById('status-text');
const playerScore = document.getElementById('playerScore');
const computerScore = document.getElementById('computerScore');
const drawScore = document.getElementById('drawScore');

//Game State variable
let board = []; //2D array to represent game board
let currentPlayer = 'X'; //Track current player (X-human O-computer)
let gameActive = true; //track if game is sill active
let scores = {
    player: 0,
    computer: 0,
    draws: 0
}

function initializeGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    currentPlayer = 'X'; //human always start
    gameActive = true;
    statusText.textContent = 'Your Turn';

    createBoard();
}

/**
 * create the visual game board
 */
function createBoard() {
    gameBoard.innerHTML = '';

    //create 3x3 grid 9 cells
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.row = row; //store row position
            cell.dataset.col = col; //store column position

            cell.addEventListener('click', () =>
                handleCellClick(row, col, cell));

            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(row, col, cell) {
    if (board[row][col] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(row, col, cell, 'X');

    if (checkEndGame()) {
        return;
    }

    //switch to computer turn
    currentPlayer = 'O';
    statusText.textContent = 'Computer thinking...';

    setTimeout(()=>{
        if(gameActive){
            computerMove();
        }
    }, 1000);
}

function makeMove(row, col, cellElement, player) {
    board[row][col] = player; //update board array
    cellElement.textContent = player; //add visual display
    cellElement.classList.add(player.toLowerCase());
    cellElement.classList.add('animate');
    cellElement.disabled = true;
}

function computerMove(){
    if(!gameActive){
        return;
    }

    /**
     * 1- try to win
     * 2- try to block player win
     * 3- take center if avalible
     * 4- take random avalible post
     */
    let move =findWinningMove('O') ||
    findWinningMove('X') ||
                 getCenterMove() ||
                getRandomMove();
    if(!move){
        move = getRandomMove();
    }

    if(move){
        const cellElement = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        makeMove(move.row, move.col, cellElement, 'O');

        if(checkEndGame()){
            return;
        }

        currentPlayer = 'X';
        statusText.textContent = 'Your Turn';
    }
    function findWinningMove(player){
        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                if(board[row][col] == ''){

                    //tempratily place the player symbol
                    board[row][col] = player;
                    if(checkWinner()){
                        board[row][col] = '';
                        return {row, col};
                    }
                    //remove the temp symbol
                    board[row][col] = '';
                }
            }
        }
        return null;
    }
    function getCenterMove(){
        if(board[1][1]==''){
            return {row: 1, col:1};
        }
    }

    function getRandomMove(){
        const availableMove = [];

        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                if(board[row][col] === ''){
                    availableMove.push({row, col});
                }
            }
        }

        if (availableMove.length > 0){
            const randomIndex = Math.floor(Math.random() * availableMove.length);
            return availableMove[randomIndex];
        }
        return null;       
    }    
}

function checkWinner (){
    for(let row = 0; row < 3; row++){
           if(board[row][0] !== '' &&
           board[row][0] === board[row][1] &&
           board[row][1] === board[row][2]
           )

           
            return board[row][0];    
    }
      // check columns
    for (let col = 0; col < 3; col++) {
        if (board[0][col] !== '' &&
            board[0][col] === board[1][col] &&
            board[1][col] === board[2][col])
            return board[0][col];
        }

        // check diagonals
        if (board[0][0] !== '' &&
            board[0][0] === board[1][1] &&
            board[1][1] === board[2][2]){
                return board[0][0];
            }
            
        if (board[2][0] !== '' &&
            board[2][0] === board[1][1] &&
            board[1][1] === board[0][2]){
                return board[2][0];
            }
           return null; 
        }

function resetGame (){
    gameBoard.style.opacity = '0.5';
    setTimeout(()=>{
        gameBoard.style.opacity = '1';
        initializeGame();
    }, 500);
}

function isGameBoardFull(){
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
            if(board[row][col] == ''){
                return false;
            }
        }
    }
    return true;
}

function checkEndGame() {
    const winner = checkWinner();

    if (winner) {
        gameActive = false;

        if (winner === 'X') {
            statusText.textContent = 'You win! 🥇'
            scores.player++;
            playerScore.textContent = scores.player;
        } else {
            statusText.textContent = 'Computer win! 💻'
            scores.computer++;
            computerScore.textContent = scores.computer;
        }
        return true;
    }
    //check for draw , board is full
    if (isGameBoardFull()) {
        gameActive = false;
        statusText.textContent = "It's a Draw! 🤝";
        scores.draws++;
        drawScore.textContent = scores.draws;
    }

    return false;
}

function highlightCell(row, col) {
    for(let row=0; row<3; row++){
        if(board[row][0] == '' && 
        board[row][1] == '' &&
        board[row][2] == ''
        ){
            for(let col=0; col<3; col++){
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add('Winner ');
            }
        }
       
    }
}
document.addEventListener('DOMContentLoaded', function () {
    initializeGame();
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', function(){
            statusText.textContent = 'Your Turn';
            resetGame();
        });
    }
})