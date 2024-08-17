document.addEventListener("DOMContentLoaded", function () {

    const usertab = document.querySelector("[data-userWeather]");
    const searchtab = document.querySelector("[data-searchWeather]");

    const usercont = document.querySelector(".Weather-container");
    const grant = document.querySelector(".grant-location");
    const search = document.querySelector("[data-searchForm]");
    const loading = document.querySelector(".loading-container");
    const userinfo = document.querySelector(".show-container");

    let oldtab = usertab;
    const API_KEY = "168771779c71f3d64106d8a88376808a";
    oldtab.classList.add("current-tab");
    getfromsessionstorage();

    function switchTab(newtab) {
        if (newtab !== oldtab) {
            oldtab.classList.remove("current-tab");
            oldtab = newtab;
            oldtab.classList.add("current-tab");

            if (!search.classList.contains("active")) {
                userinfo.classList.remove("active");
                grant.classList.remove("active");
                search.classList.add("active");
            } else {
                search.classList.remove("active");
                userinfo.classList.remove("active");
                getfromsessionstorage();
            }
        }
    }

    usertab.addEventListener("click", () => {
        switchTab(usertab);
    });

    searchtab.addEventListener("click", () => {
        switchTab(searchtab);
    });

    function getfromsessionstorage() {
        const localc = sessionStorage.getItem("user-cordinates");
        if (!localc || !JSON.parse(localc)?.lat || !JSON.parse(localc)?.lon) {
            grant.classList.add("active");
        } else {
            const coordinates = JSON.parse(localc);
            fetchweather(coordinates);
        }
    }

    async function fetchweather(coordinates) {
        const { lat, lon } = coordinates;
        grant.classList.remove("active");
        loading.classList.add("active");
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            loading.classList.remove("active");
            userinfo.classList.add("active");
            renderweather(data); 
        } catch (err) {
            loading.classList.remove("active");
            userinfo.innerText = "Error fetching search weather data. Please try again later.";
        }
    }

    function renderweather(data) {
        const cityname = document.querySelector("[data-cityName]");
        const countryname = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weather]");
        const weaicon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-weatherTemp]");
        const windspeed = document.querySelector("[data-windSpeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloud = document.querySelector("[data-cloudiness]");

        cityname.innerText = data?.name;
        countryname.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
        desc.innerText = data?.weather?.[0]?.description;
        weaicon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temp.innerText = `${data?.main?.temp} °C`;
        windspeed.innerText = `${data?.wind?.speed} m/s`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloud.innerText = `${data?.clouds?.all}%`;
    }

    function getlocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showposition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showposition(position) {
        const usercoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        sessionStorage.setItem("user-cordinates", JSON.stringify(usercoordinates));
        fetchweather(usercoordinates);
    }

    const grantbt = document.querySelector("[data-grantAccess]");
    grantbt.addEventListener("click", getlocation);

    const searchInput = document.querySelector("[data-searchInput]");
    const searchForm = document.querySelector("[data-searchForm]");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityName = searchInput.value;

        if (cityName === "")
            return;
        else 
            fetchSearchWeatherInfo(cityName);
    });

    async function fetchSearchWeatherInfo(city) {
        loading.classList.add("active");
        userinfo.classList.remove("active");
        grant.classList.remove("active");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            loading.classList.remove("active");
            userinfo.classList.add("active");
            renderweather(data);
        } catch (err) {
            loading.classList.remove("active");
            userinfo.innerText = "Error fetching search weather data. Please try again later.";
        }
    }
});
