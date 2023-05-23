//Change date

function formatDate() {
  let now = new Date();
  let dateHtml = document.querySelector('.date');
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  let month = months[now.getMonth()];
  let weekDay = days[now.getDay()];
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  let time = hours + ":" + minutes;
  dateHtml.innerHTML = `<p>${weekDay}, ${month} ${day}</p><p>${time}</p>`;
}

formatDate();

let city = null
let apiKey = 'cf52937bf1131f9141ff735913535008';

if (city == null) {
  let defaultCity = "KIEV"
  searchCity(defaultCity)
}

function setCityName(cityProperty) {
  let cityName = document.querySelector('.cityName')
  city = cityProperty.charAt(0).toUpperCase() + cityProperty.slice(1).toLowerCase();
  cityName.innerHTML = `${city}`;
}

function showWeather(response) {
  let temperature = document.querySelector('.temperature')
  let weatherIco = document.querySelector('.weatherIco')
  let humidity = document.querySelector('.humidity')
  let wind = document.querySelector('.wind')
  let pressure = document.querySelector('.pressure')
  let conditions = document.querySelector('.conditions')
  let visibility = document.querySelector('.visibility ')
  let tempCel = document.querySelector('.tempCel')
  let tempFar = document.querySelector('.tempFar')

  setCityName(response.data.name)
  humidity.innerHTML = `${response.data.main.humidity}`;
  conditions.innerHTML = `${response.data.weather[0].description}`;
  pressure.innerHTML = `${response.data.main.pressure}`;
  visibility.innerHTML = `${response.data.visibility / 1000}`;
  wind.innerHTML = Math.round(response.data.wind.speed * 18 / 5);
  weatherIco.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)

  function tempMetricCel(event) {
    event.preventDefault();
    temperature.innerHTML = `${response.data.main.temp}`;
  }

  function tempMetricFar(event) {
    event.preventDefault();
    let temperatureRounded = Math.round(response.data.main.temp)
    temperature.innerHTML = `${temperatureRounded * 1.8 + 32}`;
  }

  tempCel.addEventListener("click", tempMetricCel)
  tempFar.addEventListener("click", tempMetricFar)
  temperature.innerHTML = `${response.data.main.temp}`;
}

function handleSubmit(event) {
  event.preventDefault();

  let searchFormInput = document.querySelector('#search-form-input')
  if (searchFormInput.value !== '') {
    // setCityName(searchFormInput.value);
    searchCity(searchFormInput.value);
  }
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function changeCityByLocation(location) {
  let lon = location.coords.longitude;
  let lat = location.coords.latitude
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(changeCityByLocation);
}

let buttonCurrent = document.querySelector('.buttonCurrent')
buttonCurrent.addEventListener("click", getCurrentPosition)