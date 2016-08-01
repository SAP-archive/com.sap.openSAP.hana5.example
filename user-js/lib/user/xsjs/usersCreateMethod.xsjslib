/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("user.xsjs", "session");
var SESSIONINFO = $.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function usersCreate(param){
	var after = param.afterTableName;    
	
	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");	 
	var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();


	//Validate Email
	if(!validateEmail(User.Details[0].E_MAIL)){
		throw "Invalid email for "  + User.Details[0].FIRSTNAME +  
        " No Way! E-Mail must be valid and " + User.Details[0].E_MAIL + " has problems";
	} 

	//Get Next Personnel Number
	pStmt = param.connection.prepareStatement("select \"purchaseOrderSeqId\".NEXTVAL from dummy"); 
	var rs = pStmt.executeQuery();
	var PersNo = "";
	while (rs.next()) {
		PersNo = rs.getString(1);
	}
	pStmt.close();
	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("insert into \"User.Details\" values(?,?,?,?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?,?)" );		
		}
		pStmt.setString(1, PersNo.toString());
		pStmt.setString(2, User.Details[0].FIRSTNAME.toString());		pStmt.setString(3, User.Details[0].LASTNAME.toString());	
		pStmt.setString(4, User.Details[0].E_MAIL.toString());	
		pStmt.executeUpdate();
		pStmt.close();
	}
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}