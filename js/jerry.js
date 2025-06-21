import { gameWorld, jerry, jerryRail } from './elements.js';

const initialJerryBox = jerry.getBoundingClientRect();
const jerryXOffset = initialJerryBox.left + (initialJerryBox.width / 2);

const leftMax = -initialJerryBox.width / 2;
const rightMax = jerryRail.clientWidth - initialJerryBox.width / 2;

function moveJerryToX(xPos) {
    xPos = Math.max(leftMax, xPos);
    xPos = Math.min(rightMax, xPos);
    // console.log('Mouse X:', xPos);
    jerry.style.left = `${xPos}px`;
}

// attach event listener to the game world for mouse movement
gameWorld.addEventListener('mousemove', (event) => {
    // console.log('mousemove');
    moveJerryToX(event.clientX - jerryXOffset);
});

gameWorld.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Prevent default touch behavior
    if (event.touches.length === 0) return; // No touches, exit early

    const touch = event.touches[0];
    moveJerryToX(touch.clientX - jerryXOffset);
});