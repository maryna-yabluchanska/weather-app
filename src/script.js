//Change date
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function formatDate() {
  let now = new Date();
  let dateHtml = document.querySelector('.date');


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

function formatCurrentDate(timestamp) {
  let date = new Date(timestamp * 1000)
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  let day = date.getDay()
  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector('.forecast-section');
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach((day, index) => {
    if (index < 5) {
      forecastHTML = forecastHTML + `
        <div class="col forcast-day">
          <h4>${formatCurrentDate(day.time)}</h4>
          <img src=${day.condition.icon_url} alt="weather ico" width="40">
          <p>${Math.round(day.temperature.maximum)}°C</p>
          <p class="min-temp">${Math.round(day.temperature.minimum)}°C</p>
        </div>`
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

}

function getForecast(city) {
  let apiKey = 'fbbt3o5111665aab81dce0ebb30c7e4f';
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
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
  let weatherSection = document.querySelector('.weather-color-section')
  setCityName(response.data.name)
  humidity.innerHTML = `${response.data.main.humidity}`;
  conditions.innerHTML = `${response.data.weather[0].description}`;
  pressure.innerHTML = `${response.data.main.pressure}`;
  visibility.innerHTML = `${response.data.visibility / 1000}`;
  wind.innerHTML = Math.round(response.data.wind.speed * 18 / 5);
  if (response.data.weather[0].id === 800) {
    weatherSection.style.backgroundColor = '#bbc7d7';
  } else if (response.data.weather[0].id === 300) {
    weatherSection.style.backgroundColor = '#3b5d8b';
  }
  weatherIco.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
  getForecast(response.data.name);

  function tempMetricCel(event) {
    event.preventDefault();
    temperature.innerHTML = `${Math.round(response.data.main.temp)}`;
  }

  function tempMetricFar(event) {
    event.preventDefault();
    temperature.innerHTML = `${Math.round(response.data.main.temp * 1.8 + 32)}`;
  }

  tempCel.addEventListener("click", tempMetricCel)
  tempFar.addEventListener("click", tempMetricFar)
  temperature.innerHTML = `${Math.round(response.data.main.temp)}`;
}

function handleSubmit(event) {
  event.preventDefault();

  let searchFormInput = document.querySelector('#search-form-input')
  if (searchFormInput.value !== '') {
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