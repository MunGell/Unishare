var PachubeUser =
{
	pachube: "http://api.pachube.com/v2",
	apikey: "",
	userid: -1,
	
	getUser: function(format, onload, user, key, onerror)
	{
		if(!key) key = this.apikey 
			else if(this.apikey == "") this.apikey = key;
		if(!user) user = this.userid 
			else if(this.userid == "") this.userid = user;
		var url = this.pachube + "/users/" + user;
		if(format == "xml" || format == "json" || format == "csv")
		{
			url += "." + format;
		}
		PachubeFunctions._get(onload, url, key, onerror);
	}
}
