$(document).ready(function () {
    fetchSunriseSunset()
    .then(function () {
        bgGradient();
        updateTime();
fetchTemperature();
        var initialBGposition = localStorage.getItem('latestBGPosition');

        if (initialBGposition !== null) {
            $('#background').css('background-position-y', initialBGposition + 'px');
        }

        bgmove();
    })
    .catch(function (error) {
        console.error('Error fetching sunrise/sunset data:', error);
    });
});

const cacheKey = 'sunsetSunriseCache';
const cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours in milliseconds


function fetchSunriseSunset() {
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
        return parseFloat(((minutesSinceMidnight / totalDayDurationMinutes) * 100).toFixed(1));
    });

    return percentagesArray;
}

function bgGradient() {

    const percentages = dayPercents();
    percentages[0] = parseFloat((percentages[0] - 3).toFixed(1));
    percentages[4] += 3;

    percentages.push(percentages[2] + 5);
    percentages.sort(function (a, b) {
        return a - b
    });

    const colours = ['#0E0430', '#f1aa7f', '#88e3ff', '#88e3ff', '#FFA8A9', '#0E0430']

    function combineArrays(colors, percentages) {

        return colors.map((color, index) => ({
                color: color,
                percentage: percentages[index],
            }));
    }

    const combinedArray = combineArrays(colours, percentages);

    function generateGradientString(combinedArray) {
        const gradientStops = combinedArray.map(item => `${item.color} ${item.percentage}%`);

        return `linear-gradient(to bottom, ${gradientStops.join(', ')})`;
    }

    const gradientString = generateGradientString(combinedArray);

    $('#background').css('background', gradientString);
}

function updateTime() {
    var now = new Date();
    var hours = now.getHours() % 12 || 12;
	var hours24 = now.getHours();
	console.log(hours);
    var minutes = now.getMinutes();
    var ampm = hours24 >= 12 ? 'pm' : 'am';

    // Use template literals for cleaner string concatenation
    var timeString = `${hours.toString().padStart(1, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Combine updating elements in one place
    $('#clock').html(timeString);
    $('#ampm').html(ampm);
}

function bgmove() {
    var now = new Date();
    var totalMinutes = now.getHours() * 60 + now.getMinutes();
    var totalMinutesInDay = 24 * 60;
    var percentage = (totalMinutes / totalMinutesInDay);

    // Cache DOM elements
    var background = $('#background');
    var percElement = $('#perc');

    // Cache values for better performance
    var backgroundHeight = background.height();
    var viewport = window.innerHeight;
    var targetPosition =  - ((backgroundHeight * percentage) - viewport / 2)

        // Update the width of the percentage element
        percElement.css('width', percentage * 100 + '%');

    // Store the latest targetPosition in localStorage
    localStorage.setItem('latestBGPosition', targetPosition);

    // Apply the background position with a smooth transition
    background.css({
        'background-position-y': targetPosition + 'px',
    });

    // Check if percentage is close to 1 or close to 0
    var isCloseToOne = percentage >= 0.9986;
    var isCloseToZero = percentage <= 0.0014;

    if (isCloseToOne || isCloseToZero) {
        background.css('transition', 'none');
    } else {
        background.css('transition', 'background-position-y 1s ease-in-out');
    }
}

setInterval(updateTime, 1000);
setInterval(bgmove, 1000);