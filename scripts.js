/* JavaScript Document */

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
   navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
   link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
         targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });

         // Close mobile menu if open
         navLinks.classList.remove('active');
      }
   });
});

// Logo click handler
document.querySelector('.logo').addEventListener('click', (e) => {
   e.preventDefault();
   document.querySelector('#home').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
   });
   navLinks.classList.remove('active');
});

// Scroll spy for active menu states
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function setActiveLink() {
   let currentSection = '';

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
         currentSection = section.getAttribute('id');
      }
   });

   navLinksArray.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
         link.classList.add('active');
      }
   });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink(); // Set initial active state

// Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
   btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
         if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            // Re-trigger animation
            item.style.animation = 'none';
            setTimeout(() => {
               item.style.animation = 'fadeInUp 0.6s ease forwards';
            }, 10);
         } else {
            item.style.display = 'none';
         }
      });
   });
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const closeLightbox = document.getElementById('closeLightbox');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');

let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
   visibleImages = Array.from(galleryItems).filter(item =>
      item.style.display !== 'none'
   );
}

galleryItems.forEach((item, index) => {
   item.addEventListener('click', () => {
      updateVisibleImages();
      currentImageIndex = visibleImages.indexOf(item);
      openLightbox(item);
   });
});

function openLightbox(item) {
   const img = item.querySelector('img');
   const title = item.querySelector('.gallery-title');
   const category = item.querySelector('.gallery-category');

   lightboxImage.src = img.src;
   lightboxImage.alt = img.alt;
   lightboxTitle.textContent = title.textContent;
   lightboxCategory.textContent = category.textContent;

   lightbox.classList.add('active');
   document.body.style.overflow = 'hidden';
}

closeLightbox.addEventListener('click', () => {
   lightbox.classList.remove('active');
   document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
   if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
   }
});

prevImage.addEventListener('click', () => {
   currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
   openLightbox(visibleImages[currentImageIndex]);
});

nextImage.addEventListener('click', () => {
   currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
   openLightbox(visibleImages[currentImageIndex]);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
   if (!lightbox.classList.contains('active')) return;

   if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
   } else if (e.key === 'ArrowLeft') {
      prevImage.click();
   } else if (e.key === 'ArrowRight') {
      nextImage.click();
   }
});

// Initialize visible images
updateVisibleImages();

// Contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // Get form data
   const formData = new FormData(contactForm);
   const name = formData.get('name');

   // Show success message (in real implementation, this would send to a server)
   alert(`Thank you ${name}! Your message has been sent. We will get back to you soon.`);

   // Reset form
   contactForm.reset();

});
(function () {
  const modal = document.getElementById("tgModal");
  if (!modal) {
    console.warn("Telegram modal not found in DOM");
    return;
  }

  let timeoutId = null;

  function openModal() {
    console.log("Opening Telegram modal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal() {
    console.log("Closing Telegram modal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    
    // Очищаем предыдущий таймер, если есть
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Показываем модальное окно снова через 20 секунд
    console.log("Telegram modal will open again in 20 seconds");
    timeoutId = setTimeout(openModal, 20000);
  }

  // Первое появление через 12 секунд
  console.log("Telegram modal will open in 12 seconds");
  setTimeout(openModal, 12000);

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-tg-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Открытие модального окна при клике на контакты в футере
  const contactLinks = document.querySelectorAll("footer .contact-item a");
  contactLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Открытие модального окна при клике на "Контакты" в шапке меню
  const contactsNavLink = document.querySelector('nav a[href="#contact"]');
  if (contactsNavLink) {
    contactsNavLink.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
})();

// Hover Sound Effect
(function() {
  // Create a pool of audio instances for smooth playback
  const soundPool = [];
  const poolSize = 10; // Increased pool size for fast hovering
  let canPlaySound = false;
  const soundFile = '/sounds/forward-sound-game-start.mp3';
  
  // Preload sound pool
  for (let i = 0; i < poolSize; i++) {
    const sound = new Audio(soundFile);
    sound.volume = 0.7;
    sound.preload = 'auto';
    // Force reload to get updated file
    sound.load();
    soundPool.push(sound);
  }
  
  // Enable sound after user interaction
  function enableSound() {
    canPlaySound = true;
    // Reload all sounds to ensure fresh file
    soundPool.forEach(sound => {
      sound.load();
    });
  }
  
  // Enable on first user interaction
  ['click', 'touchstart', 'mousedown'].forEach(event => {
    document.addEventListener(event, enableSound, { once: true });
  });

  function playHoverSound() {
    if (!canPlaySound) return;
    
    // Find an available sound from the pool (prefer paused/ended)
    let availableSound = soundPool.find(sound => 
      sound.paused || sound.ended
    );
    
    // If all sounds are playing, find the one that's been playing longest
    if (!availableSound) {
      availableSound = soundPool.reduce((oldest, current) => {
        return (current.currentTime > oldest.currentTime) ? current : oldest;
      });
      availableSound.pause();
      availableSound.currentTime = 0;
    }
    
    if (availableSound) {
      // Ensure clean reset - stop completely first
      availableSound.pause();
      availableSound.currentTime = 0;
      
      // Use requestAnimationFrame for smoother playback
      requestAnimationFrame(() => {
        availableSound.currentTime = 0;
        const playPromise = availableSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            // Ignore play errors
          });
        }
      });
    }
  }

  // Add hover sound to all clickable elements
  const clickableSelectors = [
    'a',
    'button',
    '.gallery-item',
    '.filter-btn',
    '.tg-btn',
    '.sound-toggle',
    '.icon-content a',
    '.logo'
  ];

  clickableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener('mouseenter', () => {
        playHoverSound();
      });
    });
  });

  // Also add to dynamically created elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          clickableSelectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              node.addEventListener('mouseenter', () => {
                playHoverSound();
              });
            }
            // Also check children
            node.querySelectorAll && node.querySelectorAll(selector).forEach(child => {
              child.addEventListener('mouseenter', () => {
                playHoverSound();
              });
            });
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

// Preloader and Audio System
(function() {
  const preloader = document.getElementById('preloader');
  const soundToggle = document.getElementById('soundToggle');
  const body = document.body;
  
  // Добавляем класс loading на body
  body.classList.add('loading');

  const audio = new Audio('/sounds/841334__josefpres__piano-loops-199-octave-down-short-loop-120-bpm.wav');
  audio.loop = true;
  audio.volume = 0.15;
  
  let isSoundEnabled = true; // Включаем звук по умолчанию
  let audioStarted = false;
  let pageLoaded = false;

  function playAudio() {
    if (isSoundEnabled && !audioStarted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioStarted = true;
          console.log('Audio started');
        }).catch(err => {
          console.log('Audio play failed:', err);
        });
      }
    }
  }

  function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    audioStarted = false;
  }

  function hidePreloader() {
    if (!preloader) return;
    
    // Убираем blur с body
    body.classList.remove('loading');
    
    // Скрываем прелоадер
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 500);
  }

  // Функция для запуска музыки при первом взаимодействии
  function startAudioOnInteraction() {
    if (!audioStarted && isSoundEnabled) {
      playAudio();
    }
  }

  // Добавляем обработчики для запуска музыки при первом взаимодействии
  document.addEventListener('click', startAudioOnInteraction, { once: true, passive: true });
  document.addEventListener('touchstart', startAudioOnInteraction, { once: true, passive: true });
  document.addEventListener('mousemove', startAudioOnInteraction, { once: true, passive: true });
  document.addEventListener('scroll', startAudioOnInteraction, { once: true, passive: true });

  // Показываем toggle сразу
  if (soundToggle) {
    soundToggle.style.display = 'flex';
    soundToggle.classList.add('sound-on');
    soundToggle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
  }

  // Ждем загрузки всех ресурсов
  window.addEventListener('load', () => {
    pageLoaded = true;
    // Скрываем прелоадер - музыка запустится внутри hidePreloader
    setTimeout(() => {
      hidePreloader();
    }, 500);
  });

  // Если все уже загружено
  if (document.readyState === 'complete') {
    pageLoaded = true;
    setTimeout(() => {
      hidePreloader();
    }, 500);
  }

  // Toggle звука
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      
      if (isSoundEnabled) {
        playAudio();
        soundToggle.classList.add('sound-on');
        soundToggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      } else {
        stopAudio();
        soundToggle.classList.remove('sound-on');
        soundToggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      }
    });
  }
})();

// Scroll Animation Effect для каждой Gallery Item отдельно
(function() {
  'use strict';
  
  const scrollAnimationElements = document.querySelectorAll('[data-scroll-animation]');
  if (scrollAnimationElements.length === 0) return;
  
  let rafId = null;
  let isMobile = window.innerWidth <= 768;
  
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  });
  
  function getScaleDimensions() {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  }
  
  function calculateScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    if (elementTop < windowHeight && elementTop + elementHeight > 0) {
      const scrollStart = -elementHeight * 0.5;
      const scrollEnd = windowHeight + elementHeight * 0.5;
      const scrollRange = scrollEnd - scrollStart;
      const currentScroll = windowHeight - elementTop;
      
      const progress = Math.max(0, Math.min(1, (currentScroll - scrollStart) / scrollRange));
      return progress;
    }
    
    return elementTop < 0 ? 1 : 0;
  }
  
  function updateScrollAnimations() {
    scrollAnimationElements.forEach(element => {
      const progress = calculateScrollProgress(element);
      
      const rotate = 20 * (1 - progress);
      const scaleDimensions = getScaleDimensions();
      const scale = scaleDimensions[0] + (scaleDimensions[1] - scaleDimensions[0]) * progress;
      const translate = -100 * (1 - progress);
      
      element.style.transform = `rotateX(${rotate}deg) scale(${scale}) translateY(${translate}px)`;
      
      const shadowIntensity = progress;
      element.style.boxShadow = `
        0 0 rgba(0, 0, 0, ${0.3 * shadowIntensity}),
        0 ${9 * shadowIntensity}px ${20 * shadowIntensity}px rgba(0, 0, 0, ${0.29 * shadowIntensity}),
        0 ${37 * shadowIntensity}px ${37 * shadowIntensity}px rgba(0, 0, 0, ${0.26 * shadowIntensity}),
        0 ${84 * shadowIntensity}px ${50 * shadowIntensity}px rgba(0, 0, 0, ${0.15 * shadowIntensity}),
        0 ${149 * shadowIntensity}px ${60 * shadowIntensity}px rgba(0, 0, 0, ${0.04 * shadowIntensity}),
        0 ${233 * shadowIntensity}px ${65 * shadowIntensity}px rgba(0, 0, 0, ${0.01 * shadowIntensity})
      `;
    });
    
    rafId = requestAnimationFrame(updateScrollAnimations);
  }
  
  updateScrollAnimations();
  
  window.addEventListener('scroll', () => {
    if (!rafId) {
      updateScrollAnimations();
    }
  }, { passive: true });
})();
