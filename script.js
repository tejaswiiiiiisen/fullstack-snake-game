const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

const output =
document.getElementById("output");

const menu =
document.getElementById("menu");

const gameOverBox =
document.getElementById("gameOverBox");

const finalScore =
document.getElementById("finalScore");

const playerNameInput =
document.getElementById("playerName");

const box = 20;

let snake;
let food;
let direction;
let score;
let game;

function startGame(){

    menu.style.display = "none";

    canvas.style.display = "block";

    gameOverBox.style.display = "none";

    snake = [
        {
            x: 200,
            y: 200
        }
    ];

    direction = "RIGHT";

    score = 0;

    food = randomFood();

    clearInterval(game);

    game = setInterval(draw, 100);

}

function randomFood(){

    return {

        x: Math.floor(
            Math.random() * 20
        ) * box,

        y: Math.floor(
            Math.random() * 20
        ) * box
    };

}

document.addEventListener(
    "keydown",
    changeDirection
);

function changeDirection(event){

    if(
        event.key === "ArrowUp" &&
        direction !== "DOWN"
    ){

        direction = "UP";

    }

    else if(
        event.key === "ArrowDown" &&
        direction !== "UP"
    ){

        direction = "DOWN";

    }

    else if(
        event.key === "ArrowLeft" &&
        direction !== "RIGHT"
    ){

        direction = "LEFT";

    }

    else if(
        event.key === "ArrowRight" &&
        direction !== "LEFT"
    ){

        direction = "RIGHT";

    }

}

function collision(head, snake){

    for(
        let i = 0;
        i < snake.length;
        i++
    ){

        if(
            head.x === snake[i].x &&
            head.y === snake[i].y
        ){

            return true;

        }

    }

    return false;

}

function draw(){

    ctx.clearRect(0, 0, 400, 400);

    for(
        let i = 0;
        i < snake.length;
        i++
    ){

        ctx.fillStyle =
        i === 0
        ? "green"
        : "lime";

        ctx.fillRect(
            snake[i].x,
            snake[i].y,
            box,
            box
        );

    }

    ctx.fillStyle = "red";

    ctx.fillRect(
        food.x,
        food.y,
        box,
        box
    );

    let snakeX = snake[0].x;

    let snakeY = snake[0].y;

    if(direction === "UP"){
        snakeY -= box;
    }

    if(direction === "DOWN"){
        snakeY += box;
    }

    if(direction === "LEFT"){
        snakeX -= box;
    }

    if(direction === "RIGHT"){
        snakeX += box;
    }

    if(
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= 400 ||
        snakeY >= 400
    ){

        gameOver();

        return;

    }

    if(
        snakeX === food.x &&
        snakeY === food.y
    ){

        score++;

        food = randomFood();

    }else{

        snake.pop();

    }

    const newHead = {

        x: snakeX,

        y: snakeY
    };

    if(
        collision(
            newHead,
            snake
        )
    ){

        gameOver();

        return;

    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";

    ctx.fillText(
        "Score : " + score,
        10,
        25
    );

}

function gameOver(){

    clearInterval(game);

    finalScore.innerText =
    "Your Score : " + score;

    gameOverBox.style.display =
    "flex";

}
async function saveScore(){

    let playerName =
    playerNameInput.value;

    if(
        playerName.trim() === ""
    ){

        playerName = "Unknown";

    }

    await fetch(
        "http://localhost:5000/api/save-score",
        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

                name: playerName,

                score: score

            })

        }
    );

    playerNameInput.value = "";

    gameOverBox.style.display =
    "none";

    canvas.style.display =
    "none";

    menu.style.display =
    "flex";

    output.innerHTML = `
    
    <h2>
    Score Saved Successfully
    </h2>

    <p>
    ${playerName} : ${score}
    </p>

    `;

}
async function showHighestScore(){

    const response =
    await fetch(
        "http://localhost:5000/api/leaderboard"
    );

    const data =
    await response.json();

    if(data.length > 0){

        output.innerHTML = `

        <h2>
        Highest Score
        </h2>

        <p>
        ${data[0].name}
        :
        ${data[0].score}
        </p>

        `;

    }

}

async function showLeaderboard(){

    const response =
    await fetch(
        "http://localhost:5000/api/leaderboard"
    );

    const data =
    await response.json();

    let text =
    "<h2>Leaderboard</h2>";

    data.forEach(
        (player, index) => {

        text += `

        <p>
        ${index + 1}.
        ${player.name}
        :
        ${player.score}
        </p>

        `;

    });

    output.innerHTML = text;

}

function showRules(){

    output.innerHTML = `

    <h2>Rules</h2>

    <p>
    Use Arrow Keys
    </p>

    <p>
    Eat Red Food
    </p>

    <p>
    Wall Or Body Touch
    = Game Over
    </p>

    `;

}