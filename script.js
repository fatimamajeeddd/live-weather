const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const weatherCard = document.getElementById('weatherCard');
const placeName = document.getElementById('placeName');
const tempNow = document.getElementById('tempNow');
const descNow = document.getElementById('descNow');

// Weather codes ko readable text mein badalne ke liye
const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  51: 'Light drizzle',
  61: 'Rain',
  71: 'Snow',
  80: 'Rain showers',
  95: 'Thunderstorm'
};

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  statusEl.textContent = 'Loading...';
  statusEl.className = 'status';
  weatherCard.style.display = 'none';

  try {
    // Step 1: City ka naam se location (latitude/longitude) nikalna
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const location = geoData.results[0];
    const lat = location.latitude;
    const lon = location.longitude;

    // Step 2: Location ki latitude/longitude se weather nikalna
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    const weatherData = await weatherRes.json();

    // Step 3: Data ko screen par dikhana
    placeName.textContent = `${location.name}, ${location.country}`;
    tempNow.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
    descNow.textContent = WEATHER_CODES[weatherData.current.weather_code] || 'Unknown';

    weatherCard.style.display = 'block';
    statusEl.textContent = '';

  } catch (error) {
    statusEl.textContent = 'City not found. Try again.';
    statusEl.className = 'status error';
  }
}