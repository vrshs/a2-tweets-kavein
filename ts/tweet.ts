class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if(this.text.startsWith('Just completed') || this.text.startsWith('Just posted')) {
            return "completed_event";
        } else if(this.text.startsWith('Watch my')) {
            return "live_event";
        } else if(this.text.startsWith('Achieved a new personal record')) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if(this.text.includes('-')){
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        
        //Start from the dash ends when you the link(https://[random stuff here])
        var strippedText = "";
        var startIndex = this.text.indexOf('-') + 1;
        var endIndex = this.text.indexOf('https://');

        strippedText = this.text.substring(startIndex, endIndex);
        return strippedText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        if (this.text.includes('run'))
            return "run";
        if (this.text.includes('bike'))
            return "bike";
        if (this.text.includes('walk'))
            return "walk";
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        //Reference tweet: Just completed a 5.25 km run with @Runkeeper.
        //Reference tweet 2: Just completed a 12.06 mi run
        var startIndex = this.text.indexOf('a ') + 2;
        var kilometers = false;
        var endIndex = this.text.indexOf(' km');
        if (endIndex === -1) {
            endIndex = this.text.indexOf(' mi');
        } else {
            kilometers = true;
        }
        
        //1 mi = 1,609 km, converting to miles
        var distanceString = this.text.substring(startIndex, endIndex);
        var distance = parseFloat(distanceString);
        if(kilometers) {
            distance *= 1.609;
        }

        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var urlregex = /https:\/\/[^\s]+/;
        var linkedText = this.text.replace(urlregex, function(url) {
            return "<a href='" + url + "' target='_blank'>" + url + "</a>";
        });

        return "<tr>" +
            "<td>" + rowNumber + "</td>" +
            "<td>" + this.activityType + "</td>" +
            "<td>" + linkedText + "</td>" +
        "</tr>";
    }
}