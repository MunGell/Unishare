var PachubeFunctions = 
{
	apikey: "",
	_get: function(onload, url, key, onerror)
	{
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		if(url.indexOf('?') > 0)
		{
			url += "&key=" + key;
		}
		else
		{
			url += "?key=" + key;
		}
		var loader = Titanium.Network.createHTTPClient();
		loader.onload = onload;
		if(onerror) loader.onerror = onerror;
		loader.open("GET", url);
		loader.send();
	},
	_post: function(onload, url, data, key, onerror)
	{
		if(!data) data = {};
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		if(url.indexOf('?') > 0)
		{
			url += "&key=" + key;
		}
		else
		{
			url += "?key=" + key;
		}
		var loader = Titanium.Network.createHTTPClient();
		loader.onload = onload;
		if(onerror) loader.onerror = onerror;
		loader.open("POST", url);
		loader.send(data);
	},
	_put: function(onload, url, data, key, onerror)
	{
		if(url.indexOf('?') > 0)
		{
			url += "&_method=put&key=" + key;
		}
		else
		{
			url += "?_method=put&key=" + key;
		}
		if(!data) data = {};
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		var loader = Titanium.Network.createHTTPClient();
		loader.onload = onload;
		if(onerror) loader.onerror = onerror;
		loader.open("POST", url);
		loader.send(data);
	},
	_delete: function(onload, url, key, onerror)
	{
		if(!key) key = this.apikey
			else if(this.apikey == "") this.apikey = key;
		if(url.indexOf('?') > 0)
		{
			url += "&_method=put&key=" + key;
		}
		else
		{
			url += "?_method=put&key=" + key;
		}
		var loader = Titanium.Network.createHTTPClient();
		loader.onload = onload;
		if(onerror) loader.onerror = onerror;
		loader.open("POST", url);
		loader.setRequestHeader("X-PachubeApiKey", key);
		loader.send();
	}
}
