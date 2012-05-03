// General variables
var stream = {};
stream.name = '';
stream.feedid = '';
stream.apikey = '';
stream.periodid = 0;

var addStreamView = Titanium.UI.createView({
	top: 40,
	backgroundColor: '#A7C8E4'
});

// Stream name field
var nameField = Titanium.UI.createTextField({
	hintText:"Name of the Stream",
	height:40,
	width:300,
	top:20,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
addStreamView.add(nameField);

// Feed ID field
var feedField = Titanium.UI.createTextField({
	hintText:"Feed ID on Pachube",
	height:40,
	width:300,
	top:80,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
addStreamView.add(feedField);

// API key field
var apiField = Titanium.UI.createTextField({
	hintText:"API key on Pachube",
	height:40,
	width:300,
	top:140,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
addStreamView.add(apiField);

// Select period button
var updatePeriodButton = Titanium.UI.createButton({
	height:40,
	width:300,
	top:200,
	title: 'Select update period'
});
updatePeriodButton.addEventListener('click', function(){
	// Picker starts here
	var periodPickerView = Titanium.UI.createView({
		bottom:0
	});
	var periodPicker = Titanium.UI.createPicker({
		bottom: 40,
		selectionIndicator: true
	});
	periodPicker.add(Titanium.App.Periods);
	periodPicker.setSelectedRow(0,stream.periodid,true);
	var periodToolbarDone = Titanium.UI.createButton({
		width: 100,
		title: "Done",
		style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	periodToolbarDone.addEventListener("click", function()
	{
		updatePeriodButton.title = 'Update every ' + periodPicker.getSelectedRow(0).title;
		stream.periodid = periodPicker.getSelectedRow(0).id;
		addStreamView.remove(periodPickerView);
	});
	var space = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var periodToolbarPicker = Titanium.UI.createToolbar({
		items:[space, space, periodToolbarDone, space, space],
		bottom:0,
		barColor: '#336699',
		height: 30
	});
	periodPickerView.add(periodPicker);
	periodPickerView.add(periodToolbarPicker);
	addStreamView.add(periodPickerView);
	periodPicker.addEventListener('change', function(e){
		updatePeriodButton.title = 'Update every ' + periodPicker.getSelectedRow(0).title;
		stream.periodid = periodPicker.getSelectedRow(0).id;
	});
	
});
addStreamView.add(updatePeriodButton);

// How to find API key and Feed ID link
var tipLabel = Titanium.UI.createLabel({
	text: 'How can I find Feed ID and API key?',
	color: '#0066FF',
	font: {fontSize: 13},
	width: 'auto',
	height: 40,
	right: 15,
	top: 245
});
tipLabel.addEventListener('click', function(){
	Titanium.Platform.openURL('http://unishare.mobi/start');
});
addStreamView.add(tipLabel);

// Add everything to the window
Titanium.UI.currentWindow.add(addStreamView);

var label = Titanium.UI.createButton({
	title:'Add Stream',
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
	stream.name = nameField.value;
	stream.feedid = feedField.value;
	stream.apikey = apiField.value;
	if(stream.name == '' || stream.feedid == '' || stream.apikey == '')
	{
		var alert = Titanium.UI.createAlertDialog({
			title: "Fill the form",
			message: "You should fill all the fields to create new stream."
		});
		alert.show();
	}
	else
	{
		// Database
		var db = Titanium.Database.open('unishare');
		db.execute('INSERT INTO STREAMS (stream_name, stream_feedid, stream_apikey, stream_period ) VALUES(?,?,?,?)', stream.name, stream.feedid, stream.apikey, stream.periodid);
		db.close();
		Titanium.App.streamList();
		Titanium.UI.currentWindow.close();
	}
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
