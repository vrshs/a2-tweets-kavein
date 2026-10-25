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

	//Part 1.1 Tweet Dates: Earliest and latest dates
	
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

	
	//Part 1.2 Tweet Categories
	var completedEventsCount = 0;
	var liveEventsCount= 0;
	var achievementsCount = 0;
	var miscellaneousCount = 0;

	//Loop thru the tweets, add to counter if tweet matches category.
	for(var i = 0; i < tweet_array.length; i++)
	{
		var category = tweet_array[i].source;
		if(category === "completed_event") {
			completedEventsCount++;
		} else if(category === "live_event") {
			liveEventsCount++;
		} else if(category === "achievement") {
			achievementsCount++;
		} else {
			miscellaneousCount++;
		}
	}

	//Update with tweet counts
	document.getElementsByClassName('completedEvents')[0].innerText = completedEventsCount;
	document.getElementsByClassName('liveEvents')[0].innerText = liveEventsCount;
	document.getElementsByClassName('achievements')[0].innerText = achievementsCount;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneousCount;

	//Turn into percents and update
	document.getElementsByClassName('completedEventsPct')[0].innerText = math.format(completedEventsCount / tweet_array.length * 100, 2) + '%';
	document.getElementsByClassName('liveEventsPct')[0].innerText = math.format(liveEventsCount / tweet_array.length * 100, 2) + '%';
	document.getElementsByClassName('achievementsPct')[0].innerText = math.format(achievementsCount / tweet_array.length * 100, 2) + '%';
	document.getElementsByClassName('miscellaneousPct')[0].innerText = math.format(miscellaneousCount / tweet_array.length * 100, 2) + '%';

	//Part 1.3 User Written Tweets
	var writtenTweetsCount = 0;

	//Loop and count if tweet is user generated
	for (var i = 0; i < tweet_array.length; i++) {
		var tweet = tweet_array[i];
		if(tweet.written == true && tweet.source == "completed_event") {
			writtenTweetsCount++;
		}
	}

	//Update stuff in html with the tweet counts
	document.getElementsByClassName('completedEvents')[1].innerText = completedEventsCount;
	document.getElementsByClassName('written')[0].innerText = writtenTweetsCount;
	document.getElementsByClassName('writtenPct')[0].innerText = math.format(writtenTweetsCount / completedEventsCount * 100, 2) + '%';


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});