import refs from './getRefs';
import Handlebars from 'handlebars';
import markupTemplate from '../templates/cards-markup.hbs';

const createMarkup = Handlebars.compile(markupTemplate);

const BASE_URL = `https://app.ticketmaster.com`;
const API_KEY = 'nGm4oZ3VNxvLAyNFXF3x88MrBbSefbXA';

const getCards = async () => {
  const response =
    await fetch(`${BASE_URL}/discovery/v2/events.json?apikey=${API_KEY}`);
  const cards = await response.json();
  return cards;
  
};

const renderAllCards = async () => {
  try {
    const cards = await getCards();
    console.log(refs.listCards);
    refs.listCards.innerHTML = createMarkup(cards);
    
  } catch (error) {
    console.log(error);
  }
};
renderAllCards();

