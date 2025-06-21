import { incrementMoney } from './state.js';
import { gameWorld, jerry, jerryRail } from './elements.js';

const droplet = document.querySelector('.droplet');
droplet.parentElement.removeChild(droplet); // Remove droplet from the DOM

function randomDeadMillis() {
    // Generate a random dead time between .75 to 2 seconds
    return Math.floor(Math.random() * (2000 - 750 + 1)) + 750;
}

function onDropletCaught() {
    incrementMoney(1); // Increment the money by 1 when a droplet is caught
}

export class Droplet {
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
        const left = jerryRail.clientLeft;
        const right = jerryRail.clientLeft + jerryRail.clientWidth;
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
                // console.log('Collision detected with Jerry!');
                this.die(); // Handle collision
                onDropletCaught(); // Call the function to handle catching the droplet
            }
        }
    }
}