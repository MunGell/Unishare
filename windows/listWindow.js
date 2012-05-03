// List of Streams View
var listView = Titanium.UI.createView();
var streamsTable = Ti.UI.createTableView({
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: '#A7C8E4'
});
Titanium.App.streamList = function()
{
	// DB Connect
	var db = Titanium.Database.open('unishare');
	var streamsData = db.execute('SELECT * FROM STREAMS');
	var streams_count = streamsData.rowCount;
	var streamsSection = Titanium.UI.createTableViewSection({});
	
	while (streamsData.validRow)
	{
		var stream_id = streamsData.fieldByName('stream_id');
		var stream_name = streamsData.fieldByName('stream_name');
		var stream_status = (streamsData.fieldByName('stream_status') == 'true');
		
		var streamRow = Ti.UI.createTableViewRow({
			height: 50,
			backgroundColor: '#FFFFFF',
	        stream_id: stream_id
	    });
		var streamRowView = Titanium.UI.createView({
			height: 'auto',
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});
		var streamRowLabel = Titanium.UI.createLabel({
			text: stream_name,
			left:10,
			width:'auto',
			bottom:5,
			height: 'auto',
			textAlign:'left',
			color:'#333333',
			font:{fontFamily:'Trebuchet MS',fontSize:16}
		});
		// Show Switch On/Off
		var switcher = Titanium.UI.createSwitch({
			value: stream_status,
			right: 10,
			stream_id: stream_id
		});
		switcher.addEventListener('change', function(e){
			// DB Connect
			var db = Titanium.Database.open('unishare');
			db.execute('UPDATE STREAMS SET stream_status="' + e.value + '" WHERE stream_id=' + e.source.stream_id);
			db.close();
		});
		streamRow.addEventListener('click', function(e){
			Titanium.App.viewStreamWindow.info = e;
			Titanium.App.Navigation.open(Titanium.App.viewStreamWindow);
		});
		streamRowView.add(streamRowLabel);
		streamRow.add(streamRowView);
		streamRow.add(switcher);
	    streamsSection.add(streamRow);
	    streamsData.next();
	}
	db.close();
	streamsTable.data = [streamsSection];
	listView.add(streamsTable);
	Titanium.App.listWindow.add(listView);
}
// Start
Titanium.App.streamList();
streamsTable.addEventListener('delete', function(e){
	// DB Connect
	var db = Titanium.Database.open('unishare');
	db.execute('DELETE FROM STREAMS WHERE stream_id=' + e.row.stream_id);
	db.execute('DELETE FROM SUBSTREAMS WHERE stream_id=' + e.row.stream_id);
	db.close();
});
// Add Stream Button
var add = Titanium.UI.createButton({
	title: "Add",
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
});
add.addEventListener("click", function(){
	Titanium.App.addStreamWindow.open();
});
// Done editing
var done = Titanium.UI.createButton({
	title: "Done",
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
});
done.addEventListener("click", function(){
	streamsTable.editing = false,
	Titanium.App.listWindow.leftNavButton = edit,
	Titanium.App.listWindow.rightNavButton = add
});
// Edit Streams List Button
var edit = Titanium.UI.createButton({
	title: "Edit",
	style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
edit.addEventListener("click", function(){
	streamsTable.editing = true,
	Titanium.App.listWindow.rightNavButton = done,
	Titanium.App.listWindow.leftNavButton = null
});
Titanium.App.listWindow.leftNavButton = edit;
Titanium.App.listWindow.rightNavButton = add;
