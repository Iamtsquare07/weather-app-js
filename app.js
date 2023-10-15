// Replace with your actual API key, you can get the API Key here: https://openweathermap.org/api
const apiKey = "";
const tempField = document.getElementById("temperature");
const region = document.getElementById("region");
const weatherInfo = document.getElementById("weather-info");
const conditionField = document.querySelector(".right");
const weatherContainer = document.querySelector(".weather");
const cityInput = document.getElementById("city");
let weatherCondition;

async function getWeatherByCity() {
  const city = cityInput.value;

  if (!city) {
    weatherInfo.textContent = "Please enter a city name.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      const temperature = data.main.temp;
      const description = data.weather[0].description;
      const cityName = data.name;
      const country = data.sys.country;

      region.innerHTML = `<h4>Weather in ${cityName}, ${country}</h4>`;
      tempField.textContent = `${temperature.toFixed(0)}°C`;
      const weatherText = ` ${capitalizeFirstLetter(description)}`;
      weatherInfo.textContent = weatherText;

      getWeatherForecast(cityName);

      weatherCondition = getWeatherCondition(temperature);
      getWeatherIcon(weatherCondition);
    } else {
      weatherInfo.textContent = "City not found. Please check the city name.";
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("An error occurred while fetching weather data.");
    alert("An error occurred while fetching weather data.");
  }
}

async function getWeatherByLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
          const temperature = data.main.temp;
          const description = data.weather[0].description;
          const cityName = data.name;
          const country = data.sys.country;

          region.innerHTML = `<h4>Weather in ${cityName}, ${country}</h4>`;
          tempField.textContent = `${temperature.toFixed(0)}°C`;
          const weatherText = ` ${capitalizeFirstLetter(description)}`;
          weatherInfo.textContent = weatherText;
          getWeatherForecast(cityName);

          weatherCondition = getWeatherCondition(temperature);
          getWeatherIcon(weatherCondition);
        } else {
          weatherInfo.textContent =
            "Error fetching weather data for your location. Please try again.";
        }
      } catch (error) {
        console.error("Error:", error);
        console.log("An error occurred while fetching weather data.");
        alert("An error occurred while fetching weather data.");
      }
    });
  } else {
    weatherInfo.textContent = "Geolocation is not supported in your browser.";
  }
}

document.addEventListener("DOMContentLoaded", getWeatherByLocation);
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") getWeatherByCity();
});

async function getWeatherForecast(city) {
  const forecastInfo = document.getElementById("weather-forecast");

  if (!city) {
    forecastInfo.textContent = "Please enter a city name.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      forecastInfo.innerHTML = "<h2>Weather Forecast:</h2>";
      const forecasts = data.list;
      const dailyForecasts = {};

      forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toDateString();
        const hour = date.getHours();
        const temperature = forecast.main.temp;

        weatherCondition = getWeatherCondition(temperature);

        if (!dailyForecasts[day]) {
          dailyForecasts[day] = {
            morning: { condition: null, temperature: null },
            afternoon: { condition: null, temperature: null },
            evening: { condition: null, temperature: null },
          };
        }

        if (hour < 12 && !dailyForecasts[day].morning.condition) {
          dailyForecasts[day].morning.condition = weatherCondition;
          dailyForecasts[day].morning.temperature = temperature;
        } else if (
          hour >= 12 &&
          hour < 18 &&
          !dailyForecasts[day].afternoon.condition
        ) {
          dailyForecasts[day].afternoon.condition = weatherCondition;
          dailyForecasts[day].afternoon.temperature = temperature;
        } else if (hour >= 18 && !dailyForecasts[day].evening.condition) {
          dailyForecasts[day].evening.condition = weatherCondition;
          dailyForecasts[day].evening.temperature = temperature;
        }
      });

      for (const day in dailyForecasts) {
        const forecastText = `${day} - Morning: ${dailyForecasts[day].morning.condition} (${dailyForecasts[day].morning.temperature}°C), Afternoon: ${dailyForecasts[day].afternoon.condition} (${dailyForecasts[day].afternoon.temperature}°C), Evening: ${dailyForecasts[day].evening.condition} (${dailyForecasts[day].evening.temperature}°C)`;
        forecastInfo.innerHTML += `<p>${forecastText}</p>`;
      }
    } else {
      forecastInfo.textContent = "City not found. Please check the city name.";
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("An error occurred while fetching weather data.");
    alert("An error occurred while fetching weather data.");
  }
}

function capitalizeFirstLetter(text) {
  // Split the string into words
  const words = text.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back together
  return capitalizedWords.join(" ");
}

function getWeatherCondition(temperature) {
  if (temperature) {
    if (temperature < 5) {
      return "Snow";
    } else if (temperature >= 5 && temperature < 20) {
      return "Rain";
    } else if (temperature >= 20 && temperature < 30) {
      return "Cloudy";
    } else {
      return "Sunny";
    }
  }
}

function getWeatherIcon(weatherCondition) {
  if (weatherCondition) {
    if (weatherCondition === "Sunny") {
      conditionField.innerHTML = `<i class="fa-solid fa-cloud-sun"></i>`;
    } else if (weatherCondition === "Cloudy") {
      weatherContainer.style.backgroundImage = `url('./images/cloudy.png')`;
      conditionField.innerHTML = `<i class="fa-solid fa-cloud"></i>`;
    } else if (weatherCondition === "Rain") {
      weatherContainer.style.backgroundImage = `url('./images/rain.png')`;
      conditionField.innerHTML = `<i class="fa-solid fa-cloud-rain"></i>`;
    } else if (weatherCondition === "Snow") {
      weatherContainer.style.backgroundImage = `url('./images/snow.png')`;
      conditionField.innerHTML = `<i class="fa-solid fa-snowman"></i>`;
    } else {
      condition.innerHTML = `<i class="fa-solid fa-cloud"></i>`;
    }
  } else {
    alert("Condition not found");
  }
}

function getTimeOfDay(time) {
  if (time >= 4 && time <= 11) {
    return "Morning";
  } else if (time >= 12 && time < 16) {
    return "Afternoon";
  } else if (time >= 16 && time <= 21) {
    return "Evening";
  } else {
    return "Night";
  }
}

now = new Date();
const timeOfDay = getTimeOfDay(now.getHours());
document.getElementById("time-of-day").textContent = timeOfDay;
