class Player {
    constructor(color, name) {
        this.color = color;
        this.name = name;
        this.count = 0;
    }
}

let numRows = 0;
let numCols = 0;
let noOfPlayers = 0;
let playerArray = [];
let currentPlayerIndex = 0;
const playerColors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#800080', '#ff861d', '#00ffff', '#ff00ff'];

function generateInputs() {
    numRows = parseInt(document.getElementById("rows").value);
    numCols = parseInt(document.getElementById("columns").value);
    noOfPlayers = parseInt(document.getElementById("players").value);

    if (isNaN(numRows) || isNaN(numCols) || isNaN(noOfPlayers)) {
        alert("Please enter valid numbers for Rows, Columns, and Players.");
        return;
    }
    if (numRows < 5 || numRows > 20 || numCols < 5 || numCols > 20 || noOfPlayers < 1 || noOfPlayers > 8) {
        alert("Please enter numbers within the specified range.");
        return;
    }

    const nameInputsContainer = document.getElementById("nameInputsContainer");
    nameInputsContainer.innerHTML = "";

    for (let i = 0; i < noOfPlayers; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.name = `nameInput${i + 1}`;
        input.placeholder = `Player ${i + 1}'s Name`;
        nameInputsContainer.appendChild(input);
    }

    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.className = "start-button";
    startButton.textContent = "Start";
    startButton.onclick = startGame;
    nameInputsContainer.appendChild(startButton);
}

function startGame() {
    const inputs = document.querySelectorAll("#nameInputsContainer input[type='text']");
    const playerNames = Array.from(inputs).map(input => input.value.trim()).filter(value => value !== "");

    if (playerNames.length !== noOfPlayers) {
        alert("Please enter all player names.");
        return;
    }
    if (new Set(playerNames).size !== playerNames.length) {
        alert("Player names must be unique.");
        return;
    }

    playerArray = [];
    if (noOfPlayers === 1) {
        playerArray.push(new Player(playerColors[0], playerNames[0]));
        playerArray.push(new Player(playerColors[1], "AI"));  // AI player
    } else {
        playerNames.forEach((name, index) => {
            playerArray.push(new Player(playerColors[index], name));
        });
    }

    generateGrid(numRows, numCols);
}

function generateGrid(numRows, numCols) {
    let gridContainer = document.getElementById('container');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, auto)`;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let grid = document.createElement('div');
            grid.className = 'grid-box';
            grid.id = `${i}_${j}`;
            grid.textContent = '0';
            gridContainer.appendChild(grid);
        }
    }

    // Start the game
    changeShadowColor(currentPlayerIndex);
    enableGridBoxListeners();

    document.body.style.backgroundColor = "#ffffff";
    document.body.style.background = "none";
    document.getElementById("game_div").style.display = "block";
    document.querySelector(".startContainer").style.display = "none";

    const playerMenu = document.querySelector(".dropdown-menu");
    playerMenu.innerHTML = '';
    playerArray.forEach((player) => {
        let playerListItem = document.createElement('li');
        playerListItem.innerText = player.name;
        playerListItem.style.backgroundColor = player.color;
        playerMenu.appendChild(playerListItem);
    });
}

function aiMove() {
    const gridState = [...document.querySelectorAll('.grid-box')].map(box => ({
        id: box.id,
        color: box.style.backgroundColor,
        value: parseInt(box.textContent)
    }));

    const payload = {
        grid: gridState,
        rows: numRows,
        columns: numCols,
        playerColor: playerArray[currentPlayerIndex].color
    };

    fetch('YOUR_GEMINI_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer AIzaSyACqeb0_yAJTSa4CGMF5jf1t2bVhHocJIk`
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(aiResponse => {
        if (aiResponse && aiResponse.moveId) {
            editGrid(aiResponse.moveId);
        }
    })
    .catch(error => console.error("Error calling Gemini API:", error));
}

function changeState() {
    currentPlayerIndex = (currentPlayerIndex + 1) % playerArray.length;

    if (noOfPlayers === 2 && playerArray[currentPlayerIndex].name === "AI") {
        aiMove();
    }
}

// Placeholder for editGrid function
function editGrid(moveId) {
    // Implement your logic to handle the AI's move here
    console.log(`AI moved on: ${moveId}`);
}

// Additional functions like resetAndIncrementNeighbors, changeShadowColor, and enableGridBoxListeners would go here
