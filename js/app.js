const menuToggle = document.querySelector("#menuToggle");
const navigation = document.querySelector("#navigation");

const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelector("#filterButtons");
const catalogGrid = document.querySelector("#catalogGrid");
const emptyMessage = document.querySelector("#emptyMessage");


flatpickr("#birth-date", {
    locale: "uk",               // Українська мова
    dateFormat: "d.m.Y",        // Формат (напр. 25.10.1995)
    maxDate: "today",           // Забороняє вибирати дати в майбутньому
    disableMobile: true         // Примусово показує однаковий дизайн на телефонах і ПК
});


document.querySelector('.styled-form').addEventListener('submit', function(e) {
  // 1. Зупиняємо стандартне перезавантаження сторінки
  e.preventDefault(); 

  const form = e.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const successMessage = document.getElementById('success-message');
  
  // 2. Змінюємо вигляд кнопки під час відправки (щоб не натискали двічі)
  const originalBtnText = submitButton.textContent;
  submitButton.textContent = 'Відправляємо...';
  submitButton.disabled = true;
  const sectionDesc = document.querySelector('.section-desc');

  // 3. Відправляємо дані на Web3Forms через Fetch API
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Accept': 'application/json' // Просимо сервер повернути JSON-відповідь
    },
    body: formData
  })
  .then(async (response) => {
    let json = await response.json();
    if (response.status === 200) {
      // УСПІХ: ховаємо форму, показуємо повідомлення, очищаємо поля
      form.style.display = 'none';

      if (sectionDesc) {
          sectionDesc.style.display = 'none';
      }

      successMessage.style.display = 'block';
      form.reset();

      // ДОДАНО: плавно прокручуємо екран до повідомлення про успіх
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
    } else {
      // ПОМИЛКА ВІД СЕРВЕРА
      console.error(json);
      alert('Помилка відправки: ' + json.message);
    }
  })
  .catch((error) => {
    // ПОМИЛКА МЕРЕЖІ (немає інтернету тощо)
    console.error(error);
    alert('Щось пішло не так. Перевірте підключення до інтернету та спробуйте ще раз.');
  })
  .finally(() => {
    // Повертаємо кнопку в нормальний стан
    submitButton.textContent = originalBtnText;
    submitButton.disabled = false;
  });
});

// DATA

const catalogItems = [
    {
        id: 1,
        title: "Загальна інформація",
        description: "Основна довідкова інформація порталу.",
        category: "info",
        categoryName: "Інформація"
    },
    {
        id: 2,
        title: "Документація",
        description: "Матеріали та інформаційні документи.",
        category: "docs",
        categoryName: "Документи"
    },
    {
        id: 3,
        title: "Часті запитання",
        description: "Відповіді на поширені запитання.",
        category: "help",
        categoryName: "Допомога"
    },
    {
        id: 4,
        title: "Інструкції",
        description: "Довідкові матеріали та інструкції.",
        category: "docs",
        categoryName: "Документи"
    },
    {
        id: 5,
        title: "Корисні матеріали",
        description: "Додаткова інформація для відвідувачів.",
        category: "info",
        categoryName: "Інформація"
    },
    {
        id: 6,
        title: "Контакти підтримки",
        description: "Інформація про доступні канали підтримки.",
        category: "help",
        categoryName: "Допомога"
    }
];

let activeCategory = "all";
let searchQuery = "";

// MOBILE MENU

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
});

navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        navigation.classList.remove("active");
    }
});

// RENDER CARDS

function renderCards(items) {
    catalogGrid.innerHTML = items.map(item => `
        <article class="catalog-card">
            <span class="catalog-card__category">
                ${item.categoryName}
            </span>

            <h3>${item.title}</h3>

            <p>${item.description}</p>
        </article>
    `).join("");

    emptyMessage.style.display = items.length ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector('.styled-form');
  const successMessage = document.getElementById('success-message');
  const sectionDesc = document.querySelector('.section-desc');

  // --- 1. ПЕРЕВІРКА ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ ---
  const savedTime = localStorage.getItem('formSubmittedAt');
  if (savedTime) {
    const now = new Date().getTime();
    const hours24 = 24 * 60 * 60 * 1000; // 24 години у мілісекундах

    if (now - savedTime < hours24) {
      // Якщо 24 години ще не минули – одразу ховаємо форму і показуємо повідомлення
      if (form) form.style.display = 'none';
      if (sectionDesc) sectionDesc.style.display = 'none';
      if (successMessage) successMessage.style.display = 'block';
      
      // Зупиняємо подальше виконання скрипта, бо форма вже прихована
      return; 
    } else {
      // Якщо минуло більше 24 годин – видаляємо старий запис, людина знову побачить форму
      localStorage.removeItem('formSubmittedAt');
    }
  }

  // --- 2. ОБРОБКА ВІДПРАВКИ ФОРМИ ---
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); 

      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      const originalBtnText = submitButton.textContent;
      
      submitButton.textContent = 'Відправляємо...';
      submitButton.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          
          // УСПІХ: ховаємо форму та опис
          form.style.display = 'none';
          if (sectionDesc) sectionDesc.style.display = 'none';

          // Показуємо повідомлення та центруємо
          successMessage.style.display = 'block';
          form.reset();
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // ДОДАНО: Записуємо поточний час у localStorage
          localStorage.setItem('formSubmittedAt', new Date().getTime());
          
        } else {
          console.error(json);
          alert('Помилка відправки: ' + json.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Щось пішло не так. Перевірте підключення до інтернету.');
      })
      .finally(() => {
        submitButton.textContent = originalBtnText;
        submitButton.disabled = false;
      });
    });
  }
});

// FILTER

function filterItems() {
    const filteredItems = catalogItems.filter(item => {

        const matchesCategory =
            activeCategory === "all" ||
            item.category === activeCategory;

        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    renderCards(filteredItems);
}

// SEARCH

searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim().toLowerCase();

    filterItems();
});

// CATEGORY FILTER

filterButtons.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    document.querySelector(".filter-btn.active")
        ?.classList.remove("active");

    button.classList.add("active");

    activeCategory = button.dataset.category;

    filterItems();
});

// INITIAL RENDER


// ВИБІР ПОСАДИ З КАРТКИ
function selectPosition(jobValue) {
    const positionSelect = document.querySelector("#position");
    const registrationForm = document.querySelector("#registration");

    if (positionSelect && registrationForm) {
        // Змінюємо значення в select (користувач все одно зможе його змінити вручну)
        positionSelect.value = jobValue;

        // Плавно скролимо до секції з формою
        registrationForm.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
        });
        
        // Опціонально: трохи підсвічуємо поле, щоб привернути увагу
        positionSelect.style.transition = "box-shadow 0.3s ease";
        positionSelect.style.boxShadow = "0 0 8px rgba(0, 123, 255, 0.5)";
        
        // Знімаємо підсвітку через секунду
        setTimeout(() => {
            positionSelect.style.boxShadow = "none";
        }, 500);
    }
}

// Знаходимо поле з датою


renderCards(catalogItems);