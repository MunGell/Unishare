Ti.include("../pachube/PachubeAPI.js");
Titanium.App.streamView = function(){
	// DB Connect
	var db = Titanium.Database.open('unishare');
	var streamData = db.execute('SELECT * FROM STREAMS WHERE stream_id=' + Titanium.UI.currentWindow.info.rowData.stream_id);
	var stream = {};
	stream.id = streamData.fieldByName('stream_id');
	stream.name = streamData.fieldByName('stream_name');
	stream.feedid = streamData.fieldByName('stream_feedid');
	stream.apikey = streamData.fieldByName('stream_apikey');
	stream.status = (streamData.fieldByName('stream_status') == 'true');
	stream.periodid = streamData.fieldByName('stream_period');
	stream.syncid = streamData.fieldByName('stream_syncid');
	db.close();
	Titanium.UI.currentWindow.title = stream.name;
	// Pachube Connect
	PachubeFeed.feedid = stream.feedid;
	PachubeFeed.apikey = stream.apikey;
	
	// Table starts here
	var streamView = Titanium.UI.createView();
	var streamTable = Ti.UI.createTableView({
		style:Ti.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor: '#A7C8E4'
	});
	
	// Edit Stream Button
	var edit = Titanium.UI.createButton({
		title: "Edit",
		style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	edit.addEventListener("click", function(){
		Titanium.App.editStreamWindow.info = stream.id;
		Titanium.App.editStreamWindow.open();
	});
	Titanium.UI.currentWindow.rightNavButton = edit;
	// Function for HTTP Request
	var windowCreation = function()
	{
		var PachubeData = JSON.parse(this.responseText);
		// General Information section starts here
		var generalSection = Titanium.UI.createTableViewSection({ headerTitle: "General Information"  });
		// Show Feed Status
		var feedStatusRow = Ti.UI.createTableViewRow({
			height: 50,
			backgroundColor: '#FFFFFF'
		});
		var feedStatusRowView = Titanium.UI.createView({
			height: 'auto',
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});
		var feedStatusRowLabel = Titanium.UI.createLabel({
			text: 'Stream Status',
			left:10,
			width:'auto',
			bottom:5,
			height: 'auto',
			textAlign:'left',
			color:'#333333',
			font:{fontFamily:'Trebuchet MS',fontSize:16}
		});
		var switcher = Titanium.UI.createSwitch({
			value: stream.status,
			right: 10
		});
		switcher.addEventListener('change', function(){
			// DB Connect
			var db = Titanium.Database.open('unishare');
			stream.status = !stream.status;
			db.execute('UPDATE STREAMS SET stream_status="' + stream.status + '" WHERE stream_id=' + stream.id);
			db.close();
			Titanium.App.streamList();
		});
		feedStatusRowView.add(feedStatusRowLabel);
		feedStatusRow.add(feedStatusRowView);
		feedStatusRow.add(switcher);
		generalSection.add(feedStatusRow);
		
		// Show Feed ID
		var feedIDRow = Ti.UI.createTableViewRow({
			height: 50,
			backgroundColor: '#FFFFFF',
		});
		var feedIDRowView = Titanium.UI.createView({
			height: 'auto',
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});
		var feedIDRowLabel = Titanium.UI.createLabel({
			text: 'Feed ID: ' + stream.feedid,
			left:10,
			width:'auto',
			bottom:5,
			height: 'auto',
			textAlign:'left',
			color:'#333333',
			font:{fontFamily:'Trebuchet MS',fontSize:16}
		});
		feedIDRowView.add(feedIDRowLabel);
		feedIDRow.add(feedIDRowView);
		generalSection.add(feedIDRow);
		
		// Show Feed name from Pachube
		var feedNameRow = Ti.UI.createTableViewRow({
			height: 50,
			backgroundColor: '#FFFFFF',
		});
		var feedNameRowView = Titanium.UI.createView({
			height: 'auto',
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});
		var feedNameRowLabel = Titanium.UI.createLabel({
			text: 'Feed Name: ' + PachubeData.title,
			left:10,
			width:'auto',
			bottom:5,
			height: 'auto',
			textAlign:'left',
			color:'#333333',
			font:{fontFamily:'Trebuchet MS',fontSize:16}
		});
		feedNameRowView.add(feedNameRowLabel);
		feedNameRow.add(feedNameRowView);
		generalSection.add(feedNameRow);
		
		// Show Feed name from Pachube
		var updatePeriodRow = Ti.UI.createTableViewRow({
			height: 50,
			backgroundColor: '#FFFFFF',
		});
		var updatePeriodView = Titanium.UI.createView({
			height: 'auto',
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});
		var updatePeriodLabel = Titanium.UI.createLabel({
			text: 'Update period: ' + Titanium.App.Periods[stream.periodid].title,
			left:10,
			width:'auto',
			bottom:5,
			height: 'auto',
			textAlign:'left',
			color:'#333333',
			font:{fontFamily:'Trebuchet MS',fontSize:16}
		});
		updatePeriodView.add(updatePeriodLabel);
		updatePeriodRow.add(updatePeriodView);
		generalSection.add(updatePeriodRow);
		
		// Datastreams section starts here
		var substreamsSection = Titanium.UI.createTableViewSection({ headerTitle: "Substreams"  });
		for (var i=0; i < PachubeData.datastreams.length; i++) 
		{
			var image_url = "";
			var installed = false;
			var substream_db_id = -1;
			var db = Titanium.Database.open('unishare');
			var id = "";
			if (isNaN(PachubeData.datastreams[i].id)) { id = '"'+PachubeData.datastreams[i].id+'"'} else {id = PachubeData.datastreams[i].id};
			var substreamsData = db.execute('SELECT * FROM SUBSTREAMS WHERE stream_id=' + stream.id + ' AND substream_ds=' + id);
			var isInDB = substreamsData.rowCount;
			if (isInDB > 0) 
			{
				image_url = '../unishare_icon_active.png';
				substream_db_id = substreamsData.fieldByName('substream_id');
				installed = true;
			}
			else
			{
				image_url = '../unishare_icon_inactive.png';
			}
			db.close();
			var dsRow = Ti.UI.createTableViewRow({
				height: 50,
				backgroundColor: '#FFFFFF',
				leftImage: image_url,
				hasChild: true,
				stream_id: stream.id,
				substream_id: substream_db_id,
				datastream_id: PachubeData.datastreams[i].id,
				datastream_index: i,
				datastream_title: PachubeData.datastreams[i].unit.label,
				installed: installed
			});
			var dsRowView = Titanium.UI.createView({
				height: 'auto',
				layout:'vertical',
				top:5,
				right:5,
				bottom:5,
				left:5
			});
			var dsRowLabel = Titanium.UI.createLabel({
				text: PachubeData.datastreams[i].unit.label,
				left:50,
				width:'auto',
				bottom:5,
				height: 'auto',
				textAlign:'left',
				color:'#333333',
				font:{fontFamily:'Trebuchet MS',fontSize:16}
			});
			dsRow.addEventListener('click', function(e){
				var data = {};
				data.stream_id = e.rowData.stream_id;
				data.substream_id = e.rowData.substream_id;
				data.datastream_id = e.rowData.datastream_id;
				data.datastream_index = e.rowData.datastream_index;
				data.datastream_title = e.rowData.datastream_title;
				if(e.rowData.installed)
				{
					Titanium.App.editSubstreamWindow.info = data;
					Titanium.App.editSubstreamWindow.open();
				}
				else
				{
					Titanium.App.addSubstreamWindow.info = data;
					Titanium.App.addSubstreamWindow.open();
				}
			});
			dsRowView.add(dsRowLabel);
			dsRow.add(dsRowView);
			substreamsSection.add(dsRow);
		}
		
		streamTable.data = [generalSection, substreamsSection];
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
		streamTable.data = [errorSection];
	}
	PachubeFeed.getFeed("json", windowCreation, false, false, false, onerror);
	streamView.add(streamTable);
	Titanium.UI.currentWindow.add(streamView);
}
Titanium.App.streamView();
