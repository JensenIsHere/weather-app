var textLocation = document.getElementsByClassName("text-loc")[0];
const searchText = document.getElementById("search-bar");
const searchButton = document.getElementById("search-go");
const tempToggleButton = document.getElementById("f-c-toggle");
const apiKey = "822bb3cf5fe4ecab82c4d1b17d95bbe5";

displayForecast();

searchButton.addEventListener("click", () => {
  displayForecast();
});

tempToggleButton.addEventListener("click", () => {
  tempToggleButton.textContent == "Fahrenheit"
    ? (tempToggleButton.textContent = "Celsius")
    : (tempToggleButton.textContent = "Fahrenheit");
  displayForecast();
});

async function displayForecast() {
  let allWeather = await getForecast(searchText.value);
  let current;
  let hourly = [];
  let daily = [];
  let tempToggle; //change later to read the toggle area

  tempToggle = tempToggleButton.textContent == "Fahrenheit" ? "F" : "C";

  current = getCurrent(allWeather, tempToggle);

  for (let i = 0; i <= 6; i++) {
    hourly.push(getHourly(allWeather, i, tempToggle));
  }

  for (let i = 1; i <= 5; i++) {
    daily.push(getDaily(allWeather, i, tempToggle));
  }

  fillCurrent(current);

  for (let i = 0; i <= 6; i++) {
    fillHourly(hourly, i);
  }

  for (let i = 0; i <= 4; i++) {
    fillDaily(daily, i);
  }
}

async function getForecast(city) {
  const coordinates = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`,
    { mode: "cors" }
  ).then((response) => {
    return response.json();
  });

  console.log(coordinates[0]);

  const currentWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates[0].lat}&lon=${coordinates[0].lon}&appid=${apiKey}`,
    { mode: "cors" }
  ).then(function (response) {
    return response.json();
  });

  console.log(currentWeather);

  return currentWeather;
}

function toCelsius(temperature) {
  return temperature - 273.15;
}

function toFahrenheit(temperature) {
  return ((temperature - 273.15) * 9) / 5 + 32;
}

function getCurrent(webData, tempToggle) {
  return {
    temp: Math.round(
      tempToggle == "F"
        ? toFahrenheit(webData.current.temp)
        : toCelsius(webData.current.temp)
    ),
    desc: webData.current.weather[0].description,
    windSpeed: Math.round(webData.current.wind_speed),
    windDir: windDirection(webData.current.wind_deg),
    icon: webData.current.weather[0].icon,
  };
}

function getHourly(webData, hour, tempToggle) {
  return (hourly = {
    temp: Math.round(
      tempToggle == "F"
        ? toFahrenheit(webData.hourly[hour].temp)
        : toCelsius(webData.hourly[hour].temp)
    ),
    rain: webData.hourly[hour].pop * 100,
    icon: webData.hourly[hour].weather[0].icon,
  });
}

function getDaily(webData, day, tempToggle) {
  return {
    lowTemp: Math.round(
      tempToggle == "F"
        ? toFahrenheit(webData.daily[day].temp.min)
        : toCelsius(webData.daily[day].temp.min)
    ),
    highTemp: Math.round(
      tempToggle == "F"
        ? toFahrenheit(webData.daily[day].temp.max)
        : toCelsius(webData.daily[day].temp.max)
    ),
    rain: webData.daily[day].pop * 100,
    desc: webData.daily[day].weather[0].description,
    icon: webData.daily[day].weather[0].icon,
  };
}

function fillCurrent(current) {
  document.getElementsByClassName("current-temp")[0].textContent = current.temp;
  document.getElementsByClassName(
    "current-pic"
  )[0].src = `http://openweathermap.org/img/wn/${
    current.icon
  }@2x.png?t=${new Date().getTime()}`;
  document.getElementsByClassName("current-condition")[0].textContent =
    titleCase(current.desc);
  document.getElementsByClassName("current-wind-speed")[0].textContent =
    current.windSpeed;
  document.getElementsByClassName("current-wind-dir")[0].textContent =
    current.windDir;
}

function fillHourly(hourly, hour) {
  document.getElementsByClassName("hour-time")[hour].textContent =
    hourCalc(hour);
  document.getElementsByClassName("hour-temp")[hour].textContent =
    hourly[hour].temp;
  document.getElementsByClassName("hour-pic")[
    hour
  ].src = `http://openweathermap.org/img/wn/${
    hourly[hour].icon
  }@2x.png?t=${new Date().getTime()}`;
  document.getElementsByClassName("hour-rain")[
    hour
  ].textContent = `${hourly[hour].rain}%`;
}

function fillDaily(daily, day) {
  document.getElementsByClassName("day-week")[day].textContent = dateCalc(
    day + 1
  );
  document.getElementsByClassName("day-high")[
    day
  ].textContent = `High: ${daily[day].highTemp}`;
  document.getElementsByClassName("day-low")[
    day
  ].textContent = `Low: ${daily[day].lowTemp}`;
  document.getElementsByClassName("day-rain")[
    day
  ].textContent = `${daily[day].rain}%`;
  document.getElementsByClassName("day-desc")[day].textContent = titleCase(
    daily[day].desc
  );
  document.getElementsByClassName("day-pic")[
    day
  ].src = `http://openweathermap.org/img/wn/${
    daily[day].icon
  }@2x.png?t=${new Date().getTime()}`;
}

function titleCase(desc) {
  return desc[0].toUpperCase() + desc.substring(1);
}

function windDirection(degrees) {
  if (degrees == 0) return "Calm";
  else if (degrees <= 11 || degrees >= 349) return "N";
  else if (degrees <= 33) return "NNE";
  else if (degrees <= 56) return "NE";
  else if (degrees <= 78) return "ENE";
  else if (degrees <= 101) return "E";
  else if (degrees <= 123) return "ESE";
  else if (degrees <= 146) return "SE";
  else if (degrees <= 168) return "SSE";
  else if (degrees <= 191) return "S";
  else if (degrees <= 213) return "SSW";
  else if (degrees <= 236) return "SW";
  else if (degrees <= 258) return "WSW";
  else if (degrees <= 281) return "W";
  else if (degrees <= 303) return "WNW";
  else if (degrees <= 326) return "NW";
  else if (degrees <= 348) return "NNW";
}

function hourCalc(offset) {
  today = new Date();
  today.setHours(today.getHours() + offset);
  if (today.getHours() > 12) return `${today.getHours() - 12} PM`;
  else return `${today.getHours()} AM`;
}

function dateCalc(offset) {
  today = new Date();
  today.setDate(today.getDate() + offset);
  switch (today.getDay()) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
  }
}
