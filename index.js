// World : Object that contains all of the different "things".
//         snapshot of instance in time

// Engine: Read current state of World, then calcurate changes.
//         responsible for transition one snapshot to another

// Runner: Get the Engine and World work together

// Render: Whenever Engine updates, show them on the screen.

// Body: Shape that we are displaying.

// -- Boiler Plate Starts --

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 6;
const cellsVertical = 4;

const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
// Remove ball's gravity or entire things
const { world } = engine;
// World is created along with Engine instance

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// -- Boiler Plate Ends --

// Walls

const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, walls);

//! Maze generation

//1) Create a grid of cells
//2) Pick a random starting cell
//3) For that cell, build a randomly-ordered list of neighbors
//4) neighbor has been visited, remove it from list
//5) For each remaining neighbor, remove the wall between them
//6) Go back to 3) Repeat for this new neigbor

// -- First way

// const grid = [];

// for (let i = 0; i < 3; i++) {
//   grid.push([]);

//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }

// console.log(grid);

// -- Second way

const grid2 = Array(3).fill(Array(3).fill(false));
grid2[0].push(true);
// [ (4) […], (4) […], (4) […] ]
// Single array in memory placed at every index.
// Change one array results every array

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

// [f,f,f]
// [f,f,f]
// [f,f,f]

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

// [f,f]
// [f,f]
// [f,f]

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));
// [f,f,f]
// [f,f,f]

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row,col], then return

  if (grid[row][column]) return;

  // Mark this cell as being visited. F => T

  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbors

  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // == For each neighbor... ==

  for (let neigbor of neighbors) {
    const [nextRow, nextColumn, direction] = neigbor;

    // See if that neighbor is out of bounds

    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue; // Move to next iteration
    }

    // If we have visited that neighbor, continue to next neigbor

    if (grid[nextRow][nextColumn]) continue;

    // Remove a wall from either horizontals or verticals

    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }
  // Visit that next cell
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  // console.log(row);

  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      3,
      {
        label: "wall",
        isStatic: true,
        render: { fillStyle: "red" },
      }
    );

    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      3,
      unitLengthY,
      {
        isStatic: true,
        label: "wall",
        render: { fillStyle: "red" },
      }
    );

    World.add(world, wall);
  });
});

//! Goal

const goal = Bodies.rectangle(
  // unitLength * (cells - 1) + unitLength / 2,
  // unitLength * (cells - 1) + unitLength / 2,
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  { isStatic: true, label: "goal", render: { fillStyle: "green" } }
);

World.add(world, goal);

//! Ball

const ballRadious = Math.min(unitLengthX, unitLengthY) / 4;

const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadious, {
  label: "ball",
  render: { fillStyle: "blue" },
});

World.add(world, ball);

document.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;

  // console.log(x, y);

  if (e.keyCode === 87) {
    Body.setVelocity(ball, { x: x, y: y - 5 });
  }

  if (e.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y: y });
  }

  if (e.keyCode === 83) {
    Body.setVelocity(ball, { x: x, y: y + 5 });
  }

  if (e.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y: y });
  }
});

//! Win condition

Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];

    // if (collision.bodyA.label === "goal" && collision.bodyB.label === "ball") {
    //   console.log("User won!");
    // }

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      console.log("User won!");
      engine.world.gravity.y = 1;

      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });

      document.querySelector(".winner").classList.remove("hidden");
    }
  });
});

// There is only one event object exists. It gets reused every time events occur.

// After run the callback functions, Properties of event object get removed.
