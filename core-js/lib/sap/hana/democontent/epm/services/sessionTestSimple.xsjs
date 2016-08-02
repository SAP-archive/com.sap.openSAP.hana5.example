$.import("sap.hana.democontent.epmNext.services", "session");
var SESSION = $.sap.hana.democontent.epmNext.services.session;

SESSION.set_session_variable('test', 'sap.hana.democontent.epmNext.services.SessionTest', 'Test1');
SESSION.set_application_variable('test', 'sap.hana.democontent.epmNext.services.SessionTest', 'Application Test1');

var conn = $.db.getConnection();
var pstmt;
var rs;
var query = 'select USER_NAME, USER_MODE, CREATOR from USERS';
pstmt = conn.prepareStatement(query);
rs = pstmt.executeQuery();
var jsonOut = SESSION.recordSetToJSON(rs,'Tables');
pstmt.close();
conn.commit();
conn.close();
SESSION.set_application_variable('tables', 'sap.hana.democontent.epmNext.services.SessionTest', JSON.stringify(jsonOut));


//var expiry = SESSION.calcTomorrow();
$.response.contentType = 'application/json';
var body = SESSION.get_application_variable('tables','sap.hana.democontent.epmNext.services.SessionTest');
$.response.setBody(body);
$.response.status = $.net.http.OK;