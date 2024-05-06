window.addEventListener("DOMContentLoaded", () => {
  bindWave();
});

// Liaison des événements de suppression des waves
function bindWave() {
  const elements = document.querySelectorAll(".btn-danger");
  const waveContainer = document.querySelector("#wave-list-container");

  elements.forEach(e => {
    e.addEventListener("click", $event => {
      // On récupère l'ID de la wave
      const waveId = $event.target.getAttribute("waveid");
      axios
        .delete("/waves/" + waveId)
        .then(function (response) {
          // MAJ du content  avec la réponse du serveur
          waveContainer.innerHTML = response.data;
          // Relie de nouveau les delete events des waves après la MAJ
          bindWave();
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  });
}
