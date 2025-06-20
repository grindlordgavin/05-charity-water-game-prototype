const droplet = document.querySelector('.droplet');
const gameWorld = document.querySelector('.game-world');
const jerry = document.querySelector('.jerry');
const jerryRail = document.querySelector('.jerry-rail');

droplet.parentElement.removeChild(droplet); // Remove droplet from the DOM

const initialJerryBox = jerry.getBoundingClientRect();
const jerryXOffset = initialJerryBox.left + (initialJerryBox.width / 2);

const leftMax = -initialJerryBox.width / 2;
const rightMax = jerryRail.clientWidth - initialJerryBox.width / 2;

function randomDeadMillis() {
    // Generate a random dead time between .75 to 2 seconds
    return Math.floor(Math.random() * (2000 - 750 + 1)) + 750;
}

class Droplet {
    constructor() {
        this.element = droplet.cloneNode(true);
        this.deadMillis = randomDeadMillis();
        this.positionRandomly();

        this.element.addEventListener('transitionend', this.die.bind(this));
        gameWorld.appendChild(this.element); // Add the droplet to the game world
    }

    die() {
        // ensure we're below the screen
        this.element.classList.add('notransition'); // stop transitions
        this.element.classList.add('dropped'); // ensure the droplet is dropped

        // set the dead time
        this.deadMillis = randomDeadMillis();
    }

    positionRandomly() {
        const left = jerryRail.getBoundingClientRect().left;
        const right = jerryRail.getBoundingClientRect().right;
        const xPos = left + (Math.random() * (right - left));

        this.element.style.left = `${xPos}px`;
    }

    isCollidingWithJerry() {
        const dropletBox = this.element.getBoundingClientRect();
        const jerryBox = jerry.getBoundingClientRect();

        // Check if the droplet is within the horizontal bounds of Jerry
        const isCollidingHorizontally = 
            dropletBox.left < jerryBox.right && 
            dropletBox.right > jerryBox.left;

        // Check if the droplet is within the vertical bounds of Jerry
        const isCollidingVertically = 
            dropletBox.top < jerryBox.bottom && 
            dropletBox.bottom > jerryBox.top;

        return isCollidingHorizontally && isCollidingVertically;
    }

    tick(deltaMillis) {
        // if we're dead, tick the clock down
        if (this.deadMillis >= 0) {
            this.deadMillis -= deltaMillis;

            // if deadtime is up, reset the droplet
            if (this.deadMillis <= 0) {
                this.element.classList.add('notransition'); // stop transitions

                    this.element.classList.remove('dropped'); // bring droplet back up
                    this.positionRandomly(); // reposition the droplet randomly

                this.element.classList.remove('notransition'); // allow transitions again
                this.element.classList.add('dropped'); // start the drop animation again
            }
        } else { // if we're not dead, check for collisions
            if (this.isCollidingWithJerry()) {
                console.log('Collision detected with Jerry!');
                this.die(); // Handle collision
            }
        }
    }
}

function moveJerryToX(xPos) {
    xPos = Math.max(leftMax, xPos);
    xPos = Math.min(rightMax, xPos);
    // console.log('Mouse X:', xPos);
    jerry.style.left = `${xPos}px`;
}

// attach event listener to the game world for mouse movement
gameWorld.addEventListener('mousemove', (event) => {
    moveJerryToX(event.clientX - jerryXOffset);
});

gameWorld.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Prevent default touch behavior
    if (event.touches.length === 0) return; // No touches, exit early

    const touch = event.touches[0];
    moveJerryToX(touch.clientX - jerryXOffset);
});

const droplets = [
    new Droplet(),
    new Droplet(),
    new Droplet(),
    new Droplet(),
    new Droplet(),
];

for (let idx = 0; idx < droplets.length; idx++) {
    droplets[idx].deadMillis += idx * 300;
}

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaMillis = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    droplets.forEach(droplet => droplet.tick(deltaMillis));

    // Check for collisions with Jerry
    // droplets.forEach(droplet => {
    //     if (droplet.isCollidingWithJerry()) {
    //         console.log('Collision detected with Jerry!');
    //         droplet.die(); // Handle collision
    //     }
    // });

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop); // Start the game loop