import { Droplet, droplets, dropletValue, setDropletValue, setRareChance, sweepDroplets } from './droplet.js';
import { jerry, shop, shopButton, shopCloseButton } from './elements.js';
import { decrementMoney } from './money.js';

let jerryScale = 1;
let rareCount = 0;

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

shopCloseButton.addEventListener('click', () => {
    shop.classList.remove('visible'); // Hide the shop when the close button is clicked
});

for (const elem of document.querySelectorAll('.upgrade')) {
    elem.addEventListener('click', (event) => {
        const costElem = elem.querySelector(".cost");
        const price = Number(costElem.innerText);

        if (!decrementMoney(price)) return;

        // handle upgrade based on data-upgrade
        switch (elem.dataset.upgrade) {
            case "droplet-spawn-rate":
                droplets.push(new Droplet());
                droplets.push(new Droplet());
                droplets.push(new Droplet());
                break;
            case "jerry-size":
                jerryScale *= 1.25;
                jerry.style.transform = `scale(${jerryScale})`;
                break;
            case "droplet-value":
                setDropletValue(Math.ceil(dropletValue * 1.5));
                break;
            case "rare-droplets":
                rareCount += 1;
                // asymtotically approach 1
                setRareChance(1 - (1 / ((rareCount / 5) + 1)));
                break;
            case "boost":
                const count = Math.min(100, droplets.length);
                for (let i = 0; i < count; i++)
                    droplets.push(new Droplet());
                // sweep the droplets we spawned after 10 seconds
                setTimeout(() => sweepDroplets(count), 10000); 
                break;
            default:
                alert(`panic! i dont know what upgrade "${elem.dataset.upgrade}" is!`)
        }

        costElem.innerText = String(Math.floor(price * 1.25));
    });
}