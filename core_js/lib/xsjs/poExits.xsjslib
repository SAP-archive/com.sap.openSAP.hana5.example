function po_create_before_exit(param) {
    $.trace.error("Start of Exit");
    var after = param.afterTableName;
    var pStmt = null;
    var poid = '';
   
    try {
        pStmt = param.connection
        		 .prepareStatement('select "purchaseOrderSeqId".NEXTVAL from "DUMMY"');
                 //  .prepareStatement('SELECT max(PURCHASEORDERID + 1) from "PO.Header"');
        var rs = pStmt.executeQuery();
        while (rs.next()) {
           	poid = rs.getString(1);
        }
        $.trace.error(poid);
        pStmt.close();

        pStmt = param.connection.prepareStatement("update\"" + after + "\"set PURCHASEORDERID = ?");
        pStmt.setString(1, poid.toString());
        pStmt.execute();
        pStmt.close();
    } catch (e) {
    	$.trace.error(e.message);
        pStmt.close();
    }

}

function po_create(param) {

	try {
		$.trace.error("Insert");
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		rs = pStmt.executeQuery();
		var partnerId = 0;
		$.trace.error("Before Read Partner");
		while (rs.next()) {
			//	partnerId = rs.getInteger(7);
			$.trace.error("Partner ID: " + partnerId);
		}
		pStmt.close();

		pStmt = param.connection.prepareStatement(
			"INSERT INTO \"PurchaseOrder.Header\" " +
			"(\"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDAT\", \"HISTORY.CREATEDBY\", \"HISTORY.CHANGEDBY\", PARTNER, " +
			" NOTEID, CURRENCY, GROSSAMOUNT, NETAMOUNT, TAXAMOUNT, LIFECYCLESTATUS, APPROVALSTATUS, CONFIRMSTATUS, ORDERINGSTATUS, INVOICINGSTATUS ) " +
			"values(now(), now(), null, null, '100000000', null, 'EUR', 100, 100, 100, 'N', 'I', 'I', 'I', 'I' )"
		);

	//	pStmt.setString(1, "100000000");

		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
			$.trace.error(e.toString());
		throw e;
	}
}
