document.querySelector('.canvas-container').style.display = 'block'; // Show the game canvas
const canvas = document.getElementById('spaceInvadersCanvas');
const ctx = canvas.getContext('2d');

let player, bullets, enemies, score = 0;
let isGameRunning = true;

function startGame() {
    player = { x: canvas.width / 2 - 20, y: canvas.height - 40, width: 40, height: 10, speed: 5 };
    bullets = [];
    enemies = [];
    score = 0;
    isGameRunning = true;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            enemies.push({ x: j * 60 + 20, y: i * 40 + 20, width: 40, height: 20, alive: true });
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    gameLoop();
}

function handleKeyDown(e) {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
    if (e.key === " " && bullets.length < 3) {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 8 });
    }
}

function gameLoop() {
    if (!isGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    enemies.forEach((enemy, index) => {
        if (enemy.alive) {
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            bullets.forEach((bullet, bulletIndex) => {
                if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                    enemy.alive = false;
                    bullets.splice(bulletIndex, 1);
                    score++;
                }
            });
        }
    });

    if (enemies.some(enemy => enemy.alive && enemy.y + enemy.height > player.y)) {
        alert("Game Over! Score: " + score);
        stopGame();
    }

    requestAnimationFrame(gameLoop);
}

function stopGame() {
    isGameRunning = false;
    document.removeEventListener('keydown', handleKeyDown);
    document.querySelector('.canvas-container').style.display = 'none';
    document.querySelector('.calendar').style.display = 'grid';
}

document.querySelector('.exit-game').addEventListener('click', stopGame);
startGame();
