function component(): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.setAttribute("width", "480");
    canvas.setAttribute("height", "320");
    canvas.style.cssText = "padding: 0; margin: 0; background: #eee; display: block; margin: 0 auto;";

    const ctx = canvas.getContext("2d");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [canvas, ctx!];
}

const [canvas, ctx] = component()
document.body.appendChild(canvas);

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleDx = 7;
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks: { x: number, y: number, broken: boolean }[][] = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r] = { x: brickX, y: brickY, broken: false };
    }
}

let score = 0;

let lives = 3;

draw();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetection();

    x += dx;
    y += dy;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y >= canvas.height - ballRadius - paddleHeight && x >= paddleX && x <= paddleX + paddleWidth) {
        dy = -Math.abs(dy);
    } else if (y + dy > canvas.height - ballRadius) {
        lives--;
        if (lives <= 0) {
            alert("GAME OVER");
            document.location.reload();
        }
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
    }

    if (rightPressed) {
        paddleX += paddleDx;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= paddleDx;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function mouseMoveHandler(e: MouseEvent) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].broken) {
                continue;
            }
            const b = bricks[c][r];
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                b.broken = true;
                score++;
                if (score === brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].broken) {
                continue;
            }
            const brickX = bricks[c][r].x;
            const brickY = bricks[c][r].y;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}
