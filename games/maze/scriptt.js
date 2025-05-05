const CELL_TYPES = {
    WALL: 1,
    PATH: 0
};
function goBack() {
    window.history.back();
  }
const MAZE_SIZE = 13;

// Game elements
let currentMaze = null;
let player = { x: 0, y: 0 };
let enemy = {
    x: 0,
    y: 0,
    speed: 1000,
    active: false
};
let enemyInterval;

// Generate maze with recursive backtracking algorithm
function generateMaze(complexity = 1) {
    let maze = Array.from({ length: MAZE_SIZE }, () => Array(MAZE_SIZE).fill(CELL_TYPES.WALL));
    let stack = [[1, 1]];
    maze[1][1] = CELL_TYPES.PATH;
    
    function getUnvisitedNeighbors(x, y) {
        const directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ];
        
        return directions
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([nx, ny]) => 
                nx > 0 && nx < MAZE_SIZE - 1 && 
                ny > 0 && ny < MAZE_SIZE - 1 && 
                maze[ny][nx] === CELL_TYPES.WALL
            );
    }
    
    const iterations = Math.floor(MAZE_SIZE * MAZE_SIZE * complexity);
    
    for (let i = 0; i < iterations; i++) {
        if (stack.length === 0) break;
        
        const [x, y] = stack[stack.length - 1];
        const neighbors = getUnvisitedNeighbors(x, y);
        
        if (neighbors.length > 0) {
            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[(y + ny) / 2][(x + nx) / 2] = CELL_TYPES.PATH;
            maze[ny][nx] = CELL_TYPES.PATH;
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }
    
    // Ensure start and exit are open
    maze[0][0] = CELL_TYPES.PATH;
    maze[MAZE_SIZE - 1][MAZE_SIZE - 1] = CELL_TYPES.PATH;
    
    // Force connections if needed
    if (maze[0][1] === CELL_TYPES.WALL && maze[1][0] === CELL_TYPES.WALL) {
        maze[0][1] = CELL_TYPES.PATH;
    }
    if (maze[MAZE_SIZE - 1][MAZE_SIZE - 2] === CELL_TYPES.WALL && 
        maze[MAZE_SIZE - 2][MAZE_SIZE - 1] === CELL_TYPES.WALL) {
        maze[MAZE_SIZE - 1][MAZE_SIZE - 2] = CELL_TYPES.PATH;
    }
    
    return maze;
}

// Get random valid position for enemy
function getRandomPosition() {
    const possiblePositions = [];
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            if (currentMaze[y][x] === CELL_TYPES.PATH && 
                !(x === 0 && y === 0) && 
                !(x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1)) {
                possiblePositions.push({x, y});
            }
        }
    }
    return possiblePositions[Math.floor(Math.random() * possiblePositions.length)] || {x: 1, y: 1};
}

// Enemy movement logic
function moveEnemy() {
    if (!enemy.active) return;

    const directions = [
        {x: 0, y: -1}, // up
        {x: 1, y: 0},  // right
        {x: 0, y: 1},  // down
        {x: -1, y: 0}  // left
    ];
    
    // Get valid moves
    const validMoves = directions.filter(dir => {
        const newX = enemy.x + dir.x;
        const newY = enemy.y + dir.y;
        return newX >= 0 && newY >= 0 && 
               newX < MAZE_SIZE && newY < MAZE_SIZE &&
               currentMaze[newY][newX] === CELL_TYPES.PATH;
    });

    if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        enemy.x += move.x;
        enemy.y += move.y;
    }

    // Check for collision with player
    if (enemy.x === player.x && enemy.y === player.y) {
        handleCollision();
    }

    drawMaze();
}

// Handle player-enemy collision
function handleCollision() {
    clearInterval(enemyInterval);
    enemy.active = false;
    
    if (Math.random() < 0.5) { // 50% chance to catch
        alert("Oh no! Team Rocket caught Pikachu!");
        startGame();
    } else {
        alert("Pikachu escaped Team Rocket! Keep going!");
        // Move player to safe position
        const safeDirections = [
            {x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}
        ].filter(dir => {
            const newX = player.x + dir.x;
            const newY = player.y + dir.y;
            return newX >= 0 && newY >= 0 && 
                   newX < MAZE_SIZE && newY < MAZE_SIZE &&
                   currentMaze[newY][newX] === CELL_TYPES.PATH;
        });
        
        if (safeDirections.length > 0) {
            const move = safeDirections[Math.floor(Math.random() * safeDirections.length)];
            player.x += move.x;
            player.y += move.y;
        }
        
        enemy.active = true;
        enemyInterval = setInterval(moveEnemy, enemy.speed);
        drawMaze();
    }
}

// Initialize game
function startGame() {
    const difficulty = document.getElementById("difficulty").value;
    const complexity = {
        easy: 0.7,
        medium: 1.0,
        hard: 1.5
    }[difficulty];
    
    currentMaze = generateMaze(complexity);
    player = { x: 0, y: 0 };
    
    // Set enemy at random position
    const randomPos = getRandomPosition();
    enemy = {
        x: randomPos.x,
        y: randomPos.y,
        speed: {
            easy: 1200,
            medium: 800,
            hard: 500
        }[difficulty],
        active: true
    };
    
    // Clear any existing enemy interval
    if (enemyInterval) clearInterval(enemyInterval);
    enemyInterval = setInterval(moveEnemy, enemy.speed);
    
    drawMaze();
}

// Draw the maze
function drawMaze() {
    const mazeDiv = document.getElementById("maze");
    if (!mazeDiv) return;
    
    mazeDiv.innerHTML = "";
    mazeDiv.style.gridTemplateColumns = `repeat(${MAZE_SIZE}, 40px)`;
    
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            
            if (currentMaze[y][x] === CELL_TYPES.WALL) {
                cell.classList.add("wall");
            } else {
                cell.classList.add("path");
            }
            
            // Draw player (Pikachu)
            if (y === player.y && x === player.x) {
                const rat = document.createElement("div");
                rat.className = "rat";
                cell.appendChild(rat);
            }
            
            // Draw enemy (Team Rocket)
            if (y === enemy.y && x === enemy.x) {
                const enemyElement = document.createElement("div");
                enemyElement.className = "enemy";
                cell.appendChild(enemyElement);
            }
            
            // Draw exit (Ash)
            if (y === MAZE_SIZE - 1 && x === MAZE_SIZE - 1) {
                cell.classList.add("exit");
            }
            
            mazeDiv.appendChild(cell);
        }
    }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (!currentMaze || !enemy.active) return;
    
    const moves = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };
    
    const move = moves[e.key];
    if (!move) return;
    
    const newX = player.x + move.x;
    const newY = player.y + move.y;
    
    if (newX >= 0 && newY >= 0 && 
        newX < MAZE_SIZE && newY < MAZE_SIZE && 
        currentMaze[newY][newX] === CELL_TYPES.PATH) {
        player.x = newX;
        player.y = newY;
        
        // Check for win (50% chance)
        if (player.x === MAZE_SIZE - 1 && player.y === MAZE_SIZE - 1) {
            clearInterval(enemyInterval);
            enemy.active = false;
            
            if (Math.random() < 0.5) {
                setTimeout(() => alert("⚡ Pikachu found Ash! You win! ⚡"), 50);
            } else {
                setTimeout(() => {
                    alert("Ash wasn't there! Keep searching!");
                    // Move player back slightly
                    player.x = Math.max(0, MAZE_SIZE - 2);
                    player.y = Math.max(0, MAZE_SIZE - 2);
                    enemy.active = true;
                    enemyInterval = setInterval(moveEnemy, enemy.speed);
                    drawMaze();
                }, 50);
            }
            return;
        }
        
        // Check for collision with enemy
        if (enemy.x === player.x && enemy.y === player.y) {
            handleCollision();
        } else {
            drawMaze();
        }
    }
});

// Start game when page loads
window.onload = function() {
    // Make sure required elements exist
    if (!document.getElementById("difficulty") || !document.getElementById("maze")) {
        alert("Error: Required HTML elements not found!");
        return;
    }
    startGame();
};