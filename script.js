const body = document.body;
const navbar = document.querySelector(".navbar");

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

if (body.classList.contains("has-hero") && navbar) {
  const handleScroll = () => {
    if (window.scrollY > 40) {
      body.classList.add("scrolled");
      navbar.classList.add("scrolled");
    } else {
      body.classList.remove("scrolled");
      navbar.classList.remove("scrolled");
    }
  };
  handleScroll();
  window.addEventListener("scroll", handleScroll);
}

const themeToggle = document.getElementById("themeToggle");
const navLinksEls = document.querySelectorAll(".nav-links a");

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    body.style.background = "#111827";
    body.style.color = "#E5E7EB";
    navLinksEls.forEach(a => (a.style.color = "#E5E7EB"));
  } else {
    body.classList.remove("dark");
    body.style.background = "#F5F7FA";
    body.style.color = "#1A1A1A";
    navLinksEls.forEach(a => (a.style.color = ""));
  }
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
let heroIndex = 0;

function updateHeroCarousel() {
  heroSlides.forEach(s => s.classList.remove("active"));
  heroDots.forEach(d => d.classList.remove("active"));

  if (heroSlides[heroIndex]) {
    heroSlides[heroIndex].classList.add("active");
  }
  if (heroDots[heroIndex]) {
    heroDots[heroIndex].classList.add("active");
  }
}

if (heroSlides.length && heroDots.length) {
  heroDots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      heroIndex = idx;
      updateHeroCarousel();
    });
  });

  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    updateHeroCarousel();
  }, 5000);
}

const miniCarousels = document.querySelectorAll(".mini-carousel");

miniCarousels.forEach(carousel => {
  const slides = carousel.querySelectorAll(".mini-slide");
  const dots = carousel.querySelectorAll(".mini-dot");
  let index = 0;

  const updateMini = () => {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    if (slides[index]) slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      updateMini();
    });
  });

  if (slides.length > 1) {
    setInterval(() => {
      index = (index + 1) % slides.length;
      updateMini();
    }, 4000);
  }
});

const checklistContainer = document.getElementById("checklist");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

let savedChecklist = JSON.parse(localStorage.getItem("checklist")) || {};

function updateProgress() {
  if (!checklistContainer || !progressFill || !progressPercent) return;
  const items = checklistContainer.querySelectorAll(".check-item");
  const total = items.length;
  let checked = 0;

  items.forEach((item, idx) => {
    if (savedChecklist[idx]) checked++;
  });

  const percent = total ? Math.round((checked / total) * 100) : 0;
  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}

const progressSection = document.querySelector(".progress-section");

if (progressSection) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) { 
      progressSection.classList.add("stuck");
    } else {
      progressSection.classList.remove("stuck");
    }
  });
}

if (checklistContainer) {
  const items = checklistContainer.querySelectorAll(".check-item");

  items.forEach((item, idx) => {
    if (savedChecklist[idx]) {
      item.classList.add("checked");
    }

    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      savedChecklist[idx] = item.classList.contains("checked");
      localStorage.setItem("checklist", JSON.stringify(savedChecklist));
      updateProgress();
    });
  });

  updateProgress();
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('map')) {
    const map = L.map('map').setView([14.11, 122.95], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const locations = [
      { name: "Daet Evac Center (Lag-on)", lat: 14.118, lng: 122.955, type: "safe", info: "Provincial Sports Complex" },
      { name: "Vinzons Evac Center", lat: 14.175, lng: 122.903, type: "safe", info: "Brgy. Sto. Domingo" },
      { name: "Labo Evac Center", lat: 14.155, lng: 122.825, type: "safe", info: "Brgy. Awitan" },
      { name: "Jose Panganiban Center", lat: 14.288, lng: 122.685, type: "safe", info: "Municipal Hall Area" },
      { name: "Paracale Shelter", lat: 14.275, lng: 122.785, type: "safe", info: "Brgy. Maybato" },
      
      { name: "Bagasbas Beach", lat: 14.135, lng: 122.985, type: "coastal", info: "High Storm Surge Risk" },
      { name: "Basud River Plains", lat: 14.055, lng: 122.955, type: "flood", info: "Frequent Inland Flooding" },
      { name: "Mount Labo Slopes", lat: 14.015, lng: 122.785, type: "landslide", info: "Landslide Susceptibility" },
      { name: "Mercedes Islands", lat: 14.055, lng: 123.015, type: "coastal", info: "Tidal Inundation" }
    ];

    locations.forEach(loc => {
      let color = "#27ae60"; 
      if(loc.type === "coastal") color = "#e67e22";
      if(loc.type === "flood") color = "#3498db";
      if(loc.type === "landslide") color = "#e74c3c";

      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 8,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(`<b>${loc.name}</b><br>${loc.info}`);
    });
  }
});

/*disaster*/

  document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.mini-carousel');
    
    carousels.forEach(carousel => {
      const slides = carousel.querySelectorAll('.mini-slide');
      const dots = carousel.querySelectorAll('.mini-dot');
      let currentIndex = 0;
      
      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
      }
      
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          showSlide(index);
          resetInterval();
        });
      });

      let interval;
      function startInterval() {
        interval = setInterval(() => {
          const nextIndex = (currentIndex + 1) % slides.length;
          showSlide(nextIndex);
        }, 5000);
      }
      
      function resetInterval() {
        clearInterval(interval);
        startInterval();
      }
      
      if (slides.length > 1) {
        startInterval();

        carousel.addEventListener('mouseenter', () => {
          clearInterval(interval);
        });
        
        carousel.addEventListener('mouseleave', () => {
          startInterval();
        });
      }
    });
  });


  /*hotlines*/

  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('hotlineSearch');
    const municipalityFilter = document.getElementById('municipalityFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const resetBtn = document.getElementById('resetFilters');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const hotlineCards = document.querySelectorAll('.hotline-card');
    const hotlineCategories = document.querySelectorAll('.hotline-category');
    
    function filterHotlines() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedMunicipality = municipalityFilter.value;
      const selectedCategory = categoryFilter.value;
      
      let visibleCards = 0;
      
      hotlineCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const cardMunicipality = card.getAttribute('data-municipality');
        const cardCategory = card.getAttribute('data-category');
    
        const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
        const matchesMunicipality = selectedMunicipality === 'all' || cardMunicipality === selectedMunicipality;
        const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
        
        if (matchesSearch && matchesMunicipality && matchesCategory) {
          card.style.display = 'block';
          visibleCards++;
        } else {
          card.style.display = 'none';
        }
      });
      
      hotlineCategories.forEach(category => {
        const categoryCards = category.querySelectorAll('.hotline-card');
        const visibleCategoryCards = Array.from(categoryCards).filter(card => 
          card.style.display !== 'none'
        ).length;
        
        if (visibleCategoryCards > 0) {
          category.style.display = 'block';
        } else {
          category.style.display = 'none';
        }
      });
      
      const noResultsMsg = document.querySelector('.no-results');
      if (visibleCards === 0) {
        if (!noResultsMsg) {
          const message = document.createElement('div');
          message.className = 'no-results';
          message.innerHTML = '<h3>No hotlines found</h3><p>Try adjusting your search or filters</p>';
          document.querySelector('.hotlines-container').appendChild(message);
        }
      } else if (noResultsMsg) {
        noResultsMsg.remove();
      }
    }
    
    function resetFilters() {
      searchInput.value = '';
      municipalityFilter.value = 'all';
      categoryFilter.value = 'all';
      categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === 'all') {
          btn.classList.add('active');
        }
      });
      filterHotlines();
    }
    
    searchInput.addEventListener('input', filterHotlines);
    municipalityFilter.addEventListener('change', filterHotlines);
    categoryFilter.addEventListener('change', filterHotlines);
    resetBtn.addEventListener('click', resetFilters);
    
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const selectedCategory = this.getAttribute('data-category');
        
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        categoryFilter.value = selectedCategory;
        filterHotlines();
      });
    });
    
    window.callNumber = function(number) {
      alert(`Calling: ${number}\n\nNote: This is a simulation. On a real device, this would initiate a phone call.`);
    };
    
    filterHotlines();
  });


  document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        
      
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        

        newsCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });


    document.addEventListener('DOMContentLoaded', function() {
    const checklistItems = [
      { 
        title: "Create a family emergency communication plan", 
        translation: "Gumawa ng emergency communication plan para sa pamilya",
        category: "planning",
        priority: "high"
      },
      { 
        title: "Identify safe meeting places inside and outside your home", 
        translation: "Kilalanin ang ligtas na tagpuan sa loob at labas ng bahay",
        category: "planning",
        priority: "high"
      },
      { 
        title: "Learn evacuation routes from your home and neighborhood", 
        translation: "Alamin ang evacuation routes mula sa inyong bahay at kapitbahayan",
        category: "planning",
        priority: "high"
      },
      { 
        title: "Store at least 3 days worth of water (1 gallon per person per day)", 
        translation: "Mag-imbak ng tubig na sapat sa 3 araw (1 galon bawat tao bawat araw)",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Store at least 3 days worth of non-perishable food", 
        translation: "Mag-imbak ng non-perishable food na sapat sa 3 araw",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Maintain a well-stocked first aid kit", 
        translation: "Panatilihin ang well-stocked first aid kit",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Keep a 7-day supply of essential medications", 
        translation: "Maghanda ng 7-day supply ng essential medications",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Prepare emergency contact list for all family members", 
        translation: "Gumawa ng emergency contact list para sa lahat ng miyembro ng pamilya",
        category: "documents",
        priority: "high"
      },
      { 
        title: "Secure important documents in waterproof container", 
        translation: "I-secure ang important documents sa waterproof container",
        category: "documents",
        priority: "medium"
      },
      { 
        title: "Establish an out-of-town emergency contact", 
        translation: "Magkaroon ng out-of-town emergency contact",
        category: "planning",
        priority: "medium"
      },
      { 
        title: "Practice emergency drills with all family members", 
        translation: "Magsanay ng emergency drills kasama ang buong pamilya",
        category: "planning",
        priority: "medium"
      },
      { 
        title: "Install smoke detectors and carbon monoxide alarms", 
        translation: "Magkabit ng smoke detectors at carbon monoxide alarms",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Learn how to shut off utilities (water, gas, electricity)", 
        translation: "Alamin kung paano patayin ang utilities (tubig, gas, kuryente)",
        category: "planning",
        priority: "medium"
      },
      { 
        title: "Keep emergency cash in small denominations", 
        translation: "Maghanda ng emergency cash sa maliliit na denomination",
        category: "documents",
        priority: "medium"
      },
      { 
        title: "Prepare emergency kits for vehicles", 
        translation: "Gumawa ng emergency kits para sa mga sasakyan",
        category: "essentials",
        priority: "medium"
      },
      { 
        title: "Have battery-powered or hand-crank radio with NOAA weather band", 
        translation: "Magkaroon ng battery-powered o hand-crank radio na may NOAA weather band",
        category: "essentials",
        priority: "medium"
      },
      { 
        title: "Stock flashlights and extra batteries for each family member", 
        translation: "Maghanda ng flashlight at extra batteries para sa bawat miyembro ng pamilya",
        category: "essentials",
        priority: "medium"
      },
      { 
        title: "Have a whistle to signal for help", 
        translation: "Magkaroon ng pito para sa pagtawag ng tulong",
        category: "essentials",
        priority: "low"
      },
      { 
        title: "Prepare sanitation and personal hygiene supplies", 
        translation: "Maghanda ng sanitation at personal hygiene supplies",
        category: "essentials",
        priority: "medium"
      },
      { 
        title: "Store extra pet food and supplies if applicable", 
        translation: "Mag-imbak ng extra pet food at supplies kung may alaga",
        category: "essentials",
        priority: "low"
      },
      { 
        title: "Keep a multi-tool or basic tools for emergency repairs", 
        translation: "Magkaroon ng multi-tool o basic tools para sa emergency repairs",
        category: "essentials",
        priority: "low"
      },
      { 
        title: "Prepare warm blankets or sleeping bags for each person", 
        translation: "Maghanda ng warm blankets o sleeping bags para sa bawat tao",
        category: "essentials",
        priority: "medium"
      },
      { 
        title: "Have a fire extinguisher and know how to use it", 
        translation: "Magkaroon ng fire extinguisher at alamin kung paano ito gamitin",
        category: "essentials",
        priority: "high"
      },
      { 
        title: "Prepare entertainment items (books, games) for children", 
        translation: "Maghanda ng entertainment items (libro, laro) para sa mga bata",
        category: "essentials",
        priority: "low"
      },
      { 
        title: "Regularly review and update your emergency plans", 
        translation: "Regular na repasuhin at i-update ang inyong emergency plans",
        category: "planning",
        priority: "medium"
      }
    ];

    // DOM Elements
    const checklistContainer = document.getElementById('checklist');
    const completedCountElement = document.getElementById('completedCount');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressMessage = document.getElementById('progressMessage');
    const resetButton = document.getElementById('resetBtn');
    const shareButton = document.getElementById('shareBtn');
    const emailFamilyButton = document.getElementById('emailFamilyBtn');
    const checkAllButton = document.getElementById('checkAllBtn');
    const uncheckAllButton = document.getElementById('uncheckAllBtn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const emailModal = document.getElementById('email-modal');
    const cancelEmailButton = document.getElementById('cancel-email');
    const emailForm = document.getElementById('email-form');
    const emailBody = document.getElementById('email-body');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    // Achievement badges
    const badgeStarter = document.getElementById('badge-starter');
    const badgeHalfway = document.getElementById('badge-halfway');
    const badgeExpert = document.getElementById('badge-expert');
    const badgeMaster = document.getElementById('badge-master');

    // Initialize checklist state (25 items)
    let checklistState = Array(25).fill(false);

    // Load saved state from localStorage
    function loadChecklistState() {
      const savedState = localStorage.getItem('familyPreparednessChecklist');
      if (savedState) {
        checklistState = JSON.parse(savedState);
      }
    }

    // Save checklist state to localStorage
    function saveChecklistState() {
      localStorage.setItem('familyPreparednessChecklist', JSON.stringify(checklistState));
    }

    // Show notification
    function showNotification(message) {
      notificationText.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }

    // Update progress display
    function updateProgress() {
      const completed = checklistState.filter(item => item).length;
      const total = checklistState.length;
      const percentage = Math.round((completed / total) * 100);
      
      // Update counts
      completedCountElement.textContent = completed;
      
      // Update progress bar
      progressFill.style.width = `${percentage}%`;
      progressPercent.textContent = `${percentage}%`;
      
      // Update progress message
      let message = "";
      let messageClass = "starting";
      
      if (percentage === 0) {
        message = "Start by checking off your first item!";
        messageClass = "starting";
      } else if (percentage < 20) {
        message = "Good start! Keep building your family's preparedness.";
        messageClass = "starting";
      } else if (percentage < 50) {
        message = "Making progress! You're on your way to being prepared.";
        messageClass = "good";
      } else if (percentage < 80) {
        message = "Great job! You're more than halfway there.";
        messageClass = "good";
      } else if (percentage < 100) {
        message = "Almost there! Just a few more items to complete.";
        messageClass = "good";
      } else {
        message = "Excellent! You're fully prepared!";
        messageClass = "excellent";
      }
      
      progressMessage.textContent = message;
      progressMessage.className = "progress-message " + messageClass;
      
      // Update achievement badges
      updateAchievements(percentage);
      
      // Save state to localStorage
      saveChecklistState();
    }

    // Update achievement badges
    function updateAchievements(percentage) {
      // Starter badge (20%)
      if (percentage >= 20) {
        badgeStarter.classList.add('unlocked');
      } else {
        badgeStarter.classList.remove('unlocked');
      }
      
      // Halfway badge (50%)
      if (percentage >= 50) {
        badgeHalfway.classList.add('unlocked');
      } else {
        badgeHalfway.classList.remove('unlocked');
      }
      
      // Expert badge (80%)
      if (percentage >= 80) {
        badgeExpert.classList.add('unlocked');
      } else {
        badgeExpert.classList.remove('unlocked');
      }
      
      // Master badge (100%)
      if (percentage >= 100) {
        badgeMaster.classList.add('unlocked');
      } else {
        badgeMaster.classList.remove('unlocked');
      }
    }

    // Create checklist items in the DOM
    function renderChecklist() {
      checklistContainer.innerHTML = '';
      
      checklistItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = `check-item ${checklistState[index] ? 'checked' : ''}`;
        itemElement.dataset.index = index;
        itemElement.dataset.category = item.category;
        
        // Priority class
        const priorityClass = `priority-${item.priority}`;
        const priorityText = item.priority.toUpperCase();
        
        itemElement.innerHTML = `
          <div class="check-icon">
            <i class="fas fa-check"></i>
          </div>
          <div class="check-content">
            <div class="check-title">
              ${item.title} 
              ${item.priority === 'high' ? `<span class="check-priority ${priorityClass}">${priorityText}</span>` : ''}
            </div>
            <div class="check-translation">${item.translation}</div>
          </div>
        `;
        
        // Add click event to toggle item
        itemElement.addEventListener('click', () => {
          checklistState[index] = !checklistState[index];
          itemElement.classList.toggle('checked');
          updateProgress();
          showNotification('Item updated! Progress saved.');
        });
        
        checklistContainer.appendChild(itemElement);
      });
      
      updateProgress();
    }

    // Filter items by category
    function filterByCategory(category) {
      const items = document.querySelectorAll('.check-item');
      
      items.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Prepare email content
    function prepareEmailContent() {
      const completed = checklistState.filter(item => item).length;
      const total = checklistState.length;
      const percentage = Math.round((completed / total) * 100);
      
      let emailContent = `Kamusta Pamilya,\n\n`;
      emailContent += `Narito ang progreso ng ating Family Emergency Preparedness Checklist:\n\n`;
      emailContent += `Natapos na natin ang ${completed} sa ${total} na items (${percentage}%).\n\n`;
      
      if (completed > 0) {
        emailContent += `Mga Natapos na:\n`;
        checklistItems.forEach((item, index) => {
          if (checklistState[index]) {
            emailContent += `✓ ${item.title}\n`;
            emailContent += `  (${item.translation})\n\n`;
          }
        });
      }
      
      if (completed < total) {
        emailContent += `Mga Kailangan Pang Gawin:\n`;
        checklistItems.forEach((item, index) => {
          if (!checklistState[index]) {
            emailContent += `□ ${item.title}\n`;
            emailContent += `  (${item.translation})\n\n`;
          }
        });
      }
      
      emailContent += `Tara't pagtulungan nating kumpletuhin ang ating emergency preparedness plan!\n\n`;
      emailContent += `- Mula sa AlertoCamNorteño Emergency Preparedness Checklist`;
      
      return emailContent;
    }

    // Open email modal
    function openEmailModal() {
      emailBody.value = prepareEmailContent();
      emailModal.classList.add('active');
    }

    // Close email modal
    function closeEmailModal() {
      emailModal.classList.remove('active');
      emailForm.reset();
    }

    // Send email (simulated - would open mail client in real implementation)
    function sendEmail(e) {
      e.preventDefault();
      
      const emailTo = document.getElementById('email-to').value;
      const emailSubject = document.getElementById('email-subject').value;
      const emailBodyContent = document.getElementById('email-body').value;
      
      // In a real implementation, this would connect to a backend service
      // For this demo, we'll simulate sending and show a notification
      
      // Close modal first
      closeEmailModal();
      
      // Show success message
      setTimeout(() => {
        showNotification('Email would be sent to your family!');
        
        // For demonstration purposes, we'll just log it
        console.log('Email would be sent to:', emailTo);
        console.log('Subject:', emailSubject);
        console.log('Body:', emailBodyContent);
      }, 500);
    }

    // Initialize the app
    function init() {
      loadChecklistState();
      renderChecklist();
      
      // Event listeners
      resetButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all checklist items? This cannot be undone.")) {
          checklistState = Array(25).fill(false);
          renderChecklist();
          showNotification('Checklist has been reset.');
        }
      });
      
      shareButton.addEventListener('click', openEmailModal);
      emailFamilyButton.addEventListener('click', openEmailModal);
      
      // Check All button
      checkAllButton.addEventListener('click', () => {
        checklistState = Array(25).fill(true);
        renderChecklist();
        showNotification('All items checked!');
      });
      
      // Uncheck All button
      uncheckAllButton.addEventListener('click', () => {
        checklistState = Array(25).fill(false);
        renderChecklist();
        showNotification('All items unchecked.');
      });
      
      // Category filtering
      categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-category');
          
          // Update active button
          categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Filter items
          filterByCategory(category);
        });
      });
      
      cancelEmailButton.addEventListener('click', closeEmailModal);
      emailForm.addEventListener('submit', sendEmail);
      
      // Close modal when clicking outside
      emailModal.addEventListener('click', (e) => {
        if (e.target === emailModal) {
          closeEmailModal();
        }
      });
      
      // Show initial notification
      setTimeout(() => {
        showNotification('Welcome! Your progress is saved automatically.');
      }, 1000);
    }

    // Start the app when DOM is loaded
    init();
// Function to handle sticky progress bar resizing
  function handleStickyProgress() {
    const progressSection = document.querySelector(".progress-section");
    if (!progressSection) return;

    window.addEventListener("scroll", () => {
      // Detect when user has scrolled past the hero/header area
      if (window.scrollY > 180) {
        progressSection.classList.add("stuck");
      } else {
        progressSection.classList.remove("stuck");
      }
    });
  }

// Call the function
handleStickyProgress();

  });