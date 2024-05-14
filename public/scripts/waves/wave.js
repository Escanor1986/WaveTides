window.addEventListener("DOMContentLoaded", () => {
  bindWave();

  // Gestionnaire d'événement pour le clic sur le bouton de confirmation de suppression
  const confirmDeleteButton = document.getElementById("confirmDelete");
  confirmDeleteButton.addEventListener("click", () => {
    console.log("test 1");

    const waveId = confirmDeleteButton.getAttribute("data-waveid");
    deleteWave(waveId);

    // Retirer la classe "show" du backdrop modal
    const backdrop = document.querySelector(".modal-backdrop");
    backdrop.classList.remove("show");
    backdrop.classList.remove("fade");
    backdrop.remove();
  });
});

// Liaison des événements de suppression des vagues
function bindWave() {
  const elements = document.querySelectorAll(".first-delete-button");
  elements.forEach(e => {
    e.addEventListener("click", $event => {
      console.log($event);
      const waveId = $event.target.getAttribute("waveid");

      // Mettre à jour l'attribut data-waveid du bouton de confirmation de suppression dans la modal
      const confirmDeleteButton = document.getElementById("confirmDelete");
      confirmDeleteButton.setAttribute("data-waveid", waveId);
      console.log(waveId);
    });
  });
}

// Fonction pour supprimer une vague
function deleteWave(waveId) {
  axios
    .delete("/waves/" + waveId)
    .then(function (response) {
      // Mettre à jour le contenu avec la réponse du serveur
      const waveContainer = document.querySelector("#wave-list-container");
      waveContainer.innerHTML = response.data;
      // Relier de nouveau les événements de suppression des vagues après la mise à jour
      bindWave();
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
