// declare variables
const formEl = document.querySelector("#form"); 
const cityInputEl = document.querySelector("#city-input"); 
const searchBtn = document.querySelector("#search-btn");
const containerEl = document.querySelector("#container"); 
const summmaryEl = document.querySelector("#summary"); 
const fiveDayContainerEl = document.querySelector("#card-container"); 
const forecastCardEl = document.querySelectorAll(".card-body"); 

const apiKey = "2276aadd3e82d9c2a415f6d79a166169"; 

//let day = moment().format('l'); 

const searchedHistoryEl = document.querySelector("#searched-history"); 
let searchedCity = JSON.parse(localStorage.getItem("searched-city")) || [];   


// get weather in city that the user entered 
let formSubmitHandler = function (event) {
    event.preventDefault();

    let city = cityInputEl.value.trim(); 

    if (city) {
        renderDay(city); 
        renderFiveDayForecast(city); 
        savedSearches(event); 

        containerEl.classList.remove("hide"); 

        cityInputEl.value = ''; 
        
    } else {
        alert('Please enter a city name here'); 
    }
}; 

const renderDay = function (city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            //Show weather for today
            let today = data.name + " " + day;
            let cityEl = document.getElementById("city-element").textContent = today; 

            let currIconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            let currWeatherIcon = document.getElementById("current-icon").src = currIconurl;

            let currTemp = document.getElementById("temp").textContent = "Temperature:" + " " + data.main.temp + " °F"; 
            let currHumid = document.getElementById("humidity").textContent = "Humidity:" + " " + data.main.humidity + "%";
            let currWindSpd = document.getElementById("wind-speed").textContent = "Wind Speed:" + " " + data.wind.speed + " MPH"; 

            let lat = data.coord.lat;
            let lon = data.coord.lon;
            renderUVI(lat,lon); 

          });
        } else {
          alert('Error');
        }
      })
      .catch(function (error) {
        alert("Sorry, but that is not a valid city.");
      });
  };

  const renderUVI = function (lat, lon) {
    let uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    fetch(uviURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            //Show UV index levels: good/moderate/bad
            let uvIndex = document.getElementById("UV-index").textContent = data.current.uvi; 

            const uviSpan = document.querySelector("UV-index"); 

            if (uvIndex > 3 && uvIndex < 6) {
              uviSpan.classList.remove("green"); 
              uviSpan.classList.add("yellow");
            }
            else if (uvIndex > 6 && uvIndex < 8) {
              uviSpan.classList.remove("green"); 
              uviSpan.classList.add("orange"); 
            }
            else if (uvIndex > 7) {
              uviSpan.classList.remove("green"); 
              uviSpan.classList.add("red"); 
            };
           
          });
        } else {
          alert('Error');
        }
      })
      .catch(function (error) {
        alert("Sorry, but that is not a valid city.");
      });

  }

const renderFiveDayForecast = function (city) {
    var apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

    fetch(apiForecastUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            //Show 5 day forecast
            const dayOne = document.querySelector("#day-one").textContent = moment().add(1,'days').format('L');
            const dayTwo = document.querySelector("#day-two").textContent = moment().add(2,'days').format('L');
            const dayThree = document.querySelector("#day-three").textContent = moment().add(3,'days').format('L');
            const dayFour = document.querySelector("#day-four").textContent = moment().add(4,'days').format('L');
            const dayFive = document.querySelector("#day-five").textContent = moment().add(5, 'days').format('L');

            let dayOneIcon = document.getElementById("day-one-icon").src = "http://openweathermap.org/img/w/" + data.list[4].weather[0].icon + ".png";
            let dayTwoIcon = document.getElementById("day-two-icon").src = "http://openweathermap.org/img/w/" + data.list[12].weather[0].icon + ".png";
            let dayThreeIcon = document.getElementById("day-three-icon").src = "http://openweathermap.org/img/w/" + data.list[20].weather[0].icon + ".png";
            let dayFourIcon = document.getElementById("day-four-icon").src = "http://openweathermap.org/img/w/" + data.list[28].weather[0].icon + ".png";
            let dayFiveIcon = document.getElementById("day-five-icon").src = "http://openweathermap.org/img/w/" + data.list[36].weather[0].icon + ".png";



            let dayOneTemp = document.getElementById("day-one-temp").textContent = "Temperature:" + " " + data.list[4].main.temp + " °F"; 
            let dayTwoTemp = document.getElementById("day-two-temp").textContent = "Temperature:" + " " + data.list[12].main.temp + " °F"; 
            let dayThreeTemp = document.getElementById("day-three-temp").textContent = "Temperature:" + " " + data.list[20].main.temp + " °F"; 
            let dayFourTemp = document.getElementById("day-four-temp").textContent = "Temperature:" + " " + data.list[28].main.temp + " °F"; 
            let dayFiveTemp = document.getElementById("day-five-temp").textContent = "Temperature:" + " " + data.list[36].main.temp + " °F"; 

            let dayOneHumidity = document.getElementById("day-one-humid").textContent = "Humidity:" + " " + data.list[4].main.humidity + "%";
            let dayTwoHumidity = document.getElementById("day-two-humid").textContent = "Humidity:" + " " + data.list[12].main.humidity + "%";
            let dayThreeHumidity = document.getElementById("day-three-humid").textContent = "Humidity:" + " " + data.list[20].main.humidity + "%";
            let dayFourHumidity = document.getElementById("day-four-humid").textContent = "Humidity:" + " " + data.list[28].main.humidity + "%";
            let dayFiveHumidity = document.getElementById("day-five-humid").textContent = "Humidity:" + " " + data.list[36].main.humidity + "%";



          });
        } else {
          alert('Error');
        }
      })
      .catch(function (error) {
        alert("Sorry, but that is not a valid city.");
      });
   
}; 


//store past searches in Local Storage & show on screen (needs fixing/editing)
let savedSearches = function(event) {
    event.preventDefault(); 
    let city = cityInputEl.value.trim();
    li = document.createElement("li"); 
    li.textContent = city; 
    li.classList.add("past-searches"); 
    searchedHistoryEl.appendChild(li); 
    cityInputEl.value = ""; 
    searchedCity.push(city);

    localStorage.setItem('city-history', JSON.stringify(searchedCity));
};  

// make past searches clickable
let prevSearch = function(event) {
    let prevCity = event.target.textContent; 
    console.log(prevCity); 

    renderDay(prevCity); 
    renderFiveDayForecast(prevCity);
}

formEl.addEventListener("button", formSubmitHandler);
searchedHistoryEl.addEventListener("click", prevSearch); 