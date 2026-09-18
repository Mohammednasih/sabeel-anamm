document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ENTRANCE COVER OVERLAY & AUTO MUSIC START ON TOUCH ---
  const entranceOverlay = document.getElementById('entranceOverlay');
  const weddingAudio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicBtn');
  let isPlaying = false;
  let hasOpened = false;
  let wasPlayingBeforeTabSwitch = false;

  function openInvitationAndStartMusic() {
    if (hasOpened) return;
    hasOpened = true;

    if (weddingAudio) {
      weddingAudio.play().then(() => {
        isPlaying = true;
        if (musicBtn) musicBtn.classList.add('playing');
      }).catch(err => {
        console.log('Playback error on opening:', err);
      });
    }

    if (entranceOverlay) {
      entranceOverlay.classList.add('fade-out');
      setTimeout(() => {
        entranceOverlay.style.display = 'none';
      }, 800);
    }
  }

  if (entranceOverlay) {
    entranceOverlay.addEventListener('click', openInvitationAndStartMusic);
    entranceOverlay.addEventListener('touchstart', openInvitationAndStartMusic, { passive: true });
  }


  // --- 2. PAUSE MUSIC ON TAB LEAVE / RESUME ON TAB RETURN ---
  function handleVisibilityChange() {
    if (document.hidden) {
      if (isPlaying && weddingAudio) {
        weddingAudio.pause();
        wasPlayingBeforeTabSwitch = true;
        isPlaying = false;
        if (musicBtn) musicBtn.classList.remove('playing');
      }
    } else {
      if (wasPlayingBeforeTabSwitch && hasOpened && weddingAudio) {
        weddingAudio.play().then(() => {
          isPlaying = true;
          wasPlayingBeforeTabSwitch = false;
          if (musicBtn) musicBtn.classList.add('playing');
        }).catch(err => {
          console.log('Resume playback error:', err);
        });
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', () => {
    if (isPlaying && weddingAudio) {
      weddingAudio.pause();
      wasPlayingBeforeTabSwitch = true;
      isPlaying = false;
      if (musicBtn) musicBtn.classList.remove('playing');
    }
  });
  window.addEventListener('focus', () => {
    if (wasPlayingBeforeTabSwitch && hasOpened && weddingAudio) {
      weddingAudio.play().then(() => {
        isPlaying = true;
        wasPlayingBeforeTabSwitch = false;
        if (musicBtn) musicBtn.classList.add('playing');
      }).catch(err => {});
    }
  });


  // --- 3. HERO CAROUSEL LOGIC ---
  const slides = document.querySelectorAll('.slide');
  const slideCounter = document.getElementById('slideCounter');
  const progressFill = document.getElementById('progressFill');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });

    const formattedCurrent = String(currentSlide + 1).padStart(2, '0');
    const formattedTotal = String(totalSlides).padStart(2, '0');
    if (slideCounter) {
      slideCounter.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }

    if (progressFill) {
      const percentage = ((currentSlide + 1) / totalSlides) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  setInterval(nextSlide, 4000);
  updateCarousel();


  // --- 4. LIVE COUNTDOWN TIMER LOGIC ---
  const targetDate = new Date('December 12, 2026 18:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // --- 5. FLOATING MUSIC PLAYER BUTTON LOGIC ---
  if (musicBtn && weddingAudio) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        weddingAudio.pause();
        musicBtn.classList.remove('playing');
        isPlaying = false;
        wasPlayingBeforeTabSwitch = false;
      } else {
        weddingAudio.play().then(() => {
          musicBtn.classList.add('playing');
          isPlaying = true;
        }).catch(err => {
          console.log('Audio playback prevented or failed:', err);
        });
      }
    });
  }


  // --- 6. FIREBASE REALTIME DATABASE & LIVE CROSS-PHONE GUESTBOOK ---
  const firebaseConfig = {
    apiKey: "AIzaSyBjlaeIZp3C8vx33Inc6-hcEX330JLL548",
    authDomain: "wedding-invitation-25097.firebaseapp.com",
    databaseURL: "https://wedding-invitation-25097-default-rtdb.firebaseio.com",
    projectId: "wedding-invitation-25097",
    storageBucket: "wedding-invitation-25097.firebasestorage.app",
    messagingSenderId: "142133374806",
    appId: "1:142133374806:web:548e0eb8f7ed5e90c670f7"
  };

  let db = null;

  function initFirebaseDB() {
    if (typeof firebase !== 'undefined' && firebase.database) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
        return true;
      } catch (e) {
        console.error('Firebase DB Init error:', e);
      }
    }
    return false;
  }

  initFirebaseDB();

  const wishForm = document.getElementById('wishForm');
  const guestNameInput = document.getElementById('guestName');
  const guestWishInput = document.getElementById('guestWish');
  const blessingsDisplayContainer = document.getElementById('blessingsDisplayContainer');
  const blessingsList = document.getElementById('blessingsList');
  const blessingsCount = document.getElementById('blessingsCount');

  let localWishesList = JSON.parse(localStorage.getItem('wedding_local_wishes')) || [];

  function renderBlessingsTrack(wishesArray) {
    if (!blessingsDisplayContainer || !blessingsList) return;

    if (!wishesArray || wishesArray.length === 0) {
      blessingsDisplayContainer.classList.add('hidden');
      blessingsList.innerHTML = '';
      if (blessingsCount) blessingsCount.textContent = '0';
      return;
    }

    blessingsDisplayContainer.classList.remove('hidden');
    if (blessingsCount) blessingsCount.textContent = String(wishesArray.length);

    blessingsList.innerHTML = '';
    wishesArray.forEach(item => {
      const card = document.createElement('div');
      card.className = 'blessing-card';
      const likesCount = item.likes || 0;

      card.innerHTML = `
        <div class="card-top">
          <span class="author-name">${escapeHTML(item.name)}</span>
          <button class="like-btn" onclick="likeWish('${item.id}')" aria-label="Like Wish">
            <i class="fa-solid fa-heart"></i>
            <span class="like-count">${likesCount}</span>
          </button>
        </div>
        <p class="card-body">“${escapeHTML(item.wish)}”</p>
      `;
      blessingsList.appendChild(card);
    });

    blessingsList.scrollTo({ left: 0, behavior: 'smooth' });
  }

  // Global Like Wish Function
  window.likeWish = function(wishId) {
    if (!wishId) return;

    if (db || initFirebaseDB()) {
      const likesRef = db.ref('blessings/' + wishId + '/likes');
      likesRef.transaction((currentLikes) => {
        return (currentLikes || 0) + 1;
      });
    } else {
      const target = localWishesList.find(w => w.id === wishId);
      if (target) {
        target.likes = (target.likes || 0) + 1;
        localStorage.setItem('wedding_local_wishes', JSON.stringify(localWishesList));
        renderBlessingsTrack(localWishesList);
      }
    }
  };

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Real-time Firebase Listener with Auto-Retry & Error Fallback
  let retryCount = 0;
  function listenToFirebaseWishes() {
    if (!db) {
      if (initFirebaseDB()) {
        setupListener();
      } else if (retryCount < 10) {
        retryCount++;
        setTimeout(listenToFirebaseWishes, 300);
      } else {
        // Fallback to local storage if CDN failed to load
        renderBlessingsTrack(localWishesList);
      }
    } else {
      setupListener();
    }
  }

  function setupListener() {
    if (!db) return;
    db.ref('blessings').on('value', (snapshot) => {
      const data = snapshot.val();
      const wishes = [];
      if (data) {
        Object.keys(data).forEach(key => {
          const item = data[key];
          item.id = key;
          wishes.push(item);
        });
        wishes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
      renderBlessingsTrack(wishes);
    }, (error) => {
      console.error('Firebase Read Error:', error);
      renderBlessingsTrack(localWishesList);
    });
  }

  listenToFirebaseWishes();

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = guestNameInput.value.trim();
      const wish = guestWishInput.value.trim();

      if (!name || !wish) return;

      const newBlessing = {
        name: name,
        time: "Just now",
        wish: wish,
        likes: 0,
        timestamp: Date.now()
      };

      if (db || initFirebaseDB()) {
        db.ref('blessings').push(newBlessing, (error) => {
          if (error) {
            console.error('Firebase Push Error:', error);
            // Fallback write
            newBlessing.id = 'local_' + Date.now();
            localWishesList.unshift(newBlessing);
            localStorage.setItem('wedding_local_wishes', JSON.stringify(localWishesList));
            renderBlessingsTrack(localWishesList);
          }
        });
      } else {
        newBlessing.id = 'local_' + Date.now();
        localWishesList.unshift(newBlessing);
        localStorage.setItem('wedding_local_wishes', JSON.stringify(localWishesList));
        renderBlessingsTrack(localWishesList);
      }

      wishForm.reset();
      blessingsDisplayContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }


  // --- 7. RSVP INTERACTION & CONFETTI POPPER ---
  const rsvpYesBtn = document.getElementById('rsvpYesBtn');
  const rsvpNoBtn = document.getElementById('rsvpNoBtn');
  const rsvpResponseCard = document.getElementById('rsvpResponseCard');
  const responseIcon = document.getElementById('responseIcon');
  const responseTitle = document.getElementById('responseTitle');
  const responseText = document.getElementById('responseText');

  function triggerConfettiPopper() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#3b413a', '#e8dfd1', '#ffffff', '#c9b69c', '#ffd700']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b413a', '#e8dfd1', '#ffffff']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b413a', '#e8dfd1', '#ffffff']
        });
      }, 250);
    }
  }

  if (rsvpYesBtn && rsvpNoBtn && rsvpResponseCard) {
    
    rsvpYesBtn.addEventListener('click', () => {
      rsvpYesBtn.classList.add('selected');
      rsvpNoBtn.classList.remove('selected');

      responseIcon.textContent = '🎉';
      responseTitle.textContent = 'Alhamdulillah!';
      responseText.textContent = 'We are thrilled to celebrate our special day with you! Looking forward to seeing you on August 31, 2026.';
      
      rsvpResponseCard.classList.remove('hidden');
      triggerConfettiPopper();

      rsvpResponseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    rsvpNoBtn.addEventListener('click', () => {
      rsvpNoBtn.classList.remove('selected');
      rsvpNoBtn.classList.add('selected');

      responseIcon.textContent = '🤍';
      responseTitle.textContent = 'Warm Regards';
      responseText.textContent = 'You will be dearly missed! Thank you for your love, support, and warm prayers from afar.';
      
      rsvpResponseCard.classList.remove('hidden');

      rsvpResponseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

  }

});
