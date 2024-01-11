// Example function to fetch weather data

const cacheTemp = 'currentTempCache';
const cacheTempExpiry = 30 * 60 * 1000; // 30 mins in milliseconds
const appShelf = document.getElementById('appShelf');


function fetchTemperature() {
    // Check if cached data is available
    const cachedData = JSON.parse(localStorage.getItem(cacheTemp));

    // If cached data is available and not expired, use it
    if (cachedData && Date.now() - cachedData.timestamp < cacheTempExpiry) {
		console.log("using cache");
        return Promise.resolve(cachedData.values);
    }

    // Fetch new Temp
    return fetch('https://api.openweathermap.org/data/2.5/weather?lat=57.65&lon=11.916&appid=7be8a9d34955926d889f6ce6d3ea87fb&units=metric')
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


// Function to create a weather widget
function WeatherWidget(temp, url) {
    // Create a weather widget using the fetched data
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.id = "weather";
    widget.innerHTML = `
	    <div class="weatherwidgetInner">
        <img src="https://openweathermap.org/img/wn/${url}@2x.png"> 
        ${Math.trunc(temp)}°C
		</div>`;

    return widget;
}


function newWidget() {
    // Create a weather widget using the fetched data
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.innerHTML = `
	    <div class="widgetInner">
        <img src="https://cdn.vox-cdn.com/thumbor/WR9hE8wvdM4hfHysXitls9_bCZI=/0x0:1192x795/1400x1400/filters:focal(596x398:597x399)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg"> 
		</div>`;

    return widget;
}



function fadeIn(wid) {
    const oldestWidget = appShelf.firstElementChild;

    if (appShelf.childElementCount >= 4) {

        appShelf.appendChild(wid);

        const widgets = document.querySelectorAll('.widget');

        gsap.set(widgets, {
            x: '0%',
        });

        gsap.to(widgets, {
            x: '-100%',
            duration: 0.5,
            ease: 'power2.inOut',
            stagger: 0.1, // Optional: Adds a stagger effect for a smoother appearance
            onComplete: () => {
                appShelf.removeChild(oldestWidget);
                gsap.set(widgets, {
                    x: '0%',
                });
            }
        });

        gsap.to(widgets, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.inOut',
            stagger: 0.1, // Optional: Adds a stagger effect for a smoother appearance
        });

    } else {

        appShelf.appendChild(wid);

        const widgets = document.querySelectorAll('.widget');
        const shelfWidth = appShelf.offsetWidth;

        const newWidth = 100 / widgets.length + '%';

        gsap.fromTo(wid, {
            x: '100%'
        }, {
            x: '0%',
            duration: 0.7,
            ease: 'power2.inOut',
        });

        gsap.set(widgets, {
            width: newWidth,
            duration: 0.3,
            ease: 'power2.inOut', // Use power2.out for a smooth exit
        });

        gsap.to(wid, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.inOut',
        });

    }
}



function fadeOut(wid, newWid) {

    const widgets = document.querySelectorAll('.widget');
    const oldestWidget = appShelf.firstElementChild;

    if (wid == oldestWidget) {

        gsap.set(widgets, {
            x: '0%',
        });
        gsap.to(wid, {
            opacity: 0,
            duration: 0.9
        });
        gsap.to(widgets, {
            x: '-100%',
            duration: 0.5,
            ease: 'power2.inOut',
            stagger: 0.1, // Optional: Adds a stagger effect for a smoother appearance
            onComplete: () => {
                appShelf.removeChild(wid);
                appendWidgetToAppShelf(newWid);
                gsap.set(widgets, {
                    x: '0%',
                });
            }
        });

    } else {

        const widArray = Array.from(widgets);
        const widgetToFind = document.getElementById(wid.id);
        const index = widArray.indexOf(widgetToFind);

        gsap.to(wid, {
            opacity: 0,
            duration: .7,
            ease: 'power2.inOut',
            onComplete: () => {

                // Target only the widgets to the right of the removed one
                const widgetsToMove = Array.from(widgets).slice(index + 1);

                // Update the positions of the widgets to the right of the removed one
                gsap.to(widgetsToMove, {
                    x: '-100%',
                    duration: 0.5,
                    ease: 'power2.inOut',
                    stagger: 0.1, // Adjust the stagger value as needed for a smoother transition
                    onComplete: () => {
                        // Append the new widget to the end of the list
                        appShelf.removeChild(wid);
                        appendWidgetToAppShelf(newWid);
                        gsap.set(widgets, {
                            x: '0%',
                        });

                    },
                });

            },
        });







    }

}
	 
	 
	 

function updateWeather(temp, url) {
    const existingWeatherWidget = document.getElementById('weather');

    // Fade out the existing weather widget
    if (existingWeatherWidget) {

        const updated = WeatherWidget(temp, url);
        fadeOut(existingWeatherWidget, updated);

    } else {
        // If there's no existing weather widget, simply append the new one
        appendWidgetToAppShelf(WeatherWidget(temp, url));
    }
}






        function appendWidgetToAppShelf(widget) {
            fadeIn(widget);
		
        }




    // Fetch temperature data from the cache or API
 const tempCache = JSON.parse(localStorage.getItem(cacheTemp));
    
 if (!tempCache || !tempCache.values || !tempCache.values.main) {
     console.error('Error: No weather data in cache');
  //  return null;
   }

    const tempData = tempCache.values;


const weatherWidget = WeatherWidget(tempData.main.temp, tempData.weather[0].icon);
const weatherWidget2 = WeatherWidget("32", "13d");
const nu = newWidget();

// Append the widget to the app shelf
//appendWidgetToAppShelf(weatherWidget);
appendWidgetToAppShelf(weatherWidget2);
  appendWidgetToAppShelf(newWidget());

// Periodically update the weather data and widget content
setInterval(function () {
    

    fetchTemperature();
	updateWeather(tempData.main.temp, tempData.weather[0].icon);
	
}, 15 * 600); // Update every 15 mins





document.getElementById('updateButton').addEventListener('click', function () {
    // Simulate fetching new data
	
	  appendWidgetToAppShelf(newWidget());
//updateWeather(tempData.main.temp, tempData.weather[0].icon);
 //appendWidgetToAppShelf((WeatherWidget(tempData.main.temp, tempData.weather[0].icon)));

//appendWidgetToAppShelf(WeatherWidget("77", "09n"));

});
