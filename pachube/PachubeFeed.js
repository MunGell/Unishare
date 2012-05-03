var PachubeFeed = 
{
	pachube: "http://api.pachube.com/v2",
	apikey: "",
	feedid: -1,
	
	getFeed: function(format, onload, datastreams, feed, key, onerror)
	{
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey 
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString();
		if(format == "xml" || format == "json" || format == "csv")
		{
			url += "." + format;
		}
		if(datastreams)
		{
			url += "?datastreams=" + datastreams.join(',');
		}
		PachubeFunctions._get(onload, url, key, onerror);
	},
	updateFeed: function(format, onload, data, feed, key, onerror)
	{
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString() + "." + format;
		PachubeFunctions._put(onload, url, data, key, onerror);
	},
	deleteFeed: function(onload, feed, key, onerror)
	{
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString();
		PachubeFunctions._delete(onload, url, key, onerror);
	},
	getDatastreamList: function(onload, feed, key, onerror)
	{
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString() + ".json";
		PachubeFunctions._get(onload, url, key, onerror);
	},
	getFeedHistory: function(format, onload, feed, key, start, end, duration, page, per_page, time, find_previous, interval_type, interval, onerror)
	{
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;

		var url = this.pachube + "/feeds/" + feed.toString();
		if(format == "xml" || format == "json" || format == "csv")
		{
			url += "." + format;
		}
		url += "?";
		
		if(!start) url += "start=" + start + "&";
		if(!end) url += "end=" + end + "&";
		if(!duration) url += "duration=" + duration + "&";
		if(!page) url += "page=" + page + "&";
		if(!per_page) url += "per_page=" + per_page + "&";
		if(!time) url += "time=" + time + "&";
		if(!find_previous) url += "find_previous=" + find_previous + "&";
		if(!interval_type) url += "interval_type=" + interval_type + "&";
		if(!interval) url += "interval=" + interval;
		PachubeFunctions._get(onload, url, key, onerror);
	}
}
