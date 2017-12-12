var SESSION = $.import("sap.hana.democontent.epm.services", "session");

var conn = $.db.getConnection();
var pstmt;
var rs;
var query;

query = 'SELECT * FROM "PO.Header" '
		+ ' LIMIT 10';

pstmt = conn.prepareStatement(query);
rs = pstmt.executeQuery();
var po = SESSION.recordSetToJSON(rs,'PurchaseOrder');

for(var i = 0; i < po.PurchaseOrder.length; i++){
	po.PurchaseOrder[i].DISCOUNTAMOUNT = (po.PurchaseOrder[i].GROSSAMOUNT - po.PurchaseOrder[i].GROSSAMOUNT * '.10');
}


$.response.contentType = 'application/json';
$.response.setBody(JSON.stringify(po));
$.response.status = $.net.http.OK;

