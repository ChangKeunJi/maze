// World : Object that contains all of the different "things".
//         snapshot of instance in time

// Engine: Read current state of World, then calcurate changes.
//         responsible for transition one snapshot to another

// Runner: Get the Engine and World work together

// Render: Whenever Engine updates, show them on the screen.

// Body: Shape that we are displaying.

// -- Boiler Plate Starts --

const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const cells = 3;

const engine = Engine.create();
const { world } = engine;
// World is created along with Engine instance

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// -- Boiler Plate Ends --

// Walls

const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
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

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row,col], then return
  // Mark this cell as being visited. F => T
  // Assemble randomly-ordered list of neighbors
  // == For each neighbor... ==
  // See if that neighbor is out of bounds
  // If we have visited that neighbor, continue to next neigbor
  // Remove a wall from either horizontals or verticals
  // Visit that next cell
};

stepThroughCell(startRow, startColumn);
