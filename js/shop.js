import { shop, shopButton } from './elements.js';

// TODO: potential upgrades purchable by the player:
// - increase droplet spawn rate
// - increase droplet value
// - idle generation of money
// - temporary heightened droplet spawn rate
// - rare droplets
// - win the game

shopButton.addEventListener('click', () => {
    shop.classList.add('visible'); // Show the shop when the button is clicked
});