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
	var swimCount = 0;
	var walkCount = 0;
	for (var i = 0; i < tweet_array.length; i++)
	{
		var activity = tweet_array[i].activityType;
		if(activity === 'run') {
			runCount++;
		} else if(activity === 'bike') {
			bikeCount++;
		} else if(activity === 'swim') {
			swimCount++;
		} else if(activity === 'walk') {
			walkCount++;
		}
	}

	//Note: searched up dictionary syntax on web
	var activityCounts = [
		{name: 'run', count: runCount},
		{name: 'bike', count: bikeCount},
		{name: 'swim', count: swimCount},
		{name: 'walk', count: walkCount}
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
	





	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});