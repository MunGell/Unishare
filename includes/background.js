Ti.include("../pachube/PachubeAPI.js");
PachubeFeed.apikey = 0;
PachubeFeed.feedid = 0;

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;
Titanium.Geolocation.purpose = "GPS user coordinates";
Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;

if (Titanium.Geolocation.locationServicesEnabled === false)
{
	Titanium.UI.createAlertDialog({title:'GPS is Off', message:'Your device has geo turned off - turn it on.'}).show();
}
else
{
	var authorization = Titanium.Geolocation.locationServicesAuthorization;
	if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
		Ti.UI.createAlertDialog({
			title:'Authorization',
			message:'You have disallowed UniShare from running geolocation services.'
		}).show();
	}
	else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
		Ti.UI.createAlertDialog({
			title:'Access restricted',
			message:'Your system has disallowed UniShare from running geolocation services.'
		}).show();
	}
	
	setInterval(function()
	{
		Titanium.Geolocation.getCurrentPosition(function(e){});
		setTimeout(function(){
			Titanium.Geolocation.getCurrentPosition(function(e)
			{
				var data = "";
				var sensorTypes = [
					e.coords.latitude,
					e.coords.longitude
				]
				var sendLocationData = function()
				{
					Ti.API.debug("Updated stream " + Titanium.App.currentService.id);
				}
				for (var i=0; i < Titanium.App.currentService.datastreams.length; i++) 
				{
					data += Titanium.App.currentService.datastreams[i].id + "," + sensorTypes[Titanium.App.currentService.datastreams[i].sensor] + "\r\n";
					
				};
				PachubeFeed.updateFeed("csv", sendLocationData, data, Titanium.App.currentService.feedid, Titanium.App.currentService.apikey);
			});
		}, 3000);
	}, Titanium.App.currentService.period);
}

Titanium.App.addEventListener('resumed', function()
{
	Titanium.App.currentService.unregister();
});