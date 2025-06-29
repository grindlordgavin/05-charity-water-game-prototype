import { scoreLabel, shopBalanceLabel } from "./elements.js";

export let money = 0;

// Exported array of functions to call when setMoney is called
export const onMoneyChange = [];

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

function toPrecisionFloor(number, precision) {
  if (number === 0) return '0'.padEnd(precision + 1, '.0');

  const sign = Math.sign(number);
  const abs = Math.abs(number);

  const exp = Math.floor(Math.log10(abs));
  const scale = Math.pow(10, precision - 1 - exp);
  const floored = Math.floor(abs * scale) / scale;

  return (sign * floored).toPrecision(precision);
}

// Function to convert a number to a readable string with up to 3 digits (e.g., 123k, 12.3k, 1.23k)
export function formatNumber(num) {
    // Helper function to keep up to 3 significant digits
    function formatShort(n, suffix) {
        // Convert number to string with up to 3 digits (no trailing zeros)
        let str = toPrecisionFloor(n, 3);
        // Remove unnecessary decimal point and zeros
        str = parseFloat(str).toString();
        return `${str}${suffix}`;
    }

    if (num >= 1000000000) {
        // Billions
        return formatShort(num / 1000000000, 'B');
    } else if (num >= 1000000) {
        // Millions
        return formatShort(num / 1000000, 'M');
    } else if (num >= 1000) {
        // Thousands
        return formatShort(num / 1000, 'k');
    } else {
        // Less than 1000, show as is
        return `${num}`;
    }
}

// Cheat feature: Press grave/tilde key to get 10k money, only on localhost
if (window.location.hostname === 'localhost') {
    window.addEventListener('keydown', (event) => {
        // Grave/tilde key: event.key is '`' (grave) or '~' (tilde with shift)
        if (event.key === '`') {
            setMoney(money + 10000); // Add 10,000 money
            console.log('Cheat activated: +10,000 money');
        } else if (event.key === '~') {
            setMoney(money + 1000000); // Add 1,000,000 money
            console.log('Cheat activated: +1,000,000 money');
        }
    });
}