(() => {
  const desktopQuery = window.matchMedia('(min-width: 769px)');

  const enhanceNavbar = navbar => {
    const toggle = navbar.querySelector('.menu-toggle');
    const menu = navbar.querySelector('.menu');
    const label = toggle ? toggle.querySelector('.menu-toggle__label') : null;
    if (!toggle || !menu) return;

    const OPEN_LABEL_TEXT = 'Apri il menu di navigazione';
    const CLOSE_LABEL_TEXT = 'Chiudi il menu di navigazione';

    const updateState = isOpen => {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? CLOSE_LABEL_TEXT : OPEN_LABEL_TEXT);
      if (label) {
        label.textContent = isOpen ? CLOSE_LABEL_TEXT : OPEN_LABEL_TEXT;
      }
    };

    const closeMenu = () => {
      const wasOpen = menu.classList.contains('menu--open');
      menu.classList.remove('menu--open');
      toggle.classList.remove('menu-toggle--open');
      updateState(false);
      if (wasOpen) {
        document.removeEventListener('keydown', handleKeydown);
      }
    };

    const openMenu = () => {
      if (menu.classList.contains('menu--open')) return;
      menu.classList.add('menu--open');
      toggle.classList.add('menu-toggle--open');
      updateState(true);
      document.addEventListener('keydown', handleKeydown);
    };

    const handleToggle = () => {
      if (menu.classList.contains('menu--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    const handleKeydown = event => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeMenu();
        toggle.focus();
      }
    };

    const handleLinkClick = event => {
      if (event.target.closest('a')) {
        closeMenu();
      }
    };

    const handleViewportChange = event => {
      if (event.matches) {
        closeMenu();
      }
    };

    updateState(false);

    toggle.addEventListener('click', handleToggle);
    menu.addEventListener('click', handleLinkClick);

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', handleViewportChange);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(handleViewportChange);
    }

    window.addEventListener('resize', () => {
      if (desktopQuery.matches) {
        updateState(false);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.navbar').forEach(enhanceNavbar);
  });
})();
