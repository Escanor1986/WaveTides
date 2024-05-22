window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button[data-action]");

  function updateWaveCount(waveId, action, newCounts) {
    const waveCard = document
      .querySelector(`button[data-waveid="${waveId}"]`)
      .closest(".wave-card");
    waveCard.querySelector(".likes-count").textContent = newCounts.likes;
    waveCard.querySelector(".dislikes-count").textContent = newCounts.dislikes;
  }

  function likeDislikeWave(waveId, action) {
    axios
      .post(`/waves/${waveId}/${action}`)
      .then(response => {
        updateWaveCount(waveId, action, response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const waveId = button.getAttribute("data-waveid");
      const action = button.getAttribute("data-action");
      likeDislikeWave(waveId, action);
    });
  });
});
