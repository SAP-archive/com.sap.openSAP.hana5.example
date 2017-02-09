/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, quotes:0*/
sap.ui.namespace("sap.global");

    // Service Call Logic
    var gFilterTerms = "";
    var gFilterAttribute = "";
    var gLastOrdersChangedTime = "";
    sap.global.gSearchParam = "";
   // jQuery.sap.require("sap.ui.model.json");
   // var oPieModel = new sap.ui.model.json.JSONModel();

    /*************** Language Resource Loader *************/
    jQuery.sap.require("jquery.sap.resources");
    sap.global.sLocale = sap.ui.getCore().getConfiguration().getLanguage();
    function getResourceBundle() {
		return sap.ui.getCore().getComponent("comp").getModel("i18n").getResourceBundle();
	}
	sap.global.oBundle = sap.ui.getCore().getComponent("comp").getModel("i18n").getResourceBundle();

    /** Tooltip formatting for the chart */
    var tooltipFormatString = '';
    if (sap.global.sLocale.indexOf("de") > -1) {
        tooltipFormatString = '#.###.###.###,00'; 
    } else {
        tooltipFormatString = '#,###,###,###.00'; 
    }

    /** initialize tile dialog */
    jQuery.sap.registerModulePath('app', 'js');
    jQuery.sap.require("app.tileDialog");


    function escape(v1) {
        var v2 = v1.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return v2;
    }

    /*** Numeric Formatter for Quantities ***/
    function numericSimpleFormatter(val) {
        if (val === undefined) {
            return '0';
        } else {
            jQuery.sap.require("sap.ui.core.format.NumberFormat");
            var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
                maxFractionDigits: 0,
                minFractionDigits: 0,
                groupingEnabled: true
            });
            return oNumberFormat.format(val);
        }

    }
    
    /* Wrapper for the function to be executed only once */
    function once(fn, context) { 
	    var result;
	    return function() { 
		    if(fn) {
			    result = fn.apply(context || this, arguments);
			    fn = null;
		    }
		    return result;
	    };
    }
    
    function	onErrorCall(oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}

		}