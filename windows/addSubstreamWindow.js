Ti.include("../pachube/PachubeAPI.js");
// DB Connect
var db = Titanium.Database.open('unishare');
var streamData = db.execute('SELECT * FROM STREAMS WHERE stream_id=' + Titanium.UI.currentWindow.info.stream_id);
// General variables
var stream = {};
	stream.id = streamData.fieldByName('stream_id');
	stream.name = streamData.fieldByName('stream_name');
	stream.feedid = streamData.fieldByName('stream_feedid');
	stream.apikey = streamData.fieldByName('stream_apikey');
var substream = {};
	substream.sensor_id = 0; 														// Sensor ID for DB
	substream.sensor_title = ''; 													// Sensor name
	substream.datastream_id = Titanium.UI.currentWindow.info.datastream_id;			// Datastream ID on Pachube
	substream.datastream_title = Titanium.UI.currentWindow.info.datastream_title;	// Datastream title
	substream.datastream_index = Titanium.UI.currentWindow.info.datastream_index;	// Datastream ID in array
var datastream_array = []; 															// Feed datastreams array
db.close();
// Pachube Connect
PachubeFeed.feedid = stream.feedid;
PachubeFeed.apikey = stream.apikey;

// Table starts here
var substreamView = Titanium.UI.createView({
	top: 40
});
var substreamTable = Ti.UI.createTableView({
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: '#A7C8E4'
});

// Function for HTTP Request
var tableCreation = function()
{
	var PachubeData = JSON.parse(this.responseText);
	// DB Connect
	var db = Titanium.Database.open('unishare');
	for (var i=0; i < PachubeData.datastreams.length; i++) {
		
		var ds = {};																// Temporary variable to put data to the array
			if (isNaN(PachubeData.datastreams[i].id)) { ds.id = '"'+PachubeData.datastreams[i].id+'"'} else {ds.id = PachubeData.datastreams[i].id};
			ds.title = PachubeData.datastreams[i].unit.label;
			ds.lastvalue = PachubeData.datastreams[i].current_value;
			ds.at = PachubeData.datastreams[i].at;
			ds.index = i;
		var existData = db.execute('SELECT * FROM SUBSTREAMS WHERE substream_ds=' + ds.id + ' AND stream_id=' + stream.id);
		if(existData.rowCount == 0)
		{
			datastream_array.push(ds);
		}
	};
	db.close();
	
	// Feed Datastream selection
	var datastreamRow = Ti.UI.createTableViewRow({
		height: 50,
		backgroundColor: '#FFFFFF'
	});
	var datastreamRowView = Titanium.UI.createView({
		height: 'auto',
		layout:'vertical',
		top:5,
		right:5,
		bottom:5,
		left:5
	});
	var datastreamRowLabel = Titanium.UI.createLabel({
		text: 'Substream: ' + substream.datastream_title,
		left:10,
		width:'auto',
		bottom:5,
		height: 'auto',
		textAlign:'left',
		color:'#333333',
		font:{fontFamily:'Trebuchet MS',fontSize:16}
	});
	datastreamRow.addEventListener('click', function(){
		// Picker starts here
		var datastreamPickerView = Titanium.UI.createView({
			bottom:0
		});
		var datastreamPicker = Titanium.UI.createPicker({
			bottom: 40,
			selectionIndicator: true
		});
		datastreamPicker.add(datastream_array);
		datastreamPicker.setSelectedRow(0,substream.datastream_index,true);
		datastreamPicker.addEventListener('change', function(e){
			substream.datastream_id = datastreamPicker.getSelectedRow(0).id;
			substream.datastream_title = datastreamPicker.getSelectedRow(0).title;
			datastreamRowLabel.text = 'Substream: ' + substream.datastream_title;
			substream.datastream_index = datastreamPicker.getSelectedRow(0).index;
		});
		var donePicker = Titanium.UI.createButton({
			width: 100,
			title: "Done",
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		donePicker.addEventListener("click", function()
		{
			substream.datastream_id = datastreamPicker.getSelectedRow(0).id;
			substream.datastream_title = datastreamPicker.getSelectedRow(0).title;
			datastreamRowLabel.text = 'Substream: ' + substream.datastream_title;
			substream.datastream_index = datastreamPicker.getSelectedRow(0).index;
			substreamView.remove(datastreamPickerView);
		});
		var space = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var toolbarPicker = Titanium.UI.createToolbar({
			items:[space,space,donePicker,space,space],
			bottom:0,
			barColor: '#336699'
		});
		datastreamPickerView.add(datastreamPicker);
		datastreamPickerView.add(toolbarPicker);
		substreamView.add(datastreamPickerView);
	});
	datastreamRowView.add(datastreamRowLabel);
	datastreamRow.add(datastreamRowView);
	
	// Device Datasource/Sensor selection
	var sensorRow = Ti.UI.createTableViewRow({
		height: 50,
		backgroundColor: '#FFFFFF'
	});
	var sensorRowView = Titanium.UI.createView({
		height: 'auto',
		layout:'vertical',
		top:5,
		right:5,
		bottom:5,
		left:5
	});
	var sensorRowLabel = Titanium.UI.createLabel({
		text: 'Sensor: select a sensor',
		left:10,
		width:'auto',
		bottom:5,
		height: 'auto',
		textAlign:'left',
		color:'#333333',
		font:{fontFamily:'Trebuchet MS',fontSize:16}
	});
	sensorRow.addEventListener('click', function(){
		// Picker starts here
		var sensorPickerView = Titanium.UI.createView({
			bottom:0
		});
		var sensorPicker = Titanium.UI.createPicker({
			bottom: 40,
			selectionIndicator: true
		});
		sensorPicker.add(Titanium.App.Sensors);
		var sensorPickerDone = Titanium.UI.createButton({
			width: 100,
			title: "Done",
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		sensorPickerDone.addEventListener("click", function()
		{
			substream.sensor_id = sensorPicker.getSelectedRow(0).id;
			substream.sensor_title = sensorPicker.getSelectedRow(0).title;
			sensorRowLabel.text = 'Sensor: ' + substream.sensor_title;
			substreamView.remove(sensorPickerView);
		});
		sensorPicker.setSelectedRow(0,substream.sensor_id,true);
		sensorPicker.addEventListener('change', function(){
			substream.sensor_id = sensorPicker.getSelectedRow(0).id;
			substream.sensor_title = sensorPicker.getSelectedRow(0).title;
			sensorRowLabel.text = 'Sensor: ' + substream.sensor_title;
		});
		var space = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var toolbarPicker = Titanium.UI.createToolbar({
			items:[space,space,sensorPickerDone,space,space],
			bottom:0,
			barColor: '#336699'
		});
		sensorPickerView.add(sensorPicker);
		sensorPickerView.add(toolbarPicker);
		substreamView.add(sensorPickerView);
	});
	sensorRowView.add(sensorRowLabel);
	sensorRow.add(sensorRowView);
	// Add everything to the table
	substreamTable.data = [datastreamRow, sensorRow];
}
var onerror = function()
{
	var errorSection = Titanium.UI.createTableViewSection({ headerTitle: "An error occured"  });
	var errorRow = Ti.UI.createTableViewRow({
		height: 'auto',
		backgroundColor: '#FFFFFF',
	});
	var errorRowView = Titanium.UI.createView({
		height: 'auto',
		layout:'vertical',
		top:5,
		right:5,
		bottom:5,
		left:5
	});
	var errorRowLabel = Titanium.UI.createLabel({
		text: 'Sorry, I am not able to connect to Pachube server right now. Try again later or check your feed information.',
		left:10,
		width:'auto',
		bottom:5,
		height: 'auto',
		textAlign:'left',
		color:'#333333',
		font:{fontFamily:'Trebuchet MS',fontSize:16}
	});
	errorRowView.add(errorRowLabel);
	errorRow.add(errorRowView);
	errorSection.add(errorRow);
	substreamTable.data = [errorSection];
}
PachubeFeed.getFeed("json", tableCreation, false, false, false, onerror);
substreamView.add(substreamTable);
// Add everything to the window
Titanium.UI.currentWindow.add(substreamView);
// Navigation Bar
var label = Titanium.UI.createButton({
	title:'Add Substream',
	color:'#fff',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
var space = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var done = Titanium.UI.createButton({
	title: "Done",
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
});
done.addEventListener("click", function()
{
	// DB Connect
	var db = Titanium.Database.open('unishare');
	db.execute('INSERT INTO SUBSTREAMS ( stream_id, substream_name, substream_sensor, substream_ds ) VALUES(?,?,?,?)', stream.id, substream.datastream_title, substream.sensor_id, substream.datastream_id);
	db.close();
	Titanium.App.streamView();
	Titanium.UI.currentWindow.close();
});
var cancel = Titanium.UI.createButton({
	title: "Cancel",
	style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
cancel.addEventListener("click", function()
{
	Titanium.UI.currentWindow.close();
});
var toolbar = Titanium.UI.createToolbar({
	items:[cancel, space, label, space, done],
	top:-1,
	borderTop:false,
	borderBottom:true,
	barColor: '#336699'
});
Titanium.UI.currentWindow.add(toolbar);