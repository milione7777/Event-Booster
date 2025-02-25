const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = 'nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA'; // Заміни на свій API ключ

// Функція для запиту подій
async function fetchEvents(page = 1) {
  const response = await fetch(`${apiUrl}?page=${page}&apikey=${apiKey}`);
  const data = await response.json();
  return data;
}

// Функція для розрахунку сторінок пагінації
function calculatePages(totalResults, pageSize, currentPage) {
  const totalPages = Math.ceil(totalResults / pageSize);
  const startPage = Math.max(currentPage - 2, 1); // Почати з 2 сторінок до поточної
  const endPage = Math.min(currentPage + 2, totalPages); // Закінчити 2 сторінки після поточної

  return {
    totalPages,
    pagesToShow: Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    ),
    firstPageBlock: currentPage > 3,
    lastPageBlock: currentPage < totalPages - 2,
    lastPage: totalPages,
  };
}

// Шаблон Handlebars для пагінації
const templateSource = `
      <ul class="paginator-list">
        {{#if firstPageBlock}}
          <li data-page="1">1</li>
          <li class="previous-5">...</li>
        {{/if}}
        
        {{#each pagesToShow}}
          <li data-page="{{this}}">{{this}}</li>
        {{/each}}

        {{#if lastPageBlock}}
          <li class="next-5">...</li>
          <li data-page="{{lastPage}}">{{lastPage}}</li>
        {{/if}}
      </ul>
    `;
const template = Handlebars.compile(templateSource);

// Основна функція для рендерингу пагінації
async function renderPagination(currentPage = 1) {
  const eventsData = await fetchEvents(currentPage);
  const paginationData = calculatePages(
    eventsData.page.totalElements,
    eventsData.page.size,
    currentPage
  );

  // Генеруємо HTML
  const html = template(paginationData);

  // Вставляємо в контейнер
  document.querySelector('.paginator').innerHTML = html;
}

// Викликаємо функцію для рендерингу пагінації для 1-ї сторінки
renderPagination(1);

// Обробка кліків на сторінки пагінації
document.querySelector('.paginator').addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    const page = parseInt(event.target.getAttribute('data-page'));
    if (page) {
      renderPagination(page);
    }
  }
});
