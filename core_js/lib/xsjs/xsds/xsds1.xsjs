var conn = $.hdb.getConnection();
var XSDS = $.require("sap-cds").xsjs(conn);

//Import(Namespace,Entity Name, fields, options)
var oEmployee = XSDS.$importEntity("", "MD.Employees");
var employee = null;
employee = oEmployee.$query().$project({
	 LOGINNAME: true
}).$execute();


$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(employee));