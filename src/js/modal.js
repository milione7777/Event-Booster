import Handlebars from 'handlebars';
import refs from './getRefs';

const modalTemplateSource = `
<div class='modal-event-card' id='modal_product' data-event>
  <div class='event_content_icon'>
 {{#if images.[0]}}
          <img
            class=""
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
            class=""
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
          {{#if info}}
            <p class='event_info_text'>{{info}}</p>
          {{/if}}
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
        <div class='event_price'>
          <h2 class='event_price_title'>PRICES</h2>
          <p class='event_price_text'>{{priceRanges.[0].min}} - {{priceRanges.[0].max}} {{priceRanges.[0].currency}}</p>
        </div>
        <a class='buy_tickets_wraper' href='{{url}}'><span class='buy_tickets'>BUY TICKETS</span></a>
      {{/if}}
    </div>
  </div>
  <button class='close_modal_event' id='close_modal_event' data-modal-close>

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

// Обробник закриття модалки
document.addEventListener('click', event => {
  if (
    event.target.matches('#close_modal_event') ||
    event.target.matches('.backdrop-modal')
  ) {
    closeModal();
  }
});