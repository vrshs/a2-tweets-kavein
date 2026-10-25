function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//Part 1
	//Tweet Dates: Earliest and latest dates
	var earliestDate = new Date(tweet_array[0].time);
	var latestDate = new Date(tweet_array[0].time);
	for(var i = 0; i < tweet_array.length; i++) {
		var tweetDate = new Date(tweet_array[i].time);
		if(tweetDate < earliestDate) {
			earliestDate = tweetDate;
		}
		if(tweetDate > latestDate) {
			latestDate = tweetDate;
		}
	}
	//Format: Day of week, Month, Day, Year
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	document.getElementById('firstDate').innerText = earliestDate.toLocaleString('en-US', options);
	document.getElementById('lastDate').innerText = latestDate.toLocaleString('en-US', options);

	
	//Tweet Categories

	//User Written Tweets
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});