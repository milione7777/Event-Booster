import Handlebars from 'handlebars';
import refs from './getRefs';

const modalTemplateSource = `
<div class='modal-event-card' id='modal_product' data-event>
  <div class='event_content_icon'>
 {{#if images.[0]}}
          <img
            class="modal-foto"
            src="{{images.[0].url}}"
            alt="{{name}}"
            width="180"
            height="120"
          />
          {{/if}}
  </div>

  <div class='allinfo_about_event'>
    <div class='main_img_conteiner'>
       {{#if images.[0]}}
          <img
            class="modal-2-foto"
            src="{{images.[0].url}}"
            alt="{{name}}"
            width="180"
            height="120"
          />
          {{/if}}
    </div>

    <div class='description_event'>
      <div class='event_info'>
        <h2 class='event_info_title'>INFO</h2>
        <div class='event-wrapper'>
          {{#if pleaseNote}}
            <p class='event_info_text'><strong></strong> {{pleaseNote}}</p>
          {{/if}}
          {{#unless info}}
            {{#unless pleaseNote}}
              <p class='event_info_text'>No additional information available.</p>
            {{/unless}}
          {{/unless}}
        </div>
      </div>

      <div class='event_date'>
        <h2 class='event_date_title'>WHEN</h2>
        <p class='event_date_text_up'>{{dates.start.localDate}}</p>
        <p class='event_date_text'>{{dates.start.localTime}} ({{dates.timezone}})</p>
      </div>
      <div class='event_place'>
        <h2 class='event_place_title'>WHERE</h2>
        <p class='event_place_text_up'>{{_embedded.venues.[0].city.name}}, {{_embedded.venues.[0].country.name}}</p>
        <p class='event_place_text'>{{_embedded.venues.[0].name}}</p>
      </div>
      {{#if _embedded.attractions}}
        <div class='event_headliner'>
          <h2 class='event_headliner_title'>WHO</h2>
          <div class='event_headliner_wraper'>
            <p class='event_headliner_text'>{{_embedded.attractions.[0].name}}</p>
          </div>
        </div>
      {{/if}}
      {{#if priceRanges}}
        <div class='event_price event-margin'>
          <h2 class='event_price_title'>PRICES</h2>
          <p class='event_price_text'>STANDART {{priceRanges.[0].min}} - {{priceRanges.[0].max}} {{priceRanges.[0].currency}}</p>
        </div>
        <a class='buy_tickets_wraper' href='{{url}}'><span class='buy_tickets'>BUY TICKETS</span></a>
        <div class='event_price '>
          <p class='event_price_text event_price_margin'>VIP {{priceRanges.[0].min}} - {{priceRanges.[0].max}} {{priceRanges.[0].currency}}</p>
                  <a class='buy_tickets_wraper' href='{{url}}'><span class='buy_tickets'>BUY TICKETS</span></a>
        </div>
      {{/if}}
        <button class='more-from-autor' id='more-autor'>
     MORE FROM THIS AUTHOR
  </button>
    </div>
  </div>
  <button class='close_modal_event' id='close_modal_event' data-modal-close>
     <div class='border-close-modal'></div>
     <div class='border-close-modal-two'></div>
  </button>
</div>
`;

const modalTemplate = Handlebars.compile(modalTemplateSource);

// Функція відкриття модального вікна
const openModal = eventData => {
  const modalContent = modalTemplate(eventData);
  const modalContainer = document.querySelector('.modal');
  modalContainer.innerHTML = modalContent;
  document.querySelector('.backdrop-modal').classList.add('visible');
};

// Функція закриття модального вікна
const closeModal = () => {
  document.querySelector('.backdrop-modal').classList.remove('visible');
};

// Обробник кліку на картки
refs.listCards.addEventListener('click', async event => {
  const card = event.target.closest('.item-card-main');
  if (!card) return;

  const eventName = card.querySelector('.name-card').textContent;

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA&keyword=${eventName}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data._embedded?.events?.length) {
      openModal(data._embedded.events[0]);
    }
  } catch (error) {
    console.error('Помилка отримання даних події:', error);
  }
});

// Обробник кліку на кнопку "MORE FROM THIS AUTHOR"
document.addEventListener('click', async event => {
  if (!event.target.matches('#more-autor')) return;

  const authorName = document.querySelector(
    '.event_headliner_text'
  )?.textContent;
  if (!authorName) return;

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA&keyword=${authorName}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data._embedded?.events?.length) {
      const eventListTemplate = Handlebars.compile(`
      {{#each this}}
        <li class="item-card-main">
          <div>
            {{#if images.[0]}}
              <img class="img-card" src="{{images.[0].url}}" alt="{{name}}" width="180" height="120" />
            {{/if}}
          </div>
          <h2 class="name-card">{{name}}</h2>
          <p class="dates-card"><b></b> {{dates.start.localDate}}</p>
          <p class="country-card">{{_embedded.venues.[0].city.name}}, {{_embedded.venues.[0].country.name}}</p>
        </li>
      {{/each}}
      `);

      refs.listCards.innerHTML = eventListTemplate(data._embedded.events);
    }
  } catch (error) {
    console.error('Помилка отримання подій автора:', error);
  }
});

// Обробник закриття модалки
document.addEventListener('click', event => {
  if (
    event.target.matches('#close_modal_event') ||
    event.target.matches('.backdrop-modal')
  ) {
    closeModal();
  }
});
