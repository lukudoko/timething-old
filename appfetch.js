// Example function to fetch weather data

const cacheTemp = 'currentTempCache';
const cacheTempExpiry = 30 * 60 * 1000; // 30 mins in milliseconds


function fetchTemperature() {
    // Check if cached data is available
    const cachedData = JSON.parse(localStorage.getItem(cacheTemp));

    // If cached data is available and not expired, use it
    if (cachedData && Date.now() - cachedData.timestamp < cacheTempExpiry) {
		console.log("using cache");
        return Promise.resolve(cachedData.values);
    }

    // Fetch new Temp
    return fetch('https://api.openweathermap.org/data/2.5/weather?lat=57.65&lon=11.916&appid=&units=metric')
    .then(response => response.json())
    .then(data => {
        // Cache the new values
        const newData = {
            values: data,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheTemp, JSON.stringify(newData));
		
		
		

        console.log('Fetched and cached current temp data:', newData.values);

        return newData.values;
    })
    .catch(error => {
        console.error('Error fetching temp???:', error);
    });

}

fetchTemperature()









function fetchWeatherData() {

    // Fetch sunset and sunrise values from the cache
    const tempCache = JSON.parse(localStorage.getItem(cacheTemp));

    if (!tempCache || !tempCache.values || !tempCache.values.main) {
        console.error('Error: No weather data in cache');

        return;
    }

    const tempData = tempCache.values;

    return {
        temperature: Math.trunc(tempData.main.temp) + '°C',
        icon: tempData.weather[0].icon,
    };
}







// Function to create a weather widget
function createWeatherWidget(data) {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.id = "weather";
    widget.innerHTML = `
		 <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png"> 
		 ${data.temperature}
    `;
    return widget;
}





function WidgetUpdateAnimation(widget, newData) {
    // Trigger fade-out animation by reducing opacity
    weatherWidget.style.opacity = 0;

    // Function to handle the completion of fade-out animation
    const handleFadeOutComplete = () => {
        // Remove the event listener to avoid multiple calls
        weatherWidget.removeEventListener('transitionend', handleFadeOutComplete);

        // Update the widget content
        updateWeatherWidget(widget, newData);

        // Trigger fade-in animation by increasing opacity
        weatherWidget.style.opacity = 1;
    };

    // Add an event listener for the transitionend event
    weatherWidget.addEventListener('transitionend', handleFadeOutComplete);
}


// Function to update the weather widget
function updateWeatherWidget(widget, newData) {
    // Update the content of the widget based on new data
	    if (!newData) {
        // If no newData provided, generate dummy data
        newData = {
            temperature: '25°C',
            icon: '10d',
        };
    }
	
	widget = document.getElementById('weather');
    widget.innerHTML = `
		 <img src="https://openweathermap.org/img/wn/${newData.icon}@2x.png"> 
		 ${newData.temperature}
    `;
}








// Example usage
const appShelf = document.getElementById('appShelf');

// Fetch initial weather data and create a widget
const initialWeatherData = fetchWeatherData();
const weatherWidget = createWeatherWidget(initialWeatherData);
const weatherWidget2 = createWeatherWidget(initialWeatherData);
const weatherWidget3 = createWeatherWidget(initialWeatherData);

// Append the widget to the app shelf
appShelf.appendChild(weatherWidget);
appShelf.appendChild(weatherWidget2);
appShelf.appendChild(weatherWidget3);

// Periodically update the weather data and widget content
setInterval(function () {
    const newWeatherData = fetchWeatherData();

    fetchTemperature();
    updateWeatherWidget(weatherWidget, newWeatherData);
}, 15 * 60000); // Update every minute (adjust as needed)




document.getElementById('updateButton').addEventListener('click', function () {
    // Simulate fetching new data
    const newData = updateWeatherWidget();

    // Trigger the update animation
    WidgetUpdateAnimation(newData);
});
