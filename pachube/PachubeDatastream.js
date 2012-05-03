var PachubeDatastream = 
{
	pachube: "http://api.pachube.com/v2",
	apikey: "",
	feedid: -1,
	datastreamid: -1,
	
	getDatastream: function(format, onload, datastream, feed, key, onerror)
	{
		if(!datastream) datastream = this.datastreamid;
			else if(this.datastreamid == -1) this.datastreamid = datastream;
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey 
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString() + "/datastreams/" + datastream.toString();
		if(format == "xml" || format == "json" || format == "csv")
		{
			url += "." + format;
		}
		PachubeFunctions._get(onload, url, key, onerror);
	},
	updateDatastream: function(format, data, datastream, feed, key)
	{
		if(!datastream) datastream = this.datastreamid;
			else if(this.datastreamid == -1) this.datastreamid = datastream;
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		var url = this.pachube + "/feeds/" + feed.toString() + "/datastreams/" + datastream.toString();
		if(format == "xml" || format == "json" || format == "csv")
		{
			url += "." + format;
		}
		return PachubeFunctions._put(onload, url, data, key, onerror);
	},
	getDatastreamHistory: function(format, onload, datastream, feed, key, start, end, duration, page, per_page, time, find_previous, interval_type, interval, onerror)
	{
		if(!datastream) datastream = this.datastreamid;
			else if(this.datastreamid == -1) this.datastreamid = datastream;
		if(!feed) feed = this.feedid;
			else if(this.feedid == -1) this.feedid = feed;
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;

		var url = this.pachube + "/feeds/" + feed.toString() + "/datastreams/" + datastream.toString();
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
