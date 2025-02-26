const BASE_URL = 'https://app.ticketmaster.com';
const API_KEY = 'nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA';

// Шаблон Handlebars для рендерингу подій
const eventTemplate = `
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
`;

async function fetchEvents() {
  const url = `${BASE_URL}/discovery/v2/events.json?size=20&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const template = Handlebars.compile(eventTemplate);

    const html = template(data._embedded.events);

    refs.listCards.innerHTML = html;
  } catch (error) {
    console.error('Fetch error: ', error);
  }
}

document.getElementById('more-autor').addEventListener('click', fetchEvents);
