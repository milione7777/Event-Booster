import Handlebars from 'handlebars';
import refs from './getRefs';

const templateSource = `
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

const createMarkup = Handlebars.compile(templateSource);

const BASE_URL = `https://app.ticketmaster.com`;
const API_KEY = 'nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA';

const getCards = async (keyword = '') => {
  try {
    const url = `${BASE_URL}/discovery/v2/events.json?size=20&apikey=${API_KEY}&keyword=${keyword}`;
    const response = await fetch(url);
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const renderAllCards = async (keyword = '') => {
  try {
    const cards = await getCards(keyword);
    refs.listCards.innerHTML = createMarkup(cards);
  } catch (error) {
    console.error('Ошибка при рендеринге:', error);
  }
};

refs.searchBtn.addEventListener('click', () => {
  const keyword = refs.searchInput.value.trim();
  renderAllCards(keyword);
});

refs.searchInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    const keyword = refs.searchInput.value.trim();
    renderAllCards(keyword);
  }
});

renderAllCards();
