const rows = 5;
const columns = 5;
//let board = [];
let board = {};




function startGame() {
    //create the board
    for (let r=0; r<rows; r++) {
        //let row = [];
        for (let c=0; c<columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList = "unchecked tile"
            document.querySelector(".grid").append(tile);
            //row.push(`${r.toString()}-${c.toString()}`);
            board[`${r.toString()}-${c.toString()}`] = false;
        }
        //board.push(row);
    }
    console.log(board);
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
                }
            }
            

            
            

            

        });
    });
});