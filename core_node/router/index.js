/*eslint-env node, es6 */
"use strict";

module.exports = (app, server) => {
	app.use("/node", require("./routes/myNode")());
	app.use("/node/client", require("./routes/hanaClient")());
	app.use("/node/excAsync", require("./routes/exerciseAsync")(server));
	app.use("/node/textBundle", require("./routes/textBundle")());
	app.use("/node/chat", require("./routes/chatServer")(server));
	app.use("/node/excel", require("./routes/excel")());
	app.use("/node/xml", require("./routes/xml")());
	app.use("/node/zip", require("./routes/zip")());
	app.use("/node/cds", require("./routes/cds")());
	app.use("/node/auditLog", require("./routes/auditLog")());
	app.use("/node/os", require("./routes/os")());
	var express = require("express");
	app.use("/node/os/web", express.static("os_web"));

	app.use("/sap/bc/lrep", require("./routes/lrep")());
	app.use("/node/annotations", require("./routes/annotations")());
	app.use("/node/JavaScriptBasics", require("./routes/JavaScriptBasics")());
	app.use("/node/promises", require("./routes/promises")());
	app.use("/node/await", require("./routes/await")());	
	app.use("/node/es6", require("./routes/es6")());

	app.use("/jobactivity", require("./routes/jobactivity")());
	app.use("/jobs", require("./routes/jobs")());
	app.use("/schedules", require("./routes/schedules")());
	app.use("/replicate", require("./routes/datagen")());
	app.use("/reset", require("./routes/reset")());
	app.use("/get", require("./routes/get")());
};