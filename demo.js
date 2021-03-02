// World : Object that contains all of the different "things".
//         snapshot of instance in time

// Engine: Read current state of World, then calcurate changes.
//         responsible for transition one snapshot to another

// Runner: Get the Engine and World work together

// Render: Whenever Engine updates, show them on the screen.

// Body: Shape that we are displaying.

// -- Boiler Plate Starts --

const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const width = 800;
const height = 600;

const engine = Engine.create();
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

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// -- Boiler Plate Ends --

// Walls

const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
];

World.add(world, walls);

// Random Shapes

for (let i = 0; i < 20; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35, {
        render: {
          fillStyle: "red",
        },
      })
    );
  }
}
