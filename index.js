const rows = 5;
const columns = 5;
let board = {};
let currentBalance = 0;
let mines = 1;
let diamonds = 0;
let bet;



const pressedPlay = document.getElementById('play').addEventListener('submit', (e) => {
    e.preventDefault();

    const deposit = document.getElementById("deposit");
    let invalid = document.querySelector(".invalid");
   
    if (typeof (parseInt(deposit.value)) == "number" && parseInt(deposit.value) > 0 && parseInt(deposit.value) <= 10000) {
        setBalance(parseInt(deposit.value));
        let overlay = document.querySelector(".overlay");
        overlay.style.display = "none";
    } else if (deposit.value.trim() == "") {
        setBalance(1000);
        let overlay = document.querySelector(".overlay");
        overlay.style.display = "none";
    } else {
        invalid.style.display = "block";
        setTimeout(() => {
            invalid.style.display = "none";
        }, 4000);

    }
})




///////////////

const placedBet = document.getElementById('place-bet').addEventListener('submit', (e) => {
    e.preventDefault();

    bet = document.getElementById("bet");
    const onlyNum = /^[0-9]+(\.[0-9]+)?$/.test(bet.value);
   

    if (typeof (parseInt(bet.value)) == "number" && (parseInt(bet.value) > 0 || parseFloat(bet.value) > 0) && parseInt(bet.value) <= currentBalance && onlyNum) {
        pressedPlaceBet();
        setAllClickable();
        let cashoutBtn = document.querySelector(".cashout-btn");
        cashoutBtn.style.display = "inline-block";

        currentBalance -= bet.value;
        updateBalance(currentBalance);
    } else {
        let invalid = document.querySelector(".invalid-bet");
        invalid.style.display = "block";
        setTimeout(() => {
            invalid.style.display = "none";
        }, 2000);
    }

    
})


const pressedCashout = document.querySelector(".cashout-btn").addEventListener('click', (e) => {
    e.preventDefault();
    setAllUnclickable();

    //calc profits
    // const newBalance = (calculateMultiplier(mines, diamonds).toFixed(2) * currentBalance).toFixed(2);
    // const profit = (newBalance - currentBalance);
    // updateBalance(newBalance);
    // updateMultiplier(1);
    // resetGame();
    // console.log(currentBalance);

    const profit = (calculateMultiplier(mines, diamonds).toFixed(2) * bet.value);
    const newBalance = parseFloat(currentBalance) + parseFloat(profit);
    updateBalance(newBalance);
    updateMultiplier(1);
    resetGame();
    

})






function startGame() {
    //create the board
    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList = "unchecked tile"
            document.querySelector(".grid").append(tile);
            board[`${r.toString()}-${c.toString()}`] = false;
        }
    }

    setAllUnclickable();
    setMultiplier(1);

}
startGame();


//assign the bomb to a tile
function getRandomInt(max) { //max includes 0 and input-1
    return Math.floor(Math.random() * max);
}

function assignBomb(r, c) {
    board[`${r}-${c}`] = true;
    console.log(board);
}
assignBomb(getRandomInt(5), getRandomInt(5))



document.addEventListener("DOMContentLoaded", function() {
    let uncheckedTiles = document.querySelectorAll(".unchecked");

    uncheckedTiles.forEach(function(e) {
        e.addEventListener("click", function() {
            if (e.classList.contains("unchecked")) {
                if (board[`${e.id}`]) {
                    let gemSound = new Audio("./assets/bomb.mp3");
                    gemSound.play();

                    let cashoutBtn = document.querySelector(".cashout-btn");
                    cashoutBtn.style.display = "none";

                    e.classList.remove("unchecked");
                    e.classList.add("bomb");
                    
                    //unclickable
                    let allTiles = document.querySelectorAll(".tile");
                    allTiles.forEach((e) => {
                        e.classList.add("unclickable");
                    })
                    updateMultiplier(0);
                    updateBalance(currentBalance);
                    hitBomb();
                } else {
                    let gemSound = new Audio("./assets/gem.mp3");
                    gemSound.play();

                    setTimeout(() => {
                        gemSound.pause();
                    }, 500);

                    e.classList.remove("unchecked");
                    e.classList.add("checked");

                    //update multiplier
                    diamonds++;
                    const multiplier = (calculateMultiplier(mines, diamonds)).toFixed(2);
                    updateMultiplier(multiplier);
                }
            }
            

            
            

            

        });
    });
});



//multiplier calc
function nCr(n, r) {
    const factorial = (num) => (num <= 1 ? 1 : num * factorial(num - 1));
    return factorial(n) / (factorial(r) * factorial(n - r));
}
  
function calculateMultiplier(mines, diamonds) {
    const houseEdge = 0.01;
    return (1 - houseEdge) * nCr(25, diamonds) / nCr(25 - mines, diamonds);
}
  



//set multiplier
function setMultiplier(currentMultiplier) {
    let multiplier = document.querySelector(".multiplier");
    let multiplierNum = document.createElement("h3");
    multiplierNum.classList.add("multiplier-num");
    multiplierNum.textContent = `Multiplier: x${currentMultiplier}`;
    multiplier.appendChild(multiplierNum);
}

//update multiplier
function updateMultiplier(currentMultiplier) {
    let multiplier = document.querySelector(".multiplier-num");
    multiplier.textContent = `Multiplier: x${currentMultiplier}`; 
}

////////////////
//set balance
function setBalance(balance) {
    let wallet = document.querySelector(".balance");
    let walletBalance = document.createElement("h3");
    walletBalance.classList.add("balance-num");
    walletBalance.textContent = `Balance: £${balance}`;
    wallet.appendChild(walletBalance);
    currentBalance = balance;
}

//update balance
function updateBalance(balance) {
    let currentBalanceText = document.querySelector(".balance-num");
    currentBalanceText.textContent = `Balance: £${balance.toFixed(2)}`;
    currentBalance = balance.toFixed(2);
}


function setAllUnclickable() {
    let allTiles = document.querySelectorAll(".tile");
    allTiles.forEach((e) => {
        e.classList.add("unclickable");
    })
}


function setAllClickable() {
    let allTiles = document.querySelectorAll(".tile");
    allTiles.forEach((e) => {
        e.classList.remove("unclickable");
    })
}


function resetGame() {
    let allTiles = document.querySelectorAll(".tile");
    allTiles.forEach((e) => {
        e.classList = ("unchecked tile unclickable");
    })

    //set board to false then assign bomb
    Object.keys(board).forEach(v => board[v] = false)
    assignBomb(getRandomInt(5), getRandomInt(5))
    mines = 1;
    diamonds = 0;

    let cashoutBtn = document.querySelector(".cashout-btn");
    cashoutBtn.style.display = "none";
}

function hitBomb() {
    //set board to false then assign bomb
    Object.keys(board).forEach(v => board[v] = false)
    assignBomb(getRandomInt(5), getRandomInt(5))
    mines = 1;
    diamonds = 0;

    let cashoutBtn = document.querySelector(".cashout-btn");
    cashoutBtn.style.display = "none";
}

function pressedPlaceBet() {
    let allTiles = document.querySelectorAll(".tile");
    allTiles.forEach((e) => {
        e.classList = ("unchecked tile unclickable");
    })

    //set board to false then assign bomb
    Object.keys(board).forEach(v => board[v] = false)
    assignBomb(getRandomInt(5), getRandomInt(5))
    mines = 1;
    diamonds = 0;
}