// ArtLens mockup — interazione swipe minimale
// Solo demo visiva: niente persistenza, niente logica reale.

(function () {
  const card = document.getElementById('card');
  if (!card) return;

  const works = [
    {
      no: '003 / 100',
      cat: 'Cat. № VG–1889–074 · MoMA, New York',
      title: 'La notte <em>stellata</em>',
      author: 'Vincent van Gogh',
      year: '1889',
      tags: ['Olio su tela', 'Post-impressionismo', 'Notturno', 'Spirale', 'Saint-Rémy'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    },
    {
      no: '004 / 100',
      cat: 'Cat. № KH–1831–001 · Met Museum, NY',
      title: 'La grande onda di <em>Kanagawa</em>',
      author: 'Katsushika Hokusai',
      year: '1831',
      tags: ['Xilografia', 'Ukiyo-e', 'Movimento', 'Blu di Prussia', 'Edo'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/800px-The_Great_Wave_off_Kanagawa.jpg',
    },
    {
      no: '005 / 100',
      cat: 'Cat. № GK–1908–001 · Belvedere, Vienna',
      title: 'Il <em>bacio</em>',
      author: 'Gustav Klimt',
      year: '1907–08',
      tags: ['Olio e oro', 'Simbolismo', 'Foglia oro', 'Secessione viennese'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
    },
    {
      no: '006 / 100',
      cat: 'Cat. № EM–1893–062 · Nasjonalmuseet, Oslo',
      title: 'L\'<em>urlo</em>',
      author: 'Edvard Munch',
      year: '1893',
      tags: ['Tempera, pastello', 'Espressionismo', 'Linea ondulata'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
    },
  ];

  let idx = 0;
  let dragging = false;
  let startX = 0;
  let dx = 0;

  function render() {
    const w = works[idx % works.length];
    const cardNo = card.querySelector('.card-no');
    const img = card.querySelector('.card-image img');
    const labelNo = card.querySelector('.label-no');
    const h2 = card.querySelector('.card-label h2');
    const author = card.querySelector('.label-meta .author');
    const year = card.querySelector('.label-meta .year');
    const tagsEl = card.querySelector('.label-tags');

    if (cardNo) cardNo.textContent = '№ ' + w.no;
    if (img) img.src = w.img;
    if (labelNo) labelNo.textContent = w.cat;
    if (h2) h2.innerHTML = w.title;
    if (author) author.textContent = w.author;
    if (year) year.textContent = w.year;
    if (tagsEl) tagsEl.innerHTML = w.tags.map((t) => `<span>${t}</span>`).join('');
  }

  function release(direction) {
    const sign = direction === 'right' ? 1 : direction === 'left' ? -1 : 0;
    if (sign === 0) {
      card.style.transition = 'transform 240ms ease';
      card.style.transform = '';
      card.classList.remove('dragging-left', 'dragging-right');
      return;
    }
    card.style.transition = 'transform 360ms ease, opacity 360ms ease';
    card.style.transform = `translateX(${sign * 800}px) rotate(${sign * 18}deg)`;
    card.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % works.length;
      render();
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '1';
      card.classList.remove('dragging-left', 'dragging-right');
      requestAnimationFrame(() => {
        card.style.transition = 'transform 240ms ease, opacity 240ms ease';
      });
    }, 360);
  }

  card.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    const rot = dx * 0.06;
    card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    if (dx > 50) {
      card.classList.add('dragging-right');
      card.classList.remove('dragging-left');
    } else if (dx < -50) {
      card.classList.add('dragging-left');
      card.classList.remove('dragging-right');
    } else {
      card.classList.remove('dragging-left', 'dragging-right');
    }
  });

  card.addEventListener('pointerup', () => {
    dragging = false;
    if (dx > 140) release('right');
    else if (dx < -140) release('left');
    else release('none');
    dx = 0;
  });

  card.addEventListener('pointercancel', () => {
    dragging = false;
    release('none');
    dx = 0;
  });

  // Action buttons
  document.querySelector('.action-like')?.addEventListener('click', () => release('right'));
  document.querySelector('.action-dislike')?.addEventListener('click', () => release('left'));
  document.querySelector('.action-save')?.addEventListener('click', () => {
    const btn = document.querySelector('.action-save');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => (btn.style.transform = ''), 240);
  });
  document.querySelector('.action-skip')?.addEventListener('click', () => {
    idx = (idx - 1 + works.length) % works.length;
    render();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') release('right');
    if (e.key === 'ArrowLeft') release('left');
    if (e.key === ' ') {
      e.preventDefault();
      document.querySelector('.action-save')?.click();
    }
    if (e.key === 'Backspace') {
      idx = (idx - 1 + works.length) % works.length;
      render();
    }
  });
})();
