document.addEventListener("DOMContentLoaded", () => {
    const canvasContainer = document.querySelector('.canvas-container');
    const canvas = document.getElementById('spaceInvadersCanvas');
    const ctx = canvas.getContext('2d');

    let player, bullets, enemies, score = 0;
    let isGameRunning = false;
    let enemyDirection = 1;
    let enemySpeed = 1;
    let enemyMoveDown = 10;
    const neonColors = ['#ff00ff', '#00ffff', '#ffcc00', '#ff0066', '#66ff33', '#ff6600'];

    function startGame() {
        canvasContainer.style.display = 'block'; // Show the game container
        document.querySelector('.calendar').style.display = 'none'; // Hide calendar

        player = { x: canvas.width / 2 - 20, y: canvas.height - 40, width: 40, height: 10, speed: 15 };
        bullets = [];
        enemies = [];
        score = 0;
        isGameRunning = true;

        // Create enemies
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                const color = neonColors[Math.floor(Math.random() * neonColors.length)];
                enemies.push({ x: j * 60 + 20, y: i * 40 + 20, width: 40, height: 20, alive: true, color });
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        gameLoop();
    }

    function handleKeyDown(e) {
        if (!isGameRunning) return;
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
        if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
        if (e.key === " " && bullets.length < 5) {  // Limit bullets for challenge
            bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 12 });
        }
    }

    function gameLoop() {
        if (!isGameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Player ship
        ctx.fillStyle = '#00ff00';  // Bright neon green player
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw bullets
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            ctx.fillStyle = '#ffff00';  // Neon yellow bullets
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            if (bullet.y < 0) bullets.splice(index, 1);
        });

        // Move and draw enemies
        let hitEdge = false;
        enemies.forEach((enemy) => {
            if (enemy.alive) {
                enemy.x += enemyDirection * enemySpeed;
                if (enemy.x + enemy.width > canvas.width || enemy.x < 0) hitEdge = true;

                ctx.fillStyle = enemy.color;
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

        if (hitEdge) {
            enemies.forEach((enemy) => {
                enemy.y += enemyMoveDown;  // Move down when hitting edge
                enemyDirection *= -1;  // Change direction
            });
        }

        // Check if game is over
        if (enemies.some(enemy => enemy.alive && enemy.y + enemy.height > player.y)) {
            endGame("Game Over! The invaders won! Final Score: " + score);
        }

        // Check win condition
        if (!enemies.some(enemy => enemy.alive)) {
            endGame("Victory! You defeated the invaders! Score: " + score);
        }

        // Display score
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Poppins", sans-serif';
        ctx.fillText(`Score: ${score}`, 20, 30);

        requestAnimationFrame(gameLoop);
    }

    function endGame(message) {oh
        isGameRunning = false;
        setTimeout(() => {
            alert(message);
            stopGame();
        }, 200);
    }

    function stopGame() {
        isGameRunning = false;
        canvasContainer.style.display = 'none'; // Hide game
        document.querySelector('.calendar').style.display = 'grid'; // Show calendar
        document.removeEventListener('keydown', handleKeyDown);
    }

    // Alien button triggers the game
    document.querySelector('.alien-button').addEventListener('click', () => {
        if (!isGameRunning) startGame();  // Only start if not already running
    });

    document.querySelector('.exit-game').addEventListener('click', stopGame);
});
