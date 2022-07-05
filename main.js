const weatherData = {
  city: "",
  country: "",

  API_KEY: "9ed09a011f74d13c1ade1b8ad4c9b8b7",
  async collectWeatherData() {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
    )
      .then(function (response) {
        if (!response.ok)
          UIinit.showErrMessage("Error Occured While Fetching API Data");
        return response;
      })
      .then(async function (response) {
        return await response.json();
      })
      .catch(function () {
        UIinit.showErrMessage("Unknown ERROR Occured");
      });

    if (res === undefined) {
      console.log("nothing found");
      return false;
    } else {
      return res;
    }
  },
};

// weatherData.collectWeatherData();

let dataSetToStorage = {
  city: "",
  country: "",

  saveItem() {
    // console.log(this.city, this.country);
    localStorage.setItem("Country", this.country),
      localStorage.setItem("City", this.city);
  },
  getItem() {
    let country = localStorage.getItem("Country");
    let city = localStorage.getItem("City");
    // console.log(country, city);
    // debugger
    return { country, city };
  },
};

const UIinit = {
  allSeletor() {
    let countryElem = document.querySelector("#country");
    let cityElem = document.querySelector("#city");
    const form = document.querySelector("form");
    const showCityElem = document.querySelector("#w-city");
    const showIconElem = document.querySelector("#w-icon");
    const showDespElem = document.querySelector("#w-feel");
    const showTempElem = document.querySelector("#w-temp");
    const showPressureElem = document.querySelector("#w-pressure");
    const showHumidityElem = document.querySelector("#w-humidity");
    const showErrMessageElem = document.querySelector("#messageWrapper");

    return {
      countryElem,
      cityElem,
      form,
      showCityElem,
      showIconElem,
      showDespElem,
      showTempElem,
      showPressureElem,
      showHumidityElem,
      showErrMessageElem,
    };
  },
  showErrMessage(msg) {
    if (msg !== null) {
      const { showErrMessageElem } = this.allSeletor();
    //   setTimeout(() => {
    //     showErrMessageElem.remove();
    //   }, 3000);
      return (showErrMessageElem.innerHTML = `<p style="background-color: red;padding: 4px 8px;border-radius: 5px;">${
        msg ? msg : "Nothing Found Exception"
      }</p>`);
    }
  },
  removeErrMessage() {
    const { showErrMessageElem } = this.allSeletor();
    showErrMessageElem.innerHTML = ''
  },
  valueValidation(country, city) {
    if (country === "" || city === "") {
      this.showErrMessage("please provide necessary information");
      return true;
    } else {
        UIinit.removeErrMessage();
      return false;
    }
  },
  gettingValue() {
    let { countryElem, cityElem } = this.allSeletor();
    let countryValue = countryElem.value;
    let cityValue = cityElem.value;
    const isValid = this.valueValidation(countryValue, cityValue);
    // debugger
    if (isValid) return;
    return {
      countryValue,
      cityValue,
    };
  },
  resetValue() {
    const { countryElem, cityElem } = this.allSeletor();
    countryElem.value = "";
    cityElem.value = "";
  },
  async handleRemoteData() {
    let data = await weatherData.collectWeatherData();
    if (data) {
      dataSetToStorage.saveItem();
      UIinit.removeErrMessage();
      return data;
    } else {
      UIinit.showErrMessage("Error Occured While Fetching API Data");
    }
  },
  getIcon(icon) {
    return `http://openweathermap.org/img/w/${icon}.png`;
  },
  showDataUI(data) {
    const {
      showCityElem,
      showHumidityElem,
      showTempElem,
      showPressureElem,
      showDespElem,
      showIconElem,
    } = this.allSeletor();
    const {
      name,
      main: { temp, pressure, humidity },
      weather,
    } = data;

    (showCityElem.textContent = name),
      (showPressureElem.textContent = `Pressure : ${pressure}`),
      (showHumidityElem.textContent = `Humidity ${humidity}`),
      (showTempElem.textContent = `Temperature : ${temp}`),
      (showDespElem.textContent = weather[0].description);
    showIconElem.setAttribute("src", this.getIcon(weather[0].icon));
  },
  savatoStorage(city, country) {
    (dataSetToStorage.city = city), (dataSetToStorage.country = country);
  },
  initializeValue() {
    const { form } = this.allSeletor();
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (this.gettingValue()) {
        const { countryValue, cityValue } = this.gettingValue();
        weatherData.country = countryValue;
        weatherData.city = cityValue;
        let data = await this.handleRemoteData();
        if (data) {
          this.showDataUI(data);
          this.savatoStorage(cityValue, countryValue);
          dataSetToStorage.saveItem();
          UIinit.removeErrMessage();
        } else {
          UIinit.showErrMessage("Error Occured While Fetching API Data");
        }
        UIinit.removeErrMessage();
      } else {
        this.showErrMessage("Please Fill Inputs Properly");
      }
    });
    window.addEventListener("DOMContentLoaded", async () => {
      let { country, city } = dataSetToStorage.getItem();
      if (!country && !city) {
        country = "Bangladesh";
        city = "Pabna";
      }
      weatherData.city = city;
      weatherData.country = country;
      const data = await this.handleRemoteData();
      if (data) {
        this.showDataUI(data);
        UIinit.removeErrMessage();
      } else {
        UIinit.showErrMessage("Error Occured While Fetching API Data");
      }
    });
  },
};

UIinit.initializeValue();
