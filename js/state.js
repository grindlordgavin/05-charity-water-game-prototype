import { scoreLabel, shopBalanceLabel } from "./elements.js";

let money = 0;

export function getMoney() {
    return money;
}

export function setMoney(newMoney) {
    money = newMoney;

    scoreLabel.textContent = `${money}`; // Update the score label
    shopBalanceLabel.textContent = `${money}`; // Update the shop balance label
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