// Step 1: Init a game with a 10x10 grid and place 1 battleship (5 squares) and 2 destroyers (4 squares) at a random place on the grid
// Step 2: Click (or enter with keyboard) a cell and check if it hits, misses, or sinks any of the ships
// Step 3: The game ends when all ships are sunk

class Ship {
  name;
  hits = 0;
  squares;
  positions = {};

  constructor(name, squares) {
    this.name = name;
    this.squares = squares;
  }

  isSunk() {
    return this.hits === this.squares;
  }

  hitOrSank() {
    this.hits++;
    if(this.isSunk()) {
      alert(`You sank the ${this.name}!`);
    } else {
      alert(`You hit the ${this.name}!`);
    }
  }

  setPositions(row, col) {
    this.positions[`${row}-${col}`] = this.name;
  }
}

function initGame(rows = 10, columns = 10) {
  let battleship = new Ship("battleship", 5);
  let destroyer1 = new Ship("destroyer1", 4);
  let destroyer2 = new Ship("destroyer2", 4);

  document.addEventListener('DOMContentLoaded', function () {
    let gridContainer = document.getElementById('gridContainer');

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridContainer.appendChild(gridItem);

            // Make every cell focusable
            gridItem.tabIndex = 0;

            gridItem.onclick = function () {
              handleCellClick(this, i, j);
            };
      
            gridItem.addEventListener('keydown', function (event) {
              if (event.key === 'Enter' && !gridItem.classList.contains("disabled")) {
                handleCellClick(this, i, j);
              } else if (event.key === 'ArrowLeft') {
                moveFocus(this, -1);
              } else if (event.key === 'ArrowUp') {
                moveFocus(this, -columns);
              } else if(event.key === 'ArrowRight') {
                moveFocus(this, + 1)
              } else if(event.key === 'ArrowDown') {
                moveFocus(this, columns)
              }
            });
        }
    }

    // Create 1 battleship and 2 destroyers randomly on the grid: 
    markRandomSequence(gridContainer, battleship, rows, columns);
    markRandomSequence(gridContainer, destroyer1, rows, columns); 
    markRandomSequence(gridContainer, destroyer2, rows, columns);
    gridContainer.children[0].focus();
  });

  function checkEndGame() {
    if (battleship.isSunk() && destroyer1.isSunk() && destroyer2.isSunk()) {
      alert("Congratulations! You've sunk all ships. Game Over!");
      
      resetGame()
    }
  }

  function resetGame() {
    const gridContainer = document.getElementById('gridContainer');
    const gridItems = gridContainer.getElementsByClassName('grid-item');
    
    Array.from(gridItems).forEach((item) => {
      item.classList.remove(battleship.name, destroyer1.name, destroyer2.name, 'disabled');
    });
  
    battleship = new Ship("battleship", 5);
    destroyer1 = new Ship("destroyer1", 4);
    destroyer2 = new Ship("destroyer2", 4);

    markRandomSequence(gridContainer, battleship, rows, columns);
    markRandomSequence(gridContainer, destroyer1, rows, columns); 
    markRandomSequence(gridContainer, destroyer2, rows, columns);
    gridContainer.children[0].focus();
  }
  
  function moveFocus(currentCell, moveBy) {
    const index = Array.from(currentCell.parentElement.children).indexOf(currentCell);
    const nextIndex = index + moveBy;
  
    if (nextIndex >= 0 && nextIndex < currentCell.parentElement.children.length) {
      currentCell.parentElement.children[nextIndex].focus();
    }
  }

  function handleCellClick(cell, row, col) {
    if (battleship.positions[`${row}-${col}`]) {
      battleship.hitOrSank();
    } else if (destroyer1.positions[`${row}-${col}`]) {
      destroyer1.hitOrSank();
    } else if (destroyer2.positions[`${row}-${col}`]) {
      destroyer2.hitOrSank();
    } else {
      alert('You missed!');
      return;
    }
    cell.classList.add("disabled");
    checkEndGame();
  }

  function markRandomSequence(gridContainer, ship, rows, columns) {
    const isRow = Math.random() < 0.5;
    let startRow, startCol;
  
    // Avoid overlap between ships
    do {
      startRow = Math.floor(Math.random() * (rows - ship.squares));
      startCol = Math.floor(Math.random() * (columns - ship.squares));
    } while (checkCollision(startRow, startCol, ship.squares, isRow));
  
    for (let i = 0; i < ship.squares; i++) {
      const row = isRow ? startRow : startRow + i;
      const col = isRow ? startCol + i : startCol;
  
      const cell = gridContainer.children[row * columns + col];
      // Adding class name here only to show better where the ships are.
      // It needs to be removed in a real game, otherwise players can easily see where is the ship by inspecting the DOM element
      cell.classList.add(ship.name)
      ship.setPositions(row, col)
    }
  }
  
  function checkCollision(startRow, startCol, squaresNumber, isRow) {
    for (let i = 0; i < squaresNumber; i++) {
      const row = isRow ? startRow : startRow + i;
      const col = isRow ? startCol + i : startCol;
  
      if (battleship.positions[`${row}-${col}`] || 
      destroyer1.positions[`${row}-${col}`] || 
      destroyer2.positions[`${row}-${col}`]) {
        return true;
      }
    }
    
    return false;
  }
}

initGame()