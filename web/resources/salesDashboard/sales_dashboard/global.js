		/*************** Language Resource Loader *************/
		jQuery.sap.require("jquery.sap.resources");
		var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
		var oBundle = jQuery.sap.resources({url : "./i18n/messagebundle.hdbtextbundle", locale: sLocale});
		
    
	/*************** Hijacking for Gold Reflection *************/
	if (sap.ui.getCore().getConfiguration().getTheme() == "sap_goldreflection" || "sap_bluecrystal") { // this line is a hack, the rest of this coding is what a BusyIndicator hijacker could do
		sap.ui.core.BusyIndicator.attachOpen(function(oEvent) {
			$Busy = oEvent.getParameter("$Busy");
			iBusyPageWidth = jQuery(document.body).width();
			$Busy.css("top", "0").css("width", iBusyPageWidth + "px");
			bBusyAnimate = true;
			iBusyLeft = $Busy[0].offsetLeft;
			window.setTimeout(animationStep, iBusyTimeStep);
		});
		sap.ui.core.BusyIndicator.attachClose(function(oEvent) {
			bBusyAnimate = false;
		});
	}

	var bBusyAnimate = false;
	var iBusyLeft = 0;
	var iBusyDelta = 60;
	var iBusyTimeStep = 50;
	var iBusyWidth = 500;
	var iBusyPageWidth;
	var $Busy;

	function animationStep() {
		if (bBusyAnimate) {
			iBusyLeft += iBusyDelta;
			if (iBusyLeft > iBusyPageWidth) {
				iBusyLeft = -iBusyWidth;
			}
			$Busy.css("background-position", iBusyLeft + "px 0px");
			window.setTimeout(animationStep, iBusyTimeStep);
		}
	}
	/*************** END of Hijacking for Gold Reflection *************/
 
	/*** Numeric Formatter for Currencies ***/
	function numericFormatter(val){
		   if(val==undefined){ return '0'}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 2,
		      minFractionDigits: 2,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	}

	/*** Numeric Formatter for Quantities ***/
	function numericSimpleFormatter(val){
		   if(val==undefined){ return '0'}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 0,
		      minFractionDigits: 0,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	}	
	
	function onErrorCall(jqXHR, textStatus, errorThrown){
		sap.ui.core.BusyIndicator.hide();
	 	  if(jqXHR.status == '500'){
	 		 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
	 				 "ERROR",
	 				oBundle.getText("error_action") );	
	 		return;	
	  }
	  else{
		         sap.ui.commons.MessageBox.show(jqXHR.statusText, 
	 				 "ERROR",
	 				oBundle.getText("error_action") );	
	 		return;	
	  }
	}