const apiKey = "3cec58d53de077ff22b29e8cd2fefd3b";

const searchBtn = document.getElementById("searchBtn");
const gpsBtn = document.getElementById("gpsBtn");
const modeBtn = document.getElementById("modeBtn");
const cityInput = document.getElementById("city");

const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherInfo = document.getElementById("weather-info");
const forecastContainer = document.getElementById("forecast");
const weatherEffects = document.getElementById("weather-effects");

let darkMode = false;

// Fetch weather by city
async function getWeatherByCity(city){
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    if(data.cod===200){
      showWeather(data);
      setWeatherEffects(data.weather[0].main);
    } else alert("City not found!");
  } catch(err){ console.error(err);}
}

// Fetch weather by GPS
function getWeatherByGPS(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async pos=>{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        showWeather(data);
        setWeatherEffects(data.weather[0].main);
      }catch(err){ console.error(err);}
    });
  }else alert("Geolocation not supported");
}

// Show current weather
function showWeather(data){
  const iconCode = data.weather[0].icon;
  currentWeatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  currentWeatherIcon.alt = data.weather[0].description;

  temperature.textContent = `${data.main.temp}°C`;
  description.textContent = data.weather[0].description;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${data.wind.speed} m/s`;
  weatherInfo.classList.remove("hidden");
}

// Weather effects
function setWeatherEffects(condition){
  weatherEffects.innerHTML="";
  if(condition.includes("Rain") || condition.includes("Drizzle")) createDrops(50);
  if(condition.includes("Snow")) createSnow(40);
}

function createDrops(num){
  for(let i=0;i<num;i++){
    const drop=document.createElement("div");
    drop.classList.add("drop");
    drop.style.left=Math.random()*100+"vw";
    drop.style.animationDuration=(0.5+Math.random()*0.5)+"s";
    weatherEffects.appendChild(drop);
  }
}

function createSnow(num){
  for(let i=0;i<num;i++){
    const snow=document.createElement("div");
    snow.classList.add("snowflake");
    snow.style.left=Math.random()*100+"vw";
    snow.style.animationDuration=(3+Math.random()*2)+"s";
    weatherEffects.appendChild(snow);
  }
}

// Event listeners
searchBtn.addEventListener("click",()=>{if(cityInput.value) getWeatherByCity(cityInput.value);});
gpsBtn.addEventListener("click",getWeatherByGPS);
cityInput.addEventListener("keypress",(e)=>{if(e.key==="Enter" && cityInput.value) getWeatherByCity(cityInput.value);});

// Dark/Light mode toggle
modeBtn.addEventListener("click",()=>{
  darkMode=!darkMode;
  document.body.classList.toggle("dark");
  modeBtn.textContent=darkMode?"☀️":"🌙";
});
