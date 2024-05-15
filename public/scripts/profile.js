// On Utilise DOMCOntentLoaded pour s'assurer que lorsque l'on trigger nos fonctions, le DOM est déjà chargé
window.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector("#form-container");
  const inputAvatar = document.querySelector("#input-avatar");

  formContainer.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });
});
