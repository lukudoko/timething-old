      $(document).ready(function() {
        fetchSunriseSunset();
        updateTime();
		bgmove();
      });

      function fetchSunriseSunset() {
        var url = 'https://api.sunrise-sunset.org/json?lat=55.7047&lng=13.1910&formatted=0';
        $.ajax({
          url: url,
          method: 'GET',
          success: function(response) {
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
            $('#background').css('background', gradientCSS);
          },
          error: function() {
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
        var targetPosition = -(backgroundHeight * percentage) + viewport/2;
        console.log(targetPosition)
		$('#perc').css('width', percentage * 100 + '%');
        background.css({
          'background-position-y': targetPosition + 'px',
          'transition': 'background-position-y 1s ease-in-out'
        });
      }
	  
	  setInterval(updateTime, 1000);
	  setInterval(bgmove, 1000);

