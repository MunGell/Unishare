Titanium.App.standardWindow = 
{
	window: {},
	toolbar: {},
	label: {},
	
	createWindow: function(params)
	{
		var windowParams = {};
		var toolbarParams = {};
		var labelParams = {};
		
		if(params.backgroundColor)
			windowParams.backgroundColor = params.backgroundColor;
		if(params.backgroundGradient)
			windowParams.backgroundGradient = params.backgroundGradient;
		if(params.backgroundImage)
			windowParams.backgroundImage = params.backgroundImage;
		if(params.barColor)
			toolbarParams.backgroundColor = params.barColor;
		if(params.borderColor)
			windowParams.borderColor = params.borderColor;
		if(params.borderRadius)
			windowParams.borderRadius = params.borderRadius;
		if(params.borderWidth)
			windowParams.borderWidth = params.borderWidth;
		if(params.fullscreen)
			windowParams.fullscreen = params.fullscreen;	
		if(params.height)
			windowParams.height = params.height;
		if(params.left)
			windowParams.left = params.left;
		if(params.navBarHidden)
			windowParams.navBarHidden = params.navBarHidden;
		if(params.opacity)
			windowParams.opacity = params.opacity;
		if(params.orientationModes)
			windowParams.orientationModes = params.orientationModes;
		if(params.right)
			windowParams.right = params.right;
		if(params.size)
			windowParams.size = params.size;
		if(params.tabBarHidden)
			windowParams.tabBarHidden = params.tabBarHidden;
		if(params.title)
			labelParams.title = params.title;
		if(params.top)
			windowParams.top = params.top;
		if(params.url)
			windowParams.url = params.url;
		if(params.visible)
			windowParams.visible = params.visible;
		if(params.width)
			windowParams.width = params.width;
		
		labelParams.color = "#fff";
		labelParams.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		this.label = Titanium.UI.createButton(labelParams);
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		toolbarParams.items = [];
		if(params.leftNavButton)
			toolbarParams.items.push(params.leftNavButton);
		else
			toolbarParams.items.push(flexSpace);
		toolbarParams.items.push(flexSpace, this.label, flexSpace);
		if(params.rightNavButton)
			toolbarParams.items.push(params.rightNavButton);
		else
			toolbarParams.items.push(flexSpace);
		 
		toolbarParams.top = 0;
		toolbarParams.borderTop = false;
		toolbarParams.borderBottom = true;
		this.window = Titanium.UI.createWindow(windowParams);
		this.toolbar = Titanium.UI.createToolbar(toolbarParams);
		this.window.add(this.toolbar);
		return this.window;
	}
}
