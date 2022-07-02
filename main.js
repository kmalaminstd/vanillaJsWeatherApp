
const weatherData = {
    city : '',
    country : '',
    
    API_KEY : '9ed09a011f74d13c1ade1b8ad4c9b8b7',
    async collectWeatherData (){
        // console.log(this.city, this.country);
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`);
            // console.log(res);
            // console.log(await res.json());
        const {name, main, weather} = await res.json();

        return {
            name,
            main,
            weather
        }
        // console.log(data);
        }catch(err){
            UIinit.showErrMessage(err);
        }
       
    }
    
}

// weatherData.collectWeatherData();

let dataSetToStorage = {
    city : '', 
    country : '',
    
    saveItem(){
        // console.log(this.city, this.country);
        localStorage.setItem('Country', this.country),
        localStorage.setItem('City', this.city);
        
    },
    getItem(){
        let country = localStorage.getItem('Country');
        let city = localStorage.getItem('City');
        // console.log(country, city);
        // debugger
        return {country, city};
    }
}



const UIinit = {
    allSeletor() {
        let countryElem = document.querySelector('#country');
        let cityElem = document.querySelector('#city');
        const form = document.querySelector('form');
        const showCityElem = document.querySelector('#w-city');
        const showIconElem = document.querySelector('#w-icon');
        const showDespElem = document.querySelector('#w-feel');
        const showTempElem = document.querySelector('#w-temp');
        const showPressureElem = document.querySelector('#w-pressure');
        const showHumidityElem = document.querySelector('#w-humidity');
        const showErrMessageElem = document.querySelector('#messageWrapper');

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
            showErrMessageElem
        }
    },
    showErrMessage(msg){
        const {showErrMessageElem} = this.allSeletor();
        setTimeout(()=> {
            showErrMessageElem.remove();
        }, 3000);

        return showErrMessageElem.innerHTML = `<p style="background-color: red;padding: 4px 8px;border-radius: 5px;">${msg}</p>`
    },
    valueValidation(country, city){
        if(country === '' || city === ''){
            this.showErrMessage('please provide necessary information');
            return true;
        }else{
            return false;
        }
    },
    gettingValue(){
        let {countryElem, cityElem} = this.allSeletor();
        let countryValue = countryElem.value;
        let cityValue = cityElem.value;
        const isValid = this.valueValidation(countryValue, cityValue);
        // debugger
        // console.log(countryValue, cityValue);
        if(isValid) return
        return {
            countryValue,
            cityValue
        }
    },
    resetValue(){
        const {countryElem, cityElem} = this.allSeletor();
        countryElem.value = '';
        cityElem.value = '';
    },
    async handleRemoteData(){
        let data = await weatherData.collectWeatherData();

        // console.log(data);
        return data;
    },
    getIcon(icon){
        return `http://openweathermap.org/img/w/${icon}.png`
    },
    showDataUI(data){
        // console.log(data)
        const {
            showCityElem,
            showHumidityElem,
            showTempElem,
            showPressureElem,
            showDespElem,
            showIconElem
        } = this.allSeletor();
        const {name,
             main:{temp, pressure, humidity},
              weather } = data;


        showCityElem.textContent = name,
        
        showPressureElem.textContent = `Pressure : ${pressure}`,
        showHumidityElem.textContent = `Humidity ${humidity}`,
        showTempElem.textContent = `Temperature : ${temp}`,
        showDespElem.textContent = weather[0].description;
        showIconElem.setAttribute('src',this.getIcon(weather[0].icon)) ;
    },
    savatoStorage(city,country){

        dataSetToStorage.city = city,
        dataSetToStorage.country = country
    },
    initializeValue(){
        const {form} = this.allSeletor();
        form.addEventListener('submit', async e=>{
            e.preventDefault();
            const {countryValue, cityValue} = this.gettingValue();

            weatherData.country = countryValue;
            weatherData.city = cityValue;
            await weatherData.collectWeatherData();
            this.valueValidation()
            this.resetValue();
            let data = await this.handleRemoteData();
            this.showDataUI(data);
            this.savatoStorage(cityValue, countryValue);
            dataSetToStorage.saveItem();
            
        })
        window.addEventListener('DOMContentLoaded', async () => {
            
            let {country, city} = dataSetToStorage.getItem();
            if(!country && !city){
                country = 'Bangladesh';
                city = 'Pabna'
            }
            weatherData.city = city;
            weatherData.country = country;
            const data = await this.handleRemoteData();

            this.showDataUI(data);
            
        })
    },
    
}

UIinit.initializeValue();

