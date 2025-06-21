import { scoreLabel, shopBalanceLabel } from "./elements.js";

let money = 0;

// Exported array of functions to call when setMoney is called
export const onMoneyChange = [];



export function getMoney() {
    return money;
}

export function setMoney(newMoney) {
    money = newMoney;

    // Use formatNumber to show readable numbers for score and shop balance
    scoreLabel.textContent = formatNumber(money); // Update the score label
    shopBalanceLabel.textContent = formatNumber(money); // Update the shop balance label

    // Call all registered onMoneyChange listeners
    for (const fn of onMoneyChange) {
        fn(money);
    }
}

export function incrementMoney(amount) {
    setMoney(money + amount);
}

export function decrementMoney(amount) {
    if (amount > money) {
        return false;
    } else {
        setMoney(money - amount);
        return true;
    }
}

// Function to convert a number to a readable string (e.g., 100000 -> "100k")
export function formatNumber(num) {
    const decimals = 2; // Use this variable for all toFixed calls
    if (num >= 1000000000) {
        // Billions: 1,000,000,000 -> 1.00B
        return `${(num / 1000000000).toFixed(decimals)}B`;
    } else if (num >= 1000000) {
        // Millions: 1,000,000 -> 1.00M
        return `${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
        // Thousands: 1,000 -> 1.00k
        return `${(num / 1000).toFixed(decimals)}k`;
    } else {
        return `${num}`;
    }
}

// Cheat feature: Press grave/tilde key to get 10k money, only on localhost
if (window.location.hostname === 'localhost') {
    window.addEventListener('keydown', (event) => {
        // event.key is '`' for grave/tilde key
        if (event.key === '`') {
            // Add 10,000 money
            incrementMoney(10000);
            // Optional: log for debugging
            console.log('Cheat activated: +10,000 money');
        }
    });
}