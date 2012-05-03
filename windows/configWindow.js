var win = Titanium.UI.currentWindow;
var appDir = Titanium.Filesystem.applicationDataDirectory;
var configFile = Titanium.Filesystem.getFile(appDir,'config.json');

var updateButton = Titanium.UI.createButton({
	title: "Update"
});
updateButton.addEventListener("click", function(){
	var dataToWrite = Object();
	dataToWrite.olo = "Hi! Mungell!";
	configFile.deleteFile();
	configFile.write(JSON.stringify(dataToWrite));
	win.info.open();
});
win.add(updateButton);
