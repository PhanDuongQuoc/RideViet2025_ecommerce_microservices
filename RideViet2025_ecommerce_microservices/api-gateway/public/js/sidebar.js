
  document.querySelectorAll('.has-submenu > a').forEach(menu => {
    menu.addEventListener('click', function (e) {
      e.preventDefault(); 
      const parent = this.parentElement;
      parent.classList.toggle('open');
    });
  });
