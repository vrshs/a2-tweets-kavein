function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Part 2.1 Determining activity type and distances
	//updating text here
	document.getElementById('numberActivities').innerText = '3';

	var runCount = 0;
	var bikeCount = 0;
	var walkCount = 0;
	for (var i = 0; i < tweet_array.length; i++)
	{
		var activity = tweet_array[i].activityType;
		if(activity == 'run') {
			runCount++;
		} else if(activity == 'bike') {
			bikeCount++;
		} else if(activity == 'walk') {
			walkCount++;
		}
	}

	//average distance for the next part
	var activityCounts = [
		{name: 'run', count: runCount, avgDistance: 0},
		{name: 'bike', count: bikeCount, avgDistance: 0},
		{name: 'walk', count: walkCount, avgDistance: 0}
	];
	activityCounts.sort(function(a, b) {
		return b.count - a.count;
	});
	var firstMostFrequentActivity = activityCounts[0];
	var secondMostFrequentActivity = activityCounts[1];
	var thirdMostFrequentActivity = activityCounts[2];

	document.getElementById('firstMost').innerText = firstMostFrequentActivity.name;
	document.getElementById('secondMost').innerText = secondMostFrequentActivity.name;
	document.getElementById('thirdMost').innerText = thirdMostFrequentActivity.name;

	//Part 2.1.2 not a real section in the assignment but this is determining longest and shortest activities
	//add up all the distance for each activity type, then divide by the count of that activity type to get the average distance
	for (var i = 0; i < tweet_array.length; i++) {
		var activity = tweet_array[i].activityType;
		var distance = tweet_array[i].distance;
		for (var j = 0; j < activityCounts.length; j++) {
			if(!isNaN(distance) && activityCounts[j].name == activity) {
				activityCounts[j].avgDistance += distance;
			}
		}
	}
	for (var j = 0; j < activityCounts.length; j++) {
		if(activityCounts[j].count > 0) {
			activityCounts[j].avgDistance /= activityCounts[j].count;
		}
	}

	//find the longest and shortest activities
	longestActivity = activityCounts[0];
	shortestActivity = activityCounts[0];
	for (var i = 0; i < activityCounts.length; i++) {
		if(activityCounts[i].avgDistance > longestActivity.avgDistance) {
			longestActivity = activityCounts[i];
		}
		if(activityCounts[i].avgDistance < shortestActivity.avgDistance) {
			shortestActivity = activityCounts[i];
		}
	}

	document.getElementById('longestActivityType').innerText = longestActivity.name;
	document.getElementById('shortestActivityType').innerText = shortestActivity.name;

	//Part 2.1.3 another not official section, determining whether weekends or weekdays had longer activities across all activities
	var weekendAvgDistance = 0;
	var weekdayAvgDistance = 0;
	var totalActivities = 0;

	for (var i = 0; i < tweet_array.length; i++) {
		var distance = tweet_array[i].distance;
		var day = tweet_array[i].time.getDay();
		if(!isNaN(distance)) {
			totalActivities++;
			if(day === 0 || day === 6) {
				weekendAvgDistance += distance;
			} else {
				weekdayAvgDistance += distance;
			}
		}
	}

	weekendAvgDistance /= totalActivities;
	weekdayAvgDistance /= totalActivities;

	var longerActivities = weekendAvgDistance > weekdayAvgDistance ? 'weekends' : 'weekdays';
	document.getElementById('weekdayOrWeekendLonger').innerText = longerActivities;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.


	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
	    "x": {
	      "field": "name",
	      "type": "nominal",
	      "order": "descending"
	    },
	    "y": {
	      "field": "count",
	      "aggregate": "sum",
	      "type": "quantitative"
	    }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.

	//Lists for graphs
	var topThreeActivities = ["run", "bike", "walk"];
	var filteredTweets = [];

	for (var i = 0; i < tweet_array.length; i++) 
	{
		var tweet = tweet_array[i];
		if(topThreeActivities.includes(tweet.activityType) && !isNaN(tweet.distance)) {
			filteredTweets.push({
				activityType: tweet.activityType,
				distance: tweet.distance,
				day: tweet.time.toLocaleDateString('en-US', { weekday: 'long' })
			});
		}
	}

	var currentGraph;



	//Alternate graphs with button presses, graph will be put into showgraph variable
	var showGraph = false;

	function updateShownGraph() {
		if(showGraph == true){
		currentGraph = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of distances by day of the week for the three most tweeted about activities.",
	  "data": {
	    "values": filteredTweets
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {
	      "field": "day",
	      "type": "nominal",
		  "unit": "day"
	    },
	    "y": {
	      "field": "distance",
	      "type": "quantitative"
	    },
	    "color": {
	      "field": "activityType",
	      "type": "nominal"
	    }
	  }
	};
		  //Button text change here
	  document.getElementById('aggregate').innerText = "Show means";
} else {
		currentGraph = {
	  	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of distances by day of the week for the three most tweeted about activities but agregated.",
	  	"data": {
	    "values": filteredTweets
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {
	      "field": "day",
	      "type": "nominal",
		  "unit": "day"
	    },
	    "y": {
	      "field": "distance",
	      "aggregate": "mean",
	      "type": "quantitative"
	    },
	    "color": {
	      "field": "activityType",
	      "type": "nominal"
	    }
	  }
	};
	document.getElementById('aggregate').innerText = "Show all activities";
	}

	//render graph here
	vegaEmbed('#distanceVisAggregated', currentGraph, {actions:false});
	}

	//button text
	document.getElementById('aggregate').addEventListener('click', function() {
		showGraph = !showGraph;
		updateShownGraph();
	});
	updateShownGraph(); // Initial display of the graph
		
	
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});