
const searchForm = document.getElementById('searchForm');
const countryInput = document.getElementById('countryInput');
const statusMessage = document.getElementById('statusMessage');
const countryCard = document.getElementById('countryCard');

const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const officialName = document.getElementById('officialName');
const capital = document.getElementById('capital');
const region = document.getElementById('region');
const population = document.getElementById('population');
const languages = document.getElementById('languages');
const currencies = document.getElementById('currencies');
const area = document.getElementById('area');
const timezones = document.getElementById('timezones');

const API_TOKEN = 'rc_live_a5c1da65a1b8469bad59f632300eccbb';

// Lytte etter når brukeren trykker på "Søk"
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Hindrer siden i å laste på nytt
    const query = countryInput.value.trim();

    if (query) {
        fetchCountry(query);
    }
});

function fetchCountry(countryNameQuery) {
    showStatus('Søker etter land...', false);
    countryCard.classList.add('hidden');

    const url = `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryNameQuery)}`;

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`
        }
    })
    .then(function (response) {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Fant ikke landet. Prøv igjen.');
            } else if (response.status === 401 || response.status === 403) {
                throw new Error('Ugyldig API-nøkkel eller CORS-sperre (sjekk CORS Allowed Origins på restcountries.com).');
            } else {
                throw new Error('Noe gikk galt med nettverkskallet.');
            }
        }
        return response.json();
    })
    .then(function (data) {
        console.log("API-respons:", data);

        // Henter ut landet fra responsen (avhengig av hvordan v5-strukturen returnerer data)
        const countryList = Array.isArray(data) ? data : (data.data?.objects || data.data || []);
        
        if (countryList.length === 0) {
            throw new Error('Fant ikke landet. Prøv igjen.');
        }

        const country = countryList[0];
        displayCountry(country);
        statusMessage.classList.add('hidden');

    })
    .catch(function (error) {
        showStatus(error.message, true);
        countryCard.classList.add('hidden');
    });
}

function displayCountry(c) {
    const flagSrc = c.flags?.png || c.flags?.svg || c.flag?.url_png || '';
    countryFlag.src = flagSrc;
    countryFlag.alt = `Flagg for ${c.name?.common || 'land'}`;
    
    countryName.textContent = c.name?.common || c.name || 'Ukjent';
    officialName.textContent = c.name?.official ? `(${c.name.official})` : '';

    capital.textContent = c.capital ? (Array.isArray(c.capital) ? c.capital.join(', ') : c.capital) : 'Ukjent';

    region.textContent = c.region || 'Ukjent';

    population.textContent = c.population ? c.population.toLocaleString('no-NO') + ' innbyggere' : 'Ukjent';

    if (c.languages) {
        // Håndterer både om språk er et objekt eller array
        const langValues = typeof c.languages === 'object' ? Object.values(c.languages) : c.languages;
        languages.textContent = Array.isArray(langValues) ? langValues.join(', ') : langValues;
    } else {
        languages.textContent = 'Ukjent';
    }

    if (c.currencies) {
        const currValues = typeof c.currencies === 'object' ? Object.values(c.currencies).map(curr => curr.name || curr) : c.currencies;
        currencies.textContent = Array.isArray(currValues) ? currValues.join(', ') : currValues;
    } else {
        currencies.textContent = 'Ukjent';
    }

    area.textContent = c.area ? c.area.toLocaleString('no-NO') + ' km²' : 'Ukjent';

    timezones.textContent = c.timezones ? c.timezones.join(', ') : 'Ukjent';

    countryCard.classList.remove('hidden');
}

function showStatus(text, isError) {
    statusMessage.textContent = text;
    statusMessage.classList.remove('hidden');
    if (isError) {
        statusMessage.classList.add('error');
    } else {
        statusMessage.classList.remove('error');
    }
}