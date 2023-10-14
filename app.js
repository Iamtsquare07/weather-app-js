// Replace with your actual API key, you can get the API Key here: https://openweathermap.org/api
const apiKey = "95a8aff3374ba1428ae34b7607c60b5a";
const tempField = document.getElementById("temperature");
const city = document.getElementById("city");
const weatherInfo = document.getElementById("weather-info");

async function getWeatherByCity() {
  const cityInput = document.getElementById("city");
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

      city.innerHTML = `<h2>Weather in ${cityName}, ${country}:</h2>`;
      tempField.textContent = `${temperature}°C`;
      const weatherText = ` ${description}`;
      weatherInfo.textContent = weatherText;

      getWeatherForecast(cityName);
    } else {
      weatherInfo.textContent = "City not found. Please check the city name.";
    }
  } catch (error) {
    console.error("Error:", error);
    weatherInfo.textContent = "An error occurred while fetching weather data.";
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

          city.textContent = `Weather in ${cityName}, ${country}:`;
          tempField.textContent = `${temperature}°C`;
          const weatherText = ` ${description}`;
          weatherInfo.textContent = weatherText;
          getWeatherForecast(cityName);
        } else {
          weatherInfo.textContent =
            "Error fetching weather data for your location. Please try again.";
        }
      } catch (error) {
        console.error("Error:", error);
        weatherInfo.textContent =
          "An error occurred while fetching weather data.";
      }
    });
  } else {
    weatherInfo.textContent = "Geolocation is not supported in your browser.";
  }
}

document.addEventListener("DOMContentLoaded", getWeatherByLocation);

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
      forecastInfo.innerHTML = "<h2>Daily Weather Forecast:</h2>";
      const forecasts = data.list;
      const dailyForecasts = {};

      forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toDateString();
        const hour = date.getHours();
        const temperature = forecast.main.temp;

        let weatherCondition;
        if (temperature < 5) {
          weatherCondition = "Snow";
        } else if (temperature >= 5 && temperature < 20) {
          weatherCondition = "Rain";
        } else if (temperature >= 20 && temperature < 30) {
          weatherCondition = "Cloudy";
        } else {
          weatherCondition = "Sunny";
        }

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
    forecastInfo.textContent = "An error occurred while fetching weather data.";
  }
}
