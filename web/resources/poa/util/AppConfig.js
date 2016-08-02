jQuery.sap.declare("sap.shineNext.poa.util.AppConfig");

sap.shineNext.poa.util.AppConfig = function(oConfig){
	this.config = oConfig;
	this._fnValidate();
};

sap.shineNext.poa.util.AppConfig.prototype.getStringValue = function(sPropName,args){
	var val = this.config[sPropName];
	
	if (jQuery.isFunction(val)){
		val = val.apply(null,args);
	}
	
	if(typeof val == 'string' || val instanceof String){
		return  val;		
	} else {
		jQuery.sap.log.error("The app config is not correct, the function " + sPropName + " has to return a string");
	}
};

sap.shineNext.poa.util.AppConfig.prototype.getBoolValue = function(sPropName,args){
	var val = this.config[sPropName];
	
	if (jQuery.isFunction(val)){
		val = val.apply(null,args);
	}
	return !!val;
};

sap.shineNext.poa.util.AppConfig.prototype._fnValidate = function(){	
	this._isStringOfFunction("defaultPageId");
	this._isStringOfFunction("isMaster");
	this._isStringOfFunction("viewName");
	this._isStringOfFunction("viewType");
	this._isStringOfFunction("transition");
};

sap.shineNext.poa.util.AppConfig.prototype._isStringOfFunction = function(sName){
	var val = this.config[sName];
	
	if(!(typeof val == 'string' || val instanceof String || jQuery.isFunction(val))){
		jQuery.sap.log.error("The app config is not correct, this property " + sName + "has to be a string or a function");
	}
};