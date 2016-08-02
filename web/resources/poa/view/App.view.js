sap.ui.jsview("sap.shineNext.poa.view.App", {

	getControllerName: function () {
		return "sap.shineNext.poa.view.App";
	},
	
	createContent: function (oController) {
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		this.app = new sap.m.SplitApp();
		
		this.app.addMasterPage(sap.ui.xmlview("Master", "sap.shineNext.poa.view.Master"));
		
		this.app.addDetailPage(sap.ui.xmlview("Empty", "sap.shineNext.poa.view.Empty"));
		//return this.app;
		
		return new sap.m.Shell({
			title : "{i18n>shellTitle}",
			showLogout : false,
			app : this.app,
			homeIcon : {
				'phone' : 'img/57_iPhone_Desktop_Launch.png',
				'phone@2' : 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet' : 'img/72_iPad_Desktop_Launch.png',
				'tablet@2' : 'img/144_iPad_Retina_Web_Clip.png',
				'favicon' : 'img/favicon.ico',
				'precomposed': false
			}
		});
	}
});