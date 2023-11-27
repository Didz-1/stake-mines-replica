const rows = 5;
const columns = 5;
let board = {};
let currentBalance = 0;
let mines = 1;
let diamonds = 0;




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
    console.log(board);



    //set balance
    let wallet = document.querySelector(".balance");
    let walletBalance = document.createElement("h3");
    walletBalance.textContent = `Balance: ${currentBalance}`;
    wallet.appendChild(walletBalance);

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

                    

                    e.classList.remove("unchecked");
                    e.classList.add("bomb");
                    
                    //unclickable
                    let allTiles = document.querySelectorAll(".tile");
                    allTiles.forEach((e) => {
                        e.classList.add("unclickable");
                    })
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


