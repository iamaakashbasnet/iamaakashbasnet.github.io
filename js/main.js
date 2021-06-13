window.addEventListener('DOMContentLoaded', () => {
  const currYear = document.querySelector('#currYear');
  currYear.innerHTML = new Date().getFullYear();
});
