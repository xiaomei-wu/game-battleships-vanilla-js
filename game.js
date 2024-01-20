// Step 1: Init a game with grid 10x10 and place 1 battleship (5 squares) and 2 destroyers (4 squares) at the random place on the grid
// Step 2: Play click (or enter with keyboard) a cell eg. A5, check if the cell hits, misses, or sinks any of the battleship or destroyers
// Step 3: The game ends when all ships are sunk

class Ship {
  name;
  hits = 0;
  squares;

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


}

function initGame(rows, columns) {
  const battleship = new Ship("battleship", 5);
  const destroyer1 = new Ship("destroyer1", 4);
  const destroyer2 = new Ship("destroyer2", 4);

  document.addEventListener('DOMContentLoaded', function () {
    let gridContainer = document.getElementById('gridContainer');

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridContainer.appendChild(gridItem);

            gridItem.onclick = function() {
              if (this.dataset.shipType === battleship.name) {
                battleship.hitOrSank();
                this.classList.add("disabled")
                checkEndGame()
                return;
              }
          
              if(this.dataset.shipType === destroyer1.name) {
                destroyer1.hitOrSank();
                this.classList.add("disabled")
                checkEndGame()
                return;
              }
          
              if(this.dataset.shipType === destroyer2.name) {
                destroyer2.hitOrSank();
                this.classList.add("disabled")
                checkEndGame()
                return;
              }

              alert('You missed!');
            }
        }
    }

    /*
    Create 1 battleship and 2 destroyers randomly: 
    1 random array with sequence of 5
    2 random arrays with sequence of 4
    */
    markRandomSequence(gridContainer, 5, battleship);
    markRandomSequence(gridContainer, 4, destroyer1); 
    markRandomSequence(gridContainer, 4, destroyer2);
  });

  function checkEndGame() {
    if (battleship.isSunk() && destroyer1.isSunk() && destroyer2.isSunk()) {
      alert("Congratulations! You've sunk all ships. Game Over!");
      
      resetGame()
    }
  }

  function resetGame() {
    setTimeout(function(){
      location.reload();
    }, 2000);
  }
}

function markRandomSequence(gridContainer, squaresNumber, ship) {
  const isRow = Math.random() < 0.5;
  let startRow, startCol;

  // Avoid overlap between ships
  do {
    startRow = Math.floor(Math.random() * (squaresNumber + 1));
    startCol = Math.floor(Math.random() * (squaresNumber + 1));
  } while (checkCollision(gridContainer, startRow, startCol, squaresNumber, isRow));

  for (let i = 0; i < squaresNumber; i++) {
    const row = isRow ? startRow : startRow + i;
    const col = isRow ? startCol + i : startCol;

    const cell = gridContainer.children[row * 10 + col];
    cell.classList.add(ship.name)
    cell.dataset.shipType = ship.name;
  }
}

function checkCollision(gridContainer, startRow, startCol, squaresNumber, isRow) {
  for (let i = 0; i < squaresNumber; i++) {
    const row = isRow ? startRow : startRow + i;
    const col = isRow ? startCol + i : startCol;

    const cell = gridContainer.children[row * 10 + col];
    if (cell.dataset.shipType) {
      return true;
    }
  }
  return false;
}

initGame(10, 10)