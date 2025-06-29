import { Droplet, droplets, start } from './droplet.js';
import './jerry.js';
import './shop.js';
import {playButton} from './title.js';

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaMillis = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // skip frame if deltaMillis is too high (e.g., tab was inactive)
    if (deltaMillis > 500) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // console.log(`Delta Time: ${deltaMillis} ms`);

    droplets.forEach(droplet => droplet.tick(deltaMillis));

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop); // Start the game loop

playButton.addEventListener('click', () => {
    start();

    for (let idx = 0; idx < droplets.length; idx++) {
        droplets[idx].deadMillis += idx * 300;
    }
});