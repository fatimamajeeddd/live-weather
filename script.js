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

// Baarish
function startRain() {
  const rain = document.getElementById('rain');
  rain.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = (0.5 + Math.random() * 0.7) + 's';
    drop.style.animationDelay = (Math.random() * 2) + 's';
    rain.appendChild(drop);
  }
}

function stopRain() {
  document.getElementById('rain').innerHTML = '';
}

// Aasman: suraj, badal, barf
function clearSky() {
  document.getElementById('sky').innerHTML = '';
}

function startSun() {
  clearSky();
  const sun = document.createElement('div');
  sun.className = 'sun';
  document.getElementById('sky').appendChild(sun);
}

function startClouds() {
  clearSky();
  const sky = document.getElementById('sky');
  for (let i = 0; i < 6; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = (5 + Math.random() * 45) + 'vh';
    cloud.style.animationDuration = (30 + Math.random() * 30) + 's';
    cloud.style.animationDelay = (-Math.random() * 30) + 's';
    cloud.style.opacity = 0.6 + Math.random() * 0.4;
    sky.appendChild(cloud);
  }
}

function startSnow() {
  clearSky();
  const sky = document.getElementById('sky');
  for (let i = 0; i < 60; i++) {
    const flake = document.createElement('div');
    flake.className = 'flake';
    const size = 4 + Math.random() * 8;
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDuration = (5 + Math.random() * 6) + 's';
    flake.style.animationDelay = (-Math.random() * 10) + 's';
    sky.appendChild(flake);
  }
}

// Weather code ke hisaab se background mood lagana
function setMood(code, isDay) {
  let mood = "cloudy";

  if (code === 0 || code === 1) mood = isDay ? "sunny" : "night";
  else if (code === 2 || code === 3 || code === 45 || code === 48) mood = "cloudy";
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) mood = "rainy";
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86) mood = "snowy";

  document.body.className = mood;

  if (mood === "rainy") startRain();
  else stopRain();

  if (mood === "sunny") startSun();
  else if (mood === "cloudy") startClouds();
  else if (mood === "snowy") startSnow();
  else clearSky();
}

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

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`
    );
    const weatherData = await weatherRes.json();

    placeName.textContent = `${location.name}, ${location.country}`;
    tempNow.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
    descNow.textContent = WEATHER_CODES[weatherData.current.weather_code] || 'Unknown';

    setMood(weatherData.current.weather_code, weatherData.current.is_day);

    weatherCard.style.display = 'block';
    statusEl.textContent = '';

  } catch (error) {
    console.error(error);
    statusEl.textContent = 'City not found. Try again.';
    statusEl.className = 'status error';
  }
}
document.addEventListener('mousemove', function (e) {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.getElementById('sky').style.transform = `translate(${x}px, ${y}px)`;
  document.getElementById('rain').style.transform = `translate(${x / 2}px, ${y / 2}px)`;
});