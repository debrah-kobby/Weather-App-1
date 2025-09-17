console.log("script loaded");
const firstPage = document.querySelector(".first_page");
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const errorCreate = document.createElement("p");
const apiKey = "672fc162020fdf9e1d41c4deaa9a1bed";
const submitBtn = document.querySelector(".submitBtn");
let cityDisplay = document.querySelector(".cityDisplay");
let weatherEmoji = document.querySelector("#weatherEmoji");

let tempDisplay = document.querySelector(".tempDisplay");
let atmosDisplay = document.querySelector(".atmosDisplay");
let humidDisplay = document.querySelector(".humidDisplay");
let networkError = document.createElement("p");
let backBtn = document.querySelector(".backBtn");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (cityName) {
    try {
      const weatherData = await getWeatherData(cityName); 
      if (document.body.contains(errorCreate)) {
        errorCreate.remove();
      }
      cityInput.value = "";
      displayData(weatherData);
    } catch (error) {
      console.error(error);
      if (error.message === "City not found") {
        errorCreate.textContent = "City not found. Try again.";
        errorCreate.classList.add("errorMessage");
        if (document.body.contains(networkError)) {
          networkError.remove();
        }
        if (!document.body.contains(errorCreate)) {
          document.body.appendChild(errorCreate);
        }
      } else {
        networkError.textContent = "Check your internet Connection";
        networkError.classList.add("errorMessage");
        if (document.body.contains(errorCreate)) {
          errorCreate.remove();
        }
        if (!document.body.contains(networkError)) {
          document.body.appendChild(networkError);
        }
      }
    }
  } else {
    errorCreate.textContent = "Please Enter a City";
    errorCreate.classList.add("errorMessage");
    if (!document.body.contains(errorCreate)) {
      document.body.appendChild(errorCreate);
    }
  }
});

async function getWeatherData(cityName) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("City not found");
  }

  const weatherData = await response.json();
  console.log(weatherData); //
  return weatherData;
}

function displayData(weatherData) {
  firstPage.style.display = "none";
  card.style.display = "block";

  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = weatherData;

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(((temp - 273.15) * 9) / 5 + 32).toFixed(1)}°F`;

  atmosDisplay.textContent = description;
  humidDisplay.textContent = `| H: ${humidity}% |`;
  weatherEmoji.textContent = getWeatherEmoji(id);
  /*  weatherEmoji.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
   */
  backBtn.addEventListener("click", (event) => {
    location.reload();
  });
}

function getWeatherEmoji(id) {
  switch (true) {
    case id >= 200 && id < 300:
      return "⛈️";
    case id >= 300 && id < 400:
      return "🌦️";
    case id >= 500 && id < 600:
      return "🌧️";
    case id >= 600 && id < 700:
      return "❄️";
    case id === 800:
      return "☀️";
    case id >= 801 && id < 900:
      return "☁️";
    default:
      return "🌍";
  }
}
