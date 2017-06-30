module.exports = {
	po_create_before_exit: function() {
	//	console.error("Start of Exit");
	/*	var after = param.afterTableName;
		var pStmt = null;
		var poid = '';
		try {
			param.connection.prepare('select "purchaseOrderSeqId".NEXTVAL as "POID" from "DUMMY"', function(err, statement) {
				if (err) {
					console.error(err);
					return;
				}
				statement.exec([], function(err, results) {
					if (err) {
						console.error(err);
						return;
					}
				});
				poid = results[1].POID;
				console.info("PO Id: " + poid.toString());
				param.connection.prepare("update\"" + after + "\"set PURCHASEORDERID = ?", function(err, statement) {
					if (err) {
						console.error(err);
						return;
					}
					statement.exec([poid], function(err, results) {
						if (err) {
							console.error(err);
							return;
						}
					});
				});
			});
		} catch (e) {
			console.error(e.message);
			pStmt.close();
		}*/
	}

};