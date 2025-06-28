import { Droplet, droplets, dropletValue, setDropletValue, setRareChance, sweepDroplets } from './droplet.js';
import { jerry, shop, shopButton, shopCloseButton } from './elements.js';
import { decrementMoney, formatNumber, onMoneyChange, getMoney } from './money.js';

let jerryScale = 1;
let rareCount = 0;

const shopButtonBadge = document.querySelector('.badge');

// Store the real cost of each upgrade in an object
const upgradeCosts = {
    "droplet-spawn-rate": 35,
    "droplet-value": 50,
    "jerry-size": 100,
    "boost": 150,
    "rare-droplets": 250,
    "win-cond": 1000000
};

// Store the cost multiplier for each upgrade in an object
const upgradeCostMultipliers = {
    "droplet-spawn-rate": 1.25,
    "droplet-value": 1.25,
    "jerry-size": 2.5,
    "boost": 1.25,
    "rare-droplets": 1.25,
    "win-cond": 1.25
};

shopButton.addEventListener('click', () => {
    shop.classList.add('visible'); // Show the shop when the button is clicked
});

shopCloseButton.addEventListener('click', () => {
    shop.classList.remove('visible'); // Hide the shop when the close button is clicked
});

for (const elem of document.querySelectorAll('.upgrade')) {
    elem.addEventListener('click', (event) => {
        const costElem = elem.querySelector(".cost");
        const upgradeType = elem.dataset.upgrade;
        // Get the real cost from the upgradeCosts object
        const realCost = upgradeCosts[upgradeType];
        const multiplier = upgradeCostMultipliers[upgradeType];

        if (!decrementMoney(realCost)) return;

        // handle upgrade based on data-upgrade
        switch (upgradeType) {
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
            case "win-cond":
                // Show the win screen overlay
                const winScreen = document.getElementById('winScreen');
                winScreen.classList.add('visible');
                // Optionally hide the shop
                shop.classList.remove('visible');
                break;
            default:
                alert(`panic! i dont know what upgrade "${upgradeType}" is!`)
        }

        // Increase the real cost and update the visible cost using formatNumber
        upgradeCosts[upgradeType] = Math.floor(realCost * multiplier);
        costElem.innerText = formatNumber(upgradeCosts[upgradeType]);
    });
}

// Function to enable/disable upgrades based on player's money
function updateUpgradeStates() {
    let purchasable = 0;
    const money = getMoney();
    for (const elem of document.querySelectorAll('.upgrade')) {
        const upgradeType = elem.dataset.upgrade;
        const realCost = upgradeCosts[upgradeType];
        if (realCost > money) {
            elem.classList.add('disabled');
        } else {
            purchasable++;
            elem.classList.remove('disabled');
        }
    }

    if (purchasable > 0) {
      shopButtonBadge.classList.add('visible');
      shopButtonBadge.querySelector('span').textContent = purchasable;
    } else {
      shopButtonBadge.classList.remove('visible');
    }
}

// Register updateUpgradeStates to run whenever money changes
onMoneyChange.push(updateUpgradeStates);

// On game launch, update the visible cost of upgrades
for (const elem of document.querySelectorAll('.upgrade')) {
    const costElem = elem.querySelector('.cost');
    const upgradeType = elem.dataset.upgrade;
    if (upgradeCosts[upgradeType] !== undefined) {
        costElem.innerText = formatNumber(upgradeCosts[upgradeType]);
    }
}
// Initial update for upgrade states
updateUpgradeStates();

// Find the first element in the list of upgrades
const upgradesContainer = document.querySelector('.upgrades');
const upgradeElems = document.querySelectorAll('.outer-upgrade');
const firstUpgrade = upgradeElems[0];

// Add an animationend listener that turns on overflow-y: auto
if (firstUpgrade) {
    firstUpgrade.addEventListener('animationend', () => {
        // Enable scrolling in the shop after the animation ends
        upgradesContainer.style.overflowY = 'auto';
        console.log('Shop upgrades are now scrollable');
    });
}

// When the shop closes, turn overflow-y: hidden
shopCloseButton.addEventListener('click', () => {
    // Hide scrolling when the shop is closed
    upgradesContainer.style.overflowY = 'hidden';
    console.log('Shop upgrades are no longer scrollable');
});
