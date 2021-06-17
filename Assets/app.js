//City search function
function search() {
    const cityInputEl = document.getElementById("city-input");
    const historyEl = document.getElementById("history");
    const clearInputEl = document.getElementById("clear-input");
    const cityNameEl = document.getElementById("city-name");
    const currIconEl = document.getElementById("current-icon");
    const currTempEl = document.getElementById("temp");
    const currHumidEl = document.getElementById("humid");4
    const currWindEl = document.getElementById("windspeed");
    const currUVIel = document.getElementById("UVI");
    const searchBtn = document.getElementById("search-btn");
    
//History of previous searches
    let searched = JSON.parse(localStorage.getItem("searched")) || [];
    console.log(searched);
    
    const apiKey = "2276aadd3e82d9c2a415f6d79a166169";

//API call for city that user inputs
    function renderWeather(cityId) {
        let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityId + "&appid=" + apiKey;
        
//Axios is used to pull info from the API
        axios.get(apiURL)

        .then(function(response) {
            const todayDate = new Date(response.data.dt*1000);
            const day = todayDate.getDate();
            const month = todayDate.getMonth() + 1;
            const year = todayDate.getFullYear();
            cityNameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            
//Icons for weather
            let icon = response.data.weather[0].icon;
            currIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + icon + "@2x.png");
            currIconEl.setAttribute("alt",response.data.weather[0].description);
            currTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            currHumidEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

//Latitude & Longitude for user input coordinates
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let apiUVIurl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
        axios.get(apiUVIurl)
        .then(function(response){
            let uviIndex = document.createElement("span");
            uviIndex.setAttribute("class","badge badge-danger");
            uviIndex.innerHTML = response.data[0].value;
            currUVIel.innerHTML = "UV Index: ";
            currUVIel.append(uviIndex);
        });

    
        let city = response.data.id;
        let apiFiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=" + apiKey;
        axios.get(apiFiveDayURL)
        .then(function(response){
            
             const fiveDayForeEl = document.querySelectorAll(".fiveDayFore");
             for (i = 0; i < fiveDayForeEl.length; i++) {
                 fiveDayForeEl[i].innerHTML = "";
                 const fiveIndex = i * 8 + 4;
                 const fiveDate = new Date(response.data.list[fiveIndex].dt*1000);
                 const fiveDay = fiveDate.getDate();
                 const fiveMonth = fiveDate.getMonth() + 1;
                 const fiveYear = fiveDate.getFullYear();
                 const fiveDateEl = document.createElement("p");
                 fiveDateEl.setAttribute("class","mt-3 mb-0 five-date");
                 fiveDateEl.innerHTML = fiveMonth + "/" + fiveDay + "/" + fiveYear;
                 fiveDayForeEl[i].append(fiveDateEl);
                 const fiveIconEl = document.createElement("img");
                 fiveIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[fiveIndex].weather[0].icon + "@2x.png");
                 fiveIconEl.setAttribute("alt",response.data.list[fiveIndex].weather[0].description);
                 fiveDayForeEl[i].append(fiveIconEl);
                 const fiveTempEl = document.createElement("p");
                 fiveTempEl.innerHTML = "Temp: " + k2f(response.data.list[fiveIndex].main.temp) + " &#176F";
                 fiveDayForeEl[i].append(fiveTempEl);
                 const fiveHumEl = document.createElement("p");
                 fiveHumEl.innerHTML = "Humid: " + response.data.list[fiveIndex].main.humidity + "%";
                 fiveDayForeEl[i].append(fiveHumEl);
                 }
             })
        });
    }

//Listens for search button to be clicked
    searchBtn.addEventListener("click",function() {
        const searchCity = cityInputEl.value;
        renderWeather(searchCity);
        searched.push(searchCity);
        localStorage.setItem("search",JSON.stringify(searched));
        renderInput();
    })

//Listens for clear button to be clicked
    clearInputEl.addEventListener("click",function() {
        searched = [];
        renderInput();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

//Lists previous searches
    function renderInput() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searched.length; i++) {
            const cityHistory = document.createElement("input");
            cityHistory.setAttribute("type","text");
            cityHistory.setAttribute("readonly",true);
            cityHistory.setAttribute("class", "form-control d-block bg-white");
            cityHistory.setAttribute("value", searched[i]);
            cityHistory.addEventListener("click",function() {
                renderWeather(cityHistory.value);
            })
            historyEl.append(cityHistory);
        }
    }

    renderInput();
    if (searched.length > 0) {
        renderWeather(searched[searched.length - 1]);
    }



}

//Function starts the search 
search();

