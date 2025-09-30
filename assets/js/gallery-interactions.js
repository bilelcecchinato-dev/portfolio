(() => {
  const CARD_SELECTOR = '.ai-card, .web-card';
  const getActiveClass = card => (card.classList.contains('web-card') ? 'web-card--active' : 'ai-card--active');

  let activeCard = null;
  let cards = [];

  const deactivateCard = card => {
    if (!card) return;
    card.classList.remove('ai-card--active', 'web-card--active');
    if (document.activeElement === card) {
      card.blur();
    }
    if (activeCard === card) {
      activeCard = null;
    }
  };

  const toggleCard = card => {
    if (activeCard === card) {
      deactivateCard(card);
      return;
    }

    deactivateCard(activeCard);
    card.classList.add(getActiveClass(card));
    activeCard = card;
    if (card.focus) {
      card.focus({ preventScroll: true });
    }
  };

  const handleCardClick = event => {
    const card = event.currentTarget;
    toggleCard(card);
  };

  const handleCardKeydown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const card = event.currentTarget;
      toggleCard(card);
    }
  };

  const handleDocumentClick = event => {
    if (!activeCard) return;
    if (activeCard.contains(event.target)) return;
    deactivateCard(activeCard);
  };

  const init = () => {
    cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
    if (!cards.length) return;

    cards.forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      card.addEventListener('click', handleCardClick);
      card.addEventListener('keydown', handleCardKeydown);
    });

    document.addEventListener('click', handleDocumentClick);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
