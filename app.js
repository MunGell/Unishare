Ti.include("includes/standardWindow.js");
Ti.include("includes/version.js");
// -----
// Configuration and DB
// -----
var dbDirectory = Titanium.Filesystem.getResourcesDirectory();
var dbFile = Titanium.Filesystem.getFile(dbDirectory + '\\unishare.db');
var db = Titanium.Database.open('unishare');
if (dbFile.exists()) 
{
	// Do something
}
else
{
	db.execute('CREATE TABLE IF NOT EXISTS streams ("stream_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,"stream_name" text NOT NULL,"stream_feedid" integer NOT NULL,"stream_apikey" text NOT NULL,"stream_status" boolean NOT NULL DEFAULT false, "stream_period" integer, "stream_syncid" integer DEFAULT 0)');
	db.execute('CREATE TABLE IF NOT EXISTS substreams ("substream_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "stream_id" integer NOT NULL, "substream_name" text NOT NULL,"substream_sensor" integer NOT NULL, "substream_ds" integer NOT NULL)');
}
db.close();

// -----
// Sensors
// -----
Titanium.App.Sensors = [
	{'id': 0, 'title': 'Location: Latitude'},
	{'id': 1, 'title': 'Location: Longitude'}
]
// -----
// Periods
// -----s
Titanium.App.Periods = [
	{'id': 0, 'title': '10 seconds', 'value': 10000, 'sync': -1},
	{'id': 1, 'title': '30 seconds', 'value': 30000, 'sync': -1},
	{'id': 2, 'title': '1 minute', 'value': 60000, 'sync': -1},
	{'id': 3, 'title': '2 minutes', 'value': 120000, 'sync': -1},
	{'id': 4, 'title': '5 minutes', 'value': 300000, 'sync': -1},
	{'id': 5, 'title': '10 minutes', 'value': 600000, 'sync': -1},
	{'id': 6, 'title': '15 minutes', 'value': 900000, 'sync': -1},
	{'id': 7, 'title': '20 minutes', 'value': 1200000, 'sync': -1},
	{'id': 8, 'title': '30 minutes', 'value': 1800000, 'sync': -1},
	{'id': 9, 'title': '1 hour', 'value': 3600000, 'sync': -1},
	{'id': 10, 'title': '2 hours', 'value': 7200000, 'sync': -1},
	{'id': 11, 'title': '3 hours', 'value': 10800000, 'sync': -1},
	{'id': 12, 'title': '4 hours', 'value': 14400000, 'sync': -1},
	{'id': 13, 'title': '5 hours', 'value': 18000000, 'sync': -1},
	{'id': 14, 'title': '6 hours', 'value': 21600000, 'sync': -1},
	{'id': 15, 'title': '7 hours', 'value': 25200000, 'sync': -1},
	{'id': 16, 'title': '8 hours', 'value': 28800000, 'sync': -1},
	{'id': 17, 'title': '9 hours', 'value': 32400000, 'sync': -1},
	{'id': 18, 'title': '10 hours', 'value': 36000000, 'sync': -1},
	{'id': 19, 'title': '11 hours', 'value': 39600000, 'sync': -1},
	{'id': 20, 'title': '12 hours', 'value': 43200000, 'sync': -1},
	{'id': 21, 'title': '1 day', 'value': 86400000, 'sync': -1}
]
// -----
// Streams to update
// -----
Titanium.App.Streams = [];

//Titanium.App.backServices = [];
//Titanium.App.editServices = [];

// -----
// Windows
// -----
Titanium.App.listWindow = Titanium.UI.createWindow({ 
    title:'Streams',
    hasChild: true,
    barColor: '#336699',
    url: 'windows/listWindow.js'
});
// Streams
Titanium.App.addStreamWindow = Titanium.UI.createWindow({
	backgroundColor: '#fff',
	url: 'windows/addStreamWindow.js'
});
Titanium.App.editStreamWindow = Titanium.UI.createWindow({
	backgroundColor: '#fff',
	url: 'windows/editStreamWindow.js'
});
Titanium.App.viewStreamWindow = Titanium.UI.createWindow({
	title: "Stream view",
	barColor: '#336699',
	url: 'windows/viewStreamWindow.js'
});
// Substreams
Titanium.App.addSubstreamWindow = Titanium.UI.createWindow({
	backgroundColor: '#fff',
	url: 'windows/addSubstreamWindow.js'
});
Titanium.App.editSubstreamWindow = Titanium.UI.createWindow({
	backgroundColor: '#fff',
	url: 'windows/editSubstreamWindow.js'
});

// -----
// Navigation
// -----
var rootWindow = Titanium.UI.createWindow({});
Titanium.App.Navigation = Titanium.UI.iPhone.createNavigationGroup({
	window: Titanium.App.listWindow
});
rootWindow.add(Titanium.App.Navigation);
// Start
rootWindow.open();
if (isiOS4Plus())
{
	var bss = [];
	Titanium.App.addEventListener('pause', function()
	{
		var db = Titanium.Database.open('unishare');
		var streamsData = db.execute('SELECT * FROM STREAMS WHERE stream_status="true"');
		while (streamsData.validRow)
		{
			var stream = {};
			stream.id = streamsData.fieldByName('stream_id');
			stream.feedid = streamsData.fieldByName('stream_feedid');
			stream.apikey = streamsData.fieldByName('stream_apikey');
			stream.periodid = streamsData.fieldByName('stream_period');
			stream.period = Titanium.App.Periods[stream.periodid].value;
			
			var ds = [];
			var substreamsData = db.execute('SELECT * FROM SUBSTREAMS WHERE stream_id=' + stream.id);
			while (substreamsData.validRow)
			{
				var d = {};
				d.id = substreamsData.fieldByName('substream_ds');
				d.sensor = substreamsData.fieldByName('substream_sensor');
				ds.push(d);
				substreamsData.next();
			}
			
			Titanium.App.iOS.registerBackgroundService({
				url:'includes/background.js', 
				id: stream.id, 
				feedid: stream.feedid, 
				apikey: stream.apikey, 
				period: stream.period,
				datastreams: ds
			});
			streamsData.next();
		}
		db.close();
	});

}
