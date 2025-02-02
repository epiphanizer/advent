
const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('spaceInvadersCanvas');
const ctx = canvas.getContext('2d');

let player, bullets, enemies, score = 0;
let isGameRunning = false;
let enemyDirection = 1;
let enemySpeed = 1.5;  // Faster aliens
let enemyMoveDown = 15;  // Classic movement distance when hitting the edge
const neonColors = ['#ff00ff', '#00ffff', '#ffcc00', '#ff0066', '#66ff33', '#ff6600'];

// Player's spaceship (care-bear like character, now from image)
const playerWidth = 60;
const playerHeight = 60;
const playerImage = new Image();
playerImage.src = '/shooter.png'; // Load player image

let starfield = [];
let fractalAngle = 0;
let phrase = ''; // Variable to hold the current phrase

function startGame() {
    canvasContainer.style.display = 'block'; // Show the game container
    document.querySelector('.calendar').style.display = 'none'; // Hide calendar

    player = { x: canvas.width / 2 - playerWidth / 2, y: canvas.height - 70, width: playerWidth, height: playerHeight, speed: 8 }; // Increased speed
    bullets = [];
    enemies = [];
    score = 0;
    isGameRunning = true;

    // Generate the initial starfield
    generateStarfield();


    // Create enemies using cute alien emojis or image URLs
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            enemies.push({
                x: j * 50 + 20,
                y: i * 40 + 20,
                size: 30, // Adjusted size for aliens
                alive: true,
                emoji: '👽', // Using alien emoji as the enemy
                color: neonColors[Math.floor(Math.random() * neonColors.length)]
            });
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
        bullets.push({ x: player.x + player.width / 2 - 10, y: player.y, width: 25, height: 25, speed: 12 });
    }
}

function gameLoop() {
    if (!isGameRunning) return;

    // Draw the psychedelic background (starfield + fractal)
    drawStarfield();
    drawFractalBackground();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player using the shooter image
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw bullets (Heart-shaped lasers)
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        drawHeart(bullet.x, bullet.y);  // Draw a heart shape instead of a rectangle
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Move and draw enemies with cute alien icons (emoji)
    let hitEdge = false;
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            enemy.x += enemyDirection * enemySpeed;
            if (enemy.x + enemy.size > canvas.width || enemy.x < 0) hitEdge = true;

            // Draw alien emoji instead of rectangles
            ctx.font = `${enemy.size}px Arial`;
            ctx.fillStyle = enemy.color;
            ctx.fillText(enemy.emoji, enemy.x, enemy.y + enemy.size);  // Draw alien emoji

            // Check for bullet collision with enemies
            bullets.forEach((bullet, bulletIndex) => {
                if (bullet.x < enemy.x + enemy.size && bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.size && bullet.y + bullet.height > enemy.y) {
                    enemy.alive = false;
                    bullets.splice(bulletIndex, 1);
                    score++;
                    explodeAlien(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2);  // Call explosion function

                    // Show a motivational phrase every time an alien is destroyed
                    showMotivationalPhrase();
                }
            });
        }
    });

    // Move enemies down and change direction only once per row
    if (hitEdge) {
        enemies.forEach((enemy) => {
            enemy.y += enemyMoveDown;  // Move down when hitting edge
        });
        enemyDirection *= -1;  // Change direction
    }

    // Check if game is over
    if (enemies.some(enemy => enemy.alive && enemy.y + enemy.size > player.y)) {
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

    // Display motivational phrase
    if (phrase) {
        ctx.font = '30px "Poppins", sans-serif';
        ctx.fillStyle = '#ff1493';
        ctx.fillText(phrase, canvas.width - 200, canvas.height);  // Phrase appears off screen
    }

    requestAnimationFrame(gameLoop);
}

// Explosion effect when an alien is destroyed (subtle)
function explodeAlien(x, y) {
    let explosionSize = 10; // More subtle explosion size
    for (let i = 0; i < 25; i++) { // More particles for a subtle but noticeable effect
        ctx.beginPath();
        ctx.arc(x, y, explosionSize, 0, 2 * Math.PI);
        ctx.fillStyle = getRandomColor();  // Get a random color for the explosion
        ctx.fill();
        explosionSize += 3;  // Increase explosion size slightly
    }
}

// Draw a heart shape for the laser (bullet)
function drawHeart(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x - 7, y, 7, 0, Math.PI, false); // Left circle of the heart
    ctx.arc(x + 7, y, 7, 0, Math.PI, false); // Right circle of the heart
    ctx.lineTo(x, y + 10); // Bottom tip of the heart
    ctx.closePath();
    ctx.fillStyle = '#FF1493'; // Hot pink for the heart laser
    ctx.fill();
}

// Random color for the psychedelic explosion
function getRandomColor() {
    const colors = ['#ff00ff', '#ffcc00', '#00ffff', '#ff0066', '#ff6600', '#66ff33'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Draw a fractal background (psychedelic)
function drawFractalBackground() {
    let color1 = "#ff1493"; // Pink
    let color2 = "#00ffff"; // Cyan
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    for (let i = 0; i < 500; i++) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? color1 : color2;
        ctx.fill();

        x += Math.cos(i * 0.1) * 3;
        y += Math.sin(i * 0.1) * 3;
    }

    fractalAngle += 0.02;  // Add rotation effect to the fractal
}

// Draw the starfield background (moving stars)
function drawStarfield() {
    if (starfield.length === 0) generateStarfield(); // Generate stars if not already created

    starfield.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Move stars
        star.x += star.speedX;
        star.y += star.speedY;

        // Reset star position when it goes out of bounds
        if (star.x > canvas.width) star.x = 0;
        if (star.y > canvas.height) star.y = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y < 0) star.y = canvas.height;
    });
}

// Generate the initial starfield
function generateStarfield() {
    for (let i = 0; i < 200; i++) {
        starfield.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
        });
    }
}

// Function to show a random motivational phrase
function showMotivationalPhrase() {
    const phrases = [
        "You're saving the world!",
        "Keep it up, hero!",
        "One step closer to saving humanity!",
        "Love conquers all, including aliens!",
        "You're the best humanity has to offer!",
        "The fate of the world rests in your hands!"
    ];

    phrase = phrases[Math.floor(Math.random() * phrases.length)];
}

function endGame(message) {
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
