/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

var conn = $.hdb.getConnection();
var query = "SELECT "  +
	" \"HEADER.PURCHASEORDERID\" as \"PurchaseOrderItemId\", " +
	" \"PRODUCT.PRODUCTID\" as \"ProductID\", " +
	" GROSSAMOUNT as \"Amount\" " +
	"FROM \"PO.Item\" ";           
var rs = conn.executeQuery(query);

$.response.setBody(JSON.stringify(rs));
$.response.contentType = "application/json";
$.response.status = $.net.http.OK;