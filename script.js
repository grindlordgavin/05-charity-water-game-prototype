const droplet = document.querySelector('.droplet');
const gameWorld = document.querySelector('.game-world');
const jerry = document.querySelector('.jerry');
const jerryRail = document.querySelector('.jerry-rail');

droplet.parentElement.removeChild(droplet); // Remove droplet from the DOM

const jerryBox = jerry.getBoundingClientRect();
const jerryXOffset = jerryBox.left + (jerryBox.width / 2);

const leftMax = -jerryBox.width / 2;
const rightMax = jerryRail.clientWidth - jerryBox.width / 2;

function newDroplet() {
    return droplet.cloneNode(true);
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

setInterval(() => {
    const newDropletElement = newDroplet();

    const left = jerryRail.getBoundingClientRect().left;
    const right = jerryRail.getBoundingClientRect().right;
    const xPos = left + (Math.random() * (right - left));

    newDropletElement.style.left = `${xPos}px`;
    // newDropletElement.style.left = `${Math.random() * gameWorld.clientWidth}px`;

    gameWorld.appendChild(newDropletElement);
    newDropletElement.addEventListener('transitionend', () => {
        console.log('Droplet animation ended');
        newDropletElement.parentElement.removeChild(newDropletElement);
    });

    setTimeout(() => newDropletElement.classList.add('dropped'), 50);

    console.log('New droplet created at:', newDropletElement.getBoundingClientRect().left, xPos);
}
, 1000); 