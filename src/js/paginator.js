const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = 'nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA';

async function fetchEvents(page = 1) {
  const response = await fetch(`${apiUrl}?page=${page}&apikey=${apiKey}`);
  const data = await response.json();
  return data;
}

function calculatePages(totalResults, pageSize, currentPage) {
  const totalPages = Math.ceil(totalResults / pageSize);
  const startPage = Math.max(currentPage - 2, 1); 
  const endPage = Math.min(currentPage + 2, totalPages); 

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

const templateSource = `
  <ul class="paginator-list">
    {{#if firstPageBlock}}
      <li class="paginator-items" data-page="1">1</li>
      <li class="paginator-item" class="previous-5">...</li>
    {{/if}}
    
    {{#each pagesToShow}}
      <li class="paginator-items" data-page="{{this}}">{{this}}</li>
    {{/each}}

    {{#if lastPageBlock}}
      <li class="paginator-item" class="next-5">...</li>
      <li class="paginator-items" data-page="{{lastPage}}">{{lastPage}}</li>
    {{/if}}
  </ul>
`;
const template = Handlebars.compile(templateSource);

const eventsTemplateSource = `
  <ul class="list-card-main">
    {{#each this}}
      <li class="item-card-main">
        <div>
          {{#if images.[0]}}
            <img
              class="img-card"
              src="{{images.[0].url}}"
              alt="{{name}}"
              width="180"
              height="120"
            />
          {{/if}}
        </div>
        <h2 class="name-card">{{name}}</h2>
        <p class="dates-card"><b></b> {{dates.start.localDate}}</p>
        <p class="country-card">
          {{_embedded.venues.[0].city.name}}, 
          {{_embedded.venues.[0].country.name}}
        </p>
      </li>
    {{/each}}
  </ul>
`;
const eventsTemplate = Handlebars.compile(eventsTemplateSource);

function renderEvents(events) {
  const eventsContainer = document.querySelector('.cards-list .container');
  eventsContainer.innerHTML = ''; 

  const eventsHtml = eventsTemplate(events);

  eventsContainer.innerHTML = eventsHtml;
}

async function renderPagination(currentPage = 1) {
  const eventsData = await fetchEvents(currentPage);
  const paginationData = calculatePages(
    eventsData.page.totalElements,
    eventsData.page.size,
    currentPage
  );

  const paginationHtml = template(paginationData);

  document.querySelector('.paginator').innerHTML = paginationHtml;

  renderEvents(eventsData._embedded.events);
}

renderPagination(1);

document
  .querySelector('.paginator')
  .addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
      const page = parseInt(event.target.getAttribute('data-page'));
      if (page) {
        renderPagination(page);
      }
    }
  });


