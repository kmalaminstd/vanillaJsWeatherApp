
const weatherData = {
    city : '',
    country : '',
    API_KEY : '9ed09a011f74d13c1ade1b8ad4c9b8b7',
    async collectWeatherData (){
        // console.log(this.city);
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.country},${this.city}&units=metric&appid=${this.API_KEY}`);
        // const {name, main, weather} = await res.json();
        console.log(await res.json())
        console.log(name)
        return {
            name,
            main,
            weather
        }
        // console.log(data);
        }catch(err){
            UIinit.showErrMessage('Data not found')
        }
       
    }
    
}

// weatherData.collectWeatherData();

const dataSetToStorage = {
    city : '', 
    country : '',
    
    saveItem(){
        localStorage.setItem('Country', this.country),
        localStorage.setItem('City', this.city);
        
    },
    getItem(){
        const country = localStorage.getItem('Country');
        const city = localStorage.getItem('City');
        // console.log(country, city);
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
        debugger
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
        const data = await weatherData.collectWeatherData();
        // console.log(data);
        return data;
    },
    getIcon(icon){
        return `http://openweathermap.org/img/w/${icon}.png`
    },
    showDataUI(data){
        const {
            showCityElem,
            showHumidityElem,
            showTempElem,
            showPressureElem,
            showDespElem,
            showIconElem
        } = this.allSeletor();
        const {name, main:{temp, pressure, humidity}, weather } = data;
        // console.log(weather);

        showCityElem.textContent = `${name}`,
        
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
            this.valueValidation()
            this.resetValue();
            weatherData.city = cityValue,
            weatherData.country = countryValue;
            this.savatoStorage(cityValue, countryValue);
            console.log(cityValue, countryValue);
            const data = await this.handleRemoteData();
            this.showDataUI(data);
            dataSetToStorage.saveItem();
            // console.log(data);
        })
        window.addEventListener('DOMContentLoaded', async () => {
            let {country, city} = dataSetToStorage.getItem();
            console.log(country,city);
            if(!country || !city){
                country = 'Bangladesh'
                city = 'Pabna'
            }
            // debugger
                weatherData.city = city
                weatherData.country = country
                const data = await this.handleRemoteData();
                this.showDataUI(data)
            
        })
    },
    
}

UIinit.initializeValue();

