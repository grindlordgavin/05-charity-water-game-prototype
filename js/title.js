export let hardMode = false;

const hardButton = document.querySelector('.hard-btn');
export const playButton = document.querySelector('.play-btn');

hardButton.addEventListener('click', () => {
    hardMode = !hardMode;
    
    if (hardMode) {
        hardButton.classList.add('hard-on');
        hardButton.textContent = "Hard mode: ON";
    } else {
        hardButton.classList.remove('hard-on');
        hardButton.textContent = "Hard mode: off";
    }
})

playButton.addEventListener('click', () => {
    document.querySelector('.title-screen').classList.add('hide');

    console.log("hard mode: ", hardMode);
});