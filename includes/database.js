Titanium.App.DB = {
	db: {},
	init: function()
	{
		this.db = Titanium.Database.open('unishare');
	},
	query: function(sql)
	{
		return this.db.execute(sql);
	},
	close: function()
	{
		this.db.close();
	}
}
Titanium.App.ORM = {
	getStreams: function()
	{
		var db = Titanium.Database.open('unishare');
		var result = db.execute('SELECT * FROM STREAMS');
		db.close();
		return result;
	},
	getSubstreams: function(stream_id)
	{
		
	},
	addStream: function(data)
	{
		
	},
	editStream: function(data)
	{
		
	},
	deleteStream: function(stream_id)
	{
		
	},
	switchStream: function(stream_id, status)
	{
		
	},
	addSubstream: function(data)
	{
		
	},
	editSubstream: function(data)
	{
		
	},
	deleteSubstream: function()
	{
		
	}
}
