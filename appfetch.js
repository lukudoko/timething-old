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
        <img src="https://openweathermap.org/img/wn/${url}@2x.png"> 
        ${Math.trunc(temp)}°C`;

    return widget;
}






function fadeIn(wid) {
    const appShelf = document.getElementById('appShelf');
    const oldestWidget = appShelf.firstElementChild;

    if (appShelf.childElementCount >= 4) {

        appShelf.appendChild(wid);

        const widgets = document.querySelectorAll('.widget');

        gsap.set(widgets, {
            x: '0%',
            opacity: 0
        });

        gsap.to(widgets, {
            x: '-100%',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
            stagger: 0.1, // Optional: Adds a stagger effect for a smoother appearance
            onComplete: () => {
                appShelf.removeChild(oldestWidget);
                gsap.set(widgets, {
                    x: '0%'
                });
            }
        });
    } else {



		        // Animate the width and position of existing widgets
        appShelf.appendChild(wid);
		
		const widgets = document.querySelectorAll('.widget');

        gsap.to(widgets, {
            width: (index, target) => {
                // Calculate the minimum width (25%)
                const minWidth = '95%';
                // Return the maximum between minWidth and the current width
                return `calc(100% / ${appShelf.childElementCount})`;
            }
        });
		
		
		
		gsap.fromTo(wid, { x: '100%' }, { x: '0%', duration: .7, ease: 'power2.inOut'});
        gsap.to(wid, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.inOut',
			
        });
		

		
		
		
		

    }
}
	 
	 
	 function fadeIsn(wid) {


        appShelf.appendChild(wid);
        gsap.set(wid, {
            x: '100%'
        });

        gsap.to(wid, {
            x: '0%',
            duration: 0.7,
            ease: 'power2.inOut'
        });
        gsap.to(wid, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.inOut'
        });

        // Animate the width and position of existing widgets
        gsap.to('.widget', {
            width: (index, target) => {
                // Calculate the minimum width (25%)
                const minWidth = '95%';
                // Return the maximum between minWidth and the current width
                return `calc(100% / ${appShelf.childElementCount})`;
            },
			
			
			
            x: (index, target) => {
                // Calculate the position based on the number of widgets
                return `calc(${index} * (100% / ${appShelf.childElementCount}))`;
            },
            duration: 0.5, // Adjust the duration as needed
            ease: 'power2.out', // Optional easing function
        });
    
}



function fadeOut(wid){
	
gsap.to(wid, { opacity: 0, duration: 0.3});
gsap.to(wid, {x: '-100%', duration: 0.5, ease: 'power2.inOut', onComplete: () => appShelf.removeChild(wid)});

}


function updateWeather(temp, url){
            const appShelf = document.getElementById('appShelf');
            const existingWeatherWidget = document.getElementById('weather');

            // Fade out the existing weather widget
            if (existingWeatherWidget) {
fadeOutAndMoveLeft(existingWeatherWidget);
				

                

               appendWidgetToAppShelf(WeatherWidget(temp, url));
					
            } else {
                // If there's no existing weather widget, simply append the new one
                appShelf.appendChild(newWidget);
                fadeIn(newWidget);
            }
        }






        function appendWidgetToAppShelf(widget) {
            const appShelf = document.getElementById('appShelf');
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


// Append the widget to the app shelf
appendWidgetToAppShelf(weatherWidget);
appendWidgetToAppShelf(weatherWidget2);

// Periodically update the weather data and widget content
setInterval(function () {
    const newWeatherData = fetchWeatherData();

    fetchTemperature();
appendWidgetToAppShelf(WeatherWidget("77", "09n"));
	
}, 15 * 60000); // Update every minute (adjust as needed)





document.getElementById('updateButton').addEventListener('click', function () {
    // Simulate fetching new data
	
	
   //appendWidgetToAppShelf((WeatherWidget(tempData.main.temp, tempData.weather[0].icon)));
appendWidgetToAppShelf(WeatherWidget("77", "09n"));

});

        function fadeOutAndMoveLeft(element) {
            gsap.to(element, {
                opacity: 0,
                x: -50, // Adjust the distance to move left
                duration: 0.5,
                onComplete: function () {
                    element.remove();
                    gsap.fromTo('.widget', { x: 50 }, { x: 0, duration: 0.5, stagger: 0.1 });
                },
            });
        }