$(document).ready(function () {
    fetchSunriseSunset();
    updateTime();
    bgmove();
    fSunsetSunrise();
    bgGradient()
});

const cacheKey = 'sunsetSunriseCache';
const cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours in milliseconds


function fSunsetSunrise() {
    // Check if cached data is available
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    // If cached data is available and not expired, use it
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiry) {
        return Promise.resolve(cachedData.values);
    }

    // Fetch new sunset and sunrise values from the API
    return fetch('https://api.sunrise-sunset.org/json?lat=57.6529&lng=11.9106&formatted=0')
    .then(response => response.json())
    .then(data => {
        // Cache the new values
        const newData = {
            values: data,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(newData));

        console.log('Fetched and cached new sunset and sunrise values:', newData.values);

        return newData.values;
    })
    .catch(error => {
        console.error('Error fetching sunset and sunrise values:', error);
    });

}


function dayPercents() {
    // Fetch sunset and sunrise values from the cache
    const sunCache = JSON.parse(localStorage.getItem(cacheKey));

    if (!sunCache || !sunCache.values || !sunCache.values.results) {
        console.error('Error: Sunset and sunrise data not available in the cache.');
        return;
    }

    const sunData = sunCache.values.results;

    // Extract values and calculate percentages
    const sunArray = [
        sunData.civil_twilight_begin,
        sunData.sunrise,
        sunData.solar_noon,
        sunData.sunset,
        sunData.civil_twilight_end,
    ];

    // Define the total duration of the day in minutes (adjust as needed)
    const totalDayDurationMinutes = 24 * 60;

    // Calculate the percentages for each value
    const percentagesArray = sunArray.map(value => {
        const time = new Date(value);
        const minutesSinceMidnight = time.getHours() * 60 + time.getMinutes();
        return parseFloat((minutesSinceMidnight / totalDayDurationMinutes) * 100).toFixed(1);
    });

    return percentagesArray;
}




function bgGradient(){
	
	
const percentages = dayPercents();
const colours = ['#0E0430', '#f1aa7f', '#88e3ff', '#FFA8A9', '#0E0430']

	

function combineArrays(colors, percentages) {

    return colors.map((color, index) => ({
        color: color,
        percentage: percentages[index],
    }));
}


const combinedArray = combineArrays(colours, percentages);

function generateGradientString(combinedArray) {
    if (!combinedArray || !combinedArray.length) {
        console.error('Error: Empty or invalid combined array.');
        return null; // Return null or any appropriate value indicating an error
    }

    const gradientStops = combinedArray.map(item => `${item.color} ${item.percentage}%`);

    return `linear-gradient(to bottom, ${gradientStops.join(', ')})`;
}


const gradientString = generateGradientString(combinedArray);

            $('#background').css('background', gradientString);

console.log('Gradient String:', gradientString);






            //var gradientCSS = `linear-gradient(to bottom, ${tstartColor} ${tstartPercentage - 3}%,  ${sunriseColor} ${sunrisePercentage}%, ${noonColor} ${solarNoonPercentage}%, ${noonColor} ${solarNoonPercentage + 15}%,${sunsetColor} ${sunsetPercentage}%, ${tendColor} ${tendPercentage + 2}%)`;
            //$('#background').css('background', gradientCSS);
	
}




function fetchSunriseSunset() {
    var url = 'https://api.sunrise-sunset.org/json?lat=57.6529&lng=11.9106&formatted=0';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (response) {
            var sunrise = new Date(response.results.sunrise);
            var solarNoon = new Date(response.results.solar_noon);
            var sunset = new Date(response.results.sunset);
            var twilightStart = new Date(response.results.civil_twilight_begin);
            var twilightEnd = new Date(response.results.civil_twilight_end);

            var totalDuration = 86400; // Total duration of a day in seconds
            var startOfDay = new Date(sunrise.getFullYear(), sunrise.getMonth(), sunrise.getDate()).getTime();
            var sunrisePercentage = Math.round(((sunrise - startOfDay) / totalDuration)) / 10;
            var solarNoonPercentage = Math.round(((solarNoon - startOfDay) / totalDuration)) / 10;
            var sunsetPercentage = Math.round(((sunset - startOfDay) / totalDuration)) / 10;
            var tstartPercentage = Math.round(((twilightStart - startOfDay) / totalDuration)) / 10;
            var tendPercentage = Math.round(((twilightEnd - startOfDay) / totalDuration)) / 10;
           



   		   var tstartColor = '#0E0430';
            var sunriseColor = '#f1aa7f'; // Replace with your desired color for sunrise
            var noonColor = '#88e3ff'; // Replace with your desired color for solar noon
            var sunsetColor = '#FFA8A9'; // Replace with your desired color for sunset
            var tendColor = '#0E0430';
            var gradientCSS = `linear-gradient(to bottom, ${tstartColor} ${tstartPercentage - 3}%,  ${sunriseColor} ${sunrisePercentage}%, ${noonColor} ${solarNoonPercentage}%, ${noonColor} ${solarNoonPercentage + 15}%,${sunsetColor} ${sunsetPercentage}%, ${tendColor} ${tendPercentage + 2}%)`;
            //$('#background').css('background', gradientCSS);
			
			var gradienstCSS = `linear-gradient(to bottom, ${tstartColor} ${tstartPercentage - 3}%,  ${sunriseColor} ${sunrisePercentage}%, ${noonColor} ${solarNoonPercentage}%, ${noonColor} ${solarNoonPercentage + 15}%,${sunsetColor} ${sunsetPercentage}%, ${tendColor} ${tendPercentage + 2}%)`;

            //console.log(gradienstCSS);
        },
        error: function () {
            console.log('Error fetching sunrise/sunset data.');
        }
    });
    setTimeout(fetchSunriseSunset, 6 * 60 * 60 * 1000); // 6 hours in milliseconds
}

function updateTime() {

    var now = new Date();
    var hours = now.getHours();
    var hours12 = now.getHours() % 12 || 12;
    var minutes = now.getMinutes();
    //var seconds = now.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    var timeString = hours12.toString().padStart(1, '0') + ':' +
        minutes.toString().padStart(2, '0');
    //				   + ':' +
    //			   seconds.toString().padStart(2, '0');
    $('#clock').html(timeString);
    $('#ampm').html(ampm);

}

function bgmove() {
    var now = new Date();
    var totalMinutes = now.getHours() * 60 + now.getMinutes();
    var totalMinutesInDay = 24 * 60;
    var percentage = (totalMinutes / totalMinutesInDay);
    var background = $('#background');
    var backgroundHeight = background.height();
    var viewport = window.innerHeight;
    var targetPosition =  - (backgroundHeight * percentage) + viewport / 2;
    console.log(targetPosition)
    $('#perc').css('width', percentage * 100 + '%');
    background.css({
        'background-position-y': targetPosition + 'px',
        'transition': 'background-position-y 1s ease-in-out'
    });
}

setInterval(updateTime, 1000);
setInterval(bgmove, 1000);
