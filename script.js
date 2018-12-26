var canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d");
    
canvas.height = (document.documentElement.clientHeight > 123
    ? document.documentElement.clientHeight : 123);
canvas.width = document.documentElement.clientWidth;

var isStarted = false,
    isLost = false,
    isWin = false,
    wasPaused = false,
    animate,
    paddleWidth = Math.floor(canvas.width / 10),
    paddleHeight = Math.floor(paddleWidth / 10),
    paddleX = (canvas.width - paddleWidth) / 2,
    paddleY = canvas.height - paddleHeight,
    paddleSpeed = Math.floor(canvas.width / 100),
    ballRadius = paddleHeight,
    x = canvas.width/2,
    y = paddleY - ballRadius,
    hr = Math.floor(ballRadius / 2),
    dx = Math.floor(Math.random() * (hr - -hr) + -hr),
    dy = -hr - Math.ceil(canvas.height / canvas.width),
    ballColor = [0, 149, 221],
    rgbColor = [0, 149, 221],
    paddleColor = "#0095DD",
    rightPressed = false,
    leftPressed = false,
    
    brickRowCount = 3,
    brickColumnCount = 10,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30,
    brickWidth = Math.floor((canvas.width - brickPadding * (brickColumnCount - 1) - brickOffsetLeft * 2) / brickColumnCount),
    brickHeight = Math.floor(brickWidth / 4),
    bricks = [],
    
    minCanvasHeight = brickOffsetTop + (brickPadding + brickHeight) * 3 + ballRadius * 2 + paddleHeight,
    
    score = brickRowCount * brickColumnCount;

displayData();

// выбор случайного цвета
function chooseRandomColor() {
    rgbColor = [];
    for (i=0; i < 3; i++) {
        rgbColor.push(Math.floor(Math.random() * (255 - 0) + 0));
    }
}

// создание массива кирпичей
for (let col = 0; col < brickColumnCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < brickRowCount; row++) {
        chooseRandomColor();
        bricks[col][row] = { x: 0, y: 0, rgb: rgbColor, status: 1 };
    }
}

// отрисовка кирпичей
function drawBricks() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status == 1) {
                var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle =
                    `rgb(${bricks[col][row].rgb[0]}, ${bricks[col][row].rgb[1]}, ${bricks[col][row].rgb[2]})`;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// отрисовка мяча
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = `rgb(${ballColor[0]}, ${ballColor[1]}, ${ballColor[2]})`;
    ctx.fill();
    ctx.strokeStyle = "#666";
    ctx.stroke();
    ctx.closePath();
}

// отрисовка ракетки
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

// общая функция отрисовки
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScoreText();
    if (isLost == true) {
        pause();
    }

    brickCollisionDetection();
    boundCollisionDetection();

    // перемещение ракетки
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    // перемещение мяча
    x += dx;
    y += dy;

    // запуск анимации
    if (isStarted == true && isWin == false) {
        animate = requestAnimationFrame(draw);
    }    
}

// автопилот после выигрыша
function drawAutopilot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScoreText();
    drawWinText();
    boundCollisionDetection();

    x += dx;
    y += dy;

    // автопилот
    paddleX = x - paddleWidth / 2;

    // запуск анимации
    if (isWin == true) {
        animate = requestAnimationFrame(drawAutopilot);
    }
}

// сброс состояния кирпичей
function resetBricks() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status == 0) {
                bricks[col][row].status = 1;
            }
        }
    }
}

// создание обработчиков событий
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// функция, определяющая нажание кнопок влево и вправо
function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
        if (isStarted == false && isLost == false && isWin == false) {
            start();
        }
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
        if (isStarted == false && isLost == false && isWin == false) {
            start();
        }
    }
    // нажание на Esc (пауза)
    if (e.keyCode == 27 && isLost == false && isWin == false) {
        if (isStarted) {
            pause();
            drawPauseText();
        }
    }
    // нажатие пробела после проигрыша или выигрыша сделает рестарт
    if (isLost == true || isWin == true) {
        if (e.keyCode == 32) {
            document.location.reload();
        }
    }
}

// функция, определяющая отпускание кнопок влево и вправо
function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

// проверка столкновения с ракеткой и стемами
function boundCollisionDetection() {
    // проверка столкновения мяча со стенами
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        if (x > canvas.width - ballRadius) {
            x = canvas.width - ballRadius;
        }
        else if (x < ballRadius) {
            x = ballRadius;
        }
    }
    // проверка столкновения с потолком
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // если шар пролетел ниже ракетки
    else if (y >= canvas.height - paddleHeight - ballRadius) {
        // касание ракетки (координаты мяча по оси x в пределах координат ракетки)
        if (x >= paddleX - ballRadius && x <= paddleX + paddleWidth + ballRadius) {
            // разная скорость полёта мяча по оси x (dx) при разных точках удара об ракетку
            var diff = Math.floor((x - paddleX - Math.floor(paddleWidth / 2)) / 10);
            dx += diff;
            // мяч отражается от ракетки только единожды
            if (dy > 0) {
                dy = -dy;
            }
            document.title = `${diff}, ${dx}, ${dy}`; // для отладки
        }
        // если шар коснулся пола (конец игры)
        else if (y > canvas.height - ballRadius) {
            drawLoseText();
            paddleColor = "red";
            isLost = true;
        }
    }
}

// обнаружение столкновений с кирпичами
function brickCollisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brick = bricks[c][r];
            // если этот кирпич отрисовывается (не сбит)
            if (brick.status == 1) {
                // если мяч вошёл в координаты кирпича (столкновение с любой стороны)
                if (y >= brick.y - ballRadius && y <= brick.y + brickHeight + ballRadius &&
                    x >= brick.x - ballRadius && x <= brick.x + brickWidth + ballRadius) {
                        // если мяч до столкновения был левее или правее кирпича, он отскакивает влево или вправо
                        if (x - dx < brick.x - ballRadius || x - dx > brick.x + brickWidth + ballRadius) {
                            dx = -dx;
                        }
                        // если был выше или ниже, тогда вверх или вниз
                        if (y - dy < brick.y - ballRadius || y - dy > brick.y + brickHeight + ballRadius) {
                            dy = -dy;
                        }
                        // кирпич не будет отрисовываться
                        brick.status = 0;
                        // изменение цвета шара на цвет последнего разбитого кирпича
                        ballColor = brick.rgb;
                        // + 1 очко
                        score--;
                        // ПОБЕДА
                        if (score == 0) {
                            isWin = true;
                            cancelAnimationFrame(animate);
                            drawAutopilot();
                        }
                }
            }
        }
    }
}

// первичная отрисовка перед стартом
draw();
checkIsHintDisplayed();

// установка частоты (таймера) обновления холста после первого перемещения ракетки
function start() {
    isStarted = true;
    draw();
    displayData();
}

// проверка, отображался ли текст с подсказками
// подсказка появляется только перед первым стартом
function checkIsHintDisplayed() {
    if (wasPaused == false) {
        score = brickRowCount * brickColumnCount;
        if (sessionStorage.getItem("isHintDisplayed") === null) {
            drawHintText();
            sessionStorage.setItem("isHintDisplayed", "true");
        }
    }
}

// отрисовка текста с подсказками управления
function drawHintText() {
    ctx.font = "48px Arial";
    var hintText1 = "Move paddle: 'A' or ←, 'D' or →";
    ctx.fillStyle = "#666";
    var hintText2 = "Pause: Esc";
    var metrics1 = ctx.measureText(hintText1);
    var metrics2 = ctx.measureText(hintText2);
    ctx.fillText(hintText1, (canvas.width - metrics1.width) / 2, (canvas.height - 48) / 2);
    ctx.fillText(hintText2, (canvas.width - metrics2.width) / 2, (canvas.height + 48) / 2);
}

// пауза (или приостановка перерисовки по таймеру)
function pause() {
    isStarted = false;
    wasPaused = true;
    cancelAnimationFrame(animate);
}


// отрисовка текста со счётом
function drawScoreText() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Bricks left: " + score, 8, 20);
}

function drawPauseText() {
    ctx.font = "64px Arial";
    ctx.fillStyle = "red";
    var pauseText = "PAUSE";
    var metrics = ctx.measureText(pauseText);
    ctx.fillText(pauseText, (canvas.width - metrics.width) / 2, canvas.height / 2);
}

function drawWinText() {
    ctx.font = "64px Arial";
    ctx.fillStyle = "#00D000";
    var winText1 = "YOU WIN! CONGRATULATIONS!";
    var metrics1 = ctx.measureText(winText1);
    ctx.fillText(winText1, (canvas.width - metrics1.width) / 2, (canvas.height - 64) / 2);
    var winText2 = "Press Space to restart";
    ctx.font = "48px Arial";
    ctx.fillStyle = "black";
    var metrics2 = ctx.measureText(winText2);
    ctx.fillText(winText2, (canvas.width - metrics2.width) / 2, (canvas.height + 48) / 2);
}

function drawLoseText() {
    ctx.font = "64px Arial";
    ctx.fillStyle = "red";
    var loseText1 = "YOU LOST";
    var metrics1 = ctx.measureText(loseText1);
    ctx.fillText(loseText1, (canvas.width - metrics1.width) / 2, (canvas.height - 64) / 2);
    var loseText2 = "Press Space to restart";
    ctx.font = "48px Arial";
    ctx.fillStyle = "black";
    var metrics2 = ctx.measureText(loseText2);
    ctx.fillText(loseText2, (canvas.width - metrics2.width) / 2, (canvas.height + 48) / 2);
}

// изменение размера окна
// всё возвращается в исходное состояние
function resize() {
    minCanvasHeight = brickOffsetTop + (brickPadding + brickHeight) * 3 + ballRadius * 2 + paddleHeight;
    canvas.height =
        (document.documentElement.clientHeight >= minCanvasHeight
            ? document.documentElement.clientHeight : minCanvasHeight);
    canvas.width = document.documentElement.clientWidth;
    brickWidth = Math.floor((canvas.width - brickPadding * (brickColumnCount - 1) - brickOffsetLeft * 2) / brickColumnCount);
    brickHeight = Math.floor(brickWidth / 4);
    paddleColor = "#0095DD";
    ballColor = [0, 149, 221];
    paddleWidth = Math.floor(canvas.width / 10);
    paddleHeight = Math.floor(paddleWidth / 10);
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight;
    paddleSpeed = Math.floor(canvas.width / 100);
    ballRadius = paddleHeight;
    hr = Math.floor(ballRadius / 2);
    dx = Math.floor(Math.random() * (hr - -hr) + -hr);
    dy = -hr - Math.ceil(canvas.height / canvas.width);
    x = canvas.width/2;
    y = paddleY - ballRadius;
    score = 0;
    isLost = isWin = wasPaused = false;
    resetBricks();
    draw();
    pause();
    displayData();
}

// разные переменные в заголовке
function displayData() {
    document.title = `${canvas.width}, ${canvas.height}, ${paddleWidth}, ${paddleHeight}`;
}