// This script adds a click event to the restart button to reload the page
const restartBtn = document.querySelector('.restart-btn');
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        // Reload the page to restart the game
        window.location.reload();
    });
}
