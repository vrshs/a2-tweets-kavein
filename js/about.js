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
	
	//Shoved min and max loop into one loop
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
	
	//Formatting and then replacing the text
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = earliestDate.toLocaleString('en-US', options);
	document.getElementById('lastDate').innerText = latestDate.toLocaleString('en-US', options);

	
	//Tweet Categories
	var completedEventsCount = 0;
	var liveEventsCount= 0;
	var achievementsCount = 0;
	var miscellaneousCount = 0;

	//Loop thru the tweets, add to counter if tweet matches category.
	for(var i = 0; i < tweet_array.length; i++) {
		//Completed events
		if(tweet_array[i].text.startsWith('Just completed') || tweet_array[i].text.startsWith('Just posted')){
			completedEventsCount++;
		
		//Live events
		} else if(tweet_array[i].text.startsWith('Watch my')){
			liveEventsCount++;

		//Achievements
		} else if(tweet_array[i].text.startsWith('Achieved a new personal record')){
			achievementsCount++;

		//Everything else
		} else {
			miscellaneousCount++;
		}
	}

	//Update with tweet counts
	document.getElementsByClassName('completedEvents').innerText = completedEventsCount;
	document.getElementsByClassName('liveEvents').innerText = liveEventsCount;
	document.getElementsByClassName('achievements').innerText = achievementsCount;
	document.getElementsByClassName('miscellaneous').innerText = miscellaneousCount;

	//Turn into percents and update again
	//document.getElementsByClassName('completedEvents')



	//User Written Tweets
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});