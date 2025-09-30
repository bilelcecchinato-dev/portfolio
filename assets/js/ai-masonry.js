(() => {
  const galleries = document.querySelectorAll('.ai-gallery, .web-gallery');
  if (!galleries.length) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const getNumericValue = (value, fallback) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const computeSpan = (card, rowSize, gap) => {
    const height = card.getBoundingClientRect().height;
    return Math.max(1, Math.round((height + gap) / (rowSize + gap)));
  };

  const setupGallery = gallery => {
    const cards = Array.from(gallery.querySelectorAll('.ai-card, .web-card'));
    if (!cards.length) return;

    const recalc = () => {
      const styles = window.getComputedStyle(gallery);
      const rowSize = getNumericValue(styles.getPropertyValue('grid-auto-rows'), 5);
      const gap = getNumericValue(styles.getPropertyValue('row-gap'), 5);
      const stackCards = mobileQuery.matches;

      cards.forEach(card => {
        if (stackCards) {
          card.style.removeProperty('grid-row-end');
        } else {
          card.style.gridRowEnd = `span ${computeSpan(card, rowSize, gap)}`;
        }
      });
    };

    const scheduleRecalc = (() => {
      let frame = null;
      return () => {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(() => {
          frame = null;
          recalc();
        });
      };
    })();

    window.addEventListener('resize', scheduleRecalc, { passive: true });
    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', scheduleRecalc);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(scheduleRecalc);
    }

    cards.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;

      const update = scheduleRecalc;

      if (img.complete) {
        update();
      } else {
        img.addEventListener('load', update, { once: true });
        img.addEventListener('error', update, { once: true });
      }
    });

    recalc();
  };

  galleries.forEach(setupGallery);
})();
