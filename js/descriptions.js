//Global variable so this can be in scope for search
var userTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets

	//Sets these to nothing for when the page loads
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = '';
	//written tweets only here
	for (var i = 0; i < runkeeper_tweets.length; i++) {
		var tweet = new Tweet(runkeeper_tweets[i].text);
		if(tweet.written == true) {
			userTweets.push(tweet);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function(inputEvent) {
		var searchInput = inputEvent.target.value.toLowerCase();

			//Clears table when input is empry
			if(searchInput == '') {
				document.getElementById('searchCount').innerText = 0;
				document.getElementById('searchText').innerText = '';
			}

			var matchingTweets = [];

			//Search for matches
			for (var i = 0; i < userTweets.length; i++) {
				var tweet = userTweets[i];
				if(tweet.text.toLowerCase().includes(searchInput)) {
					matchingTweets.push(tweet);
				}
			}

			//Update the results thingy
			document.getElementById('searchCount').innerText = matchingTweets.length;
			document.getElementById('searchText').innerText = searchInput;

			//Update the table
			var table = document.getElementById('tweetTable');
			table.innerHTML = '';
			for (var i = 0; i < matchingTweets.length; i++) {
				table.innerHTML += matchingTweets[i].getHTMLTableRow(i + 1);
			}
	});
};


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});