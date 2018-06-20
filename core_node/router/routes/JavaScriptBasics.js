/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output = `<H1>JavaScript Basics</H1></br>
			<a href="${req.baseUrl}/dates">/dates</a> - Date processing</br>
			<a href="${req.baseUrl}/array">/array</a> - Array processing</br>
			<a href="${req.baseUrl}/json">/json</a> - JSON JavaScript Object Notation processing</br>
			<a href="${req.baseUrl}/objects">/objects</a> - JavaScript Objects</br>
			<a href="${req.baseUrl}/strings">/strings</a> - String processing</br>
			<a href="${req.baseUrl}/classes">/classes</a> - JavaScript Classes</br>			
			<a href="${req.baseUrl}/promises">/promises</a> - Promises</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//strings
	app.get("/strings", (req, res) => {
		var body = "";
		var demo1 = "SAP HANA Extended Application Services";

		body += `Basic String: ${demo1} </p>`;

		body += `The first character in the string: ${demo1[0]} </p>`;

		body += `The length of the string: ${demo1.length.toString()} </p>`;

		//slice with a negative index
		body += `The last character in the string: ${demo1.slice(-1)} </p>`;

		body += `Upper: ${demo1.toUpperCase()} </p>`;

		body += `Lower: ${demo1.toLowerCase()} </p>`;

		body += `Find HANA: ${demo1.indexOf("HANA").toString()} </p>`;

		body += `Find Last occurance of the letter A: ${demo1.lastIndexOf("A").toString()} </p>`;

		body += `Replace with XS: ${demo1.replace("Extended Application Services", "XS")} </p>`;

		var es6 = "ES6!";
		body += `Template Literals in ${es6}` + "</p>";

		body += `Multi-line string </br>
		         second line </p>`;

		res.type("text/html").status(200).send(body);
	});

	//Dates
	app.get("/dates", (req, res) => {
		var body = "";
		var now = new Date();
		var nextMonth = new Date();

		body += `Now: ${now} </p>`;
		body += `Now UTC: ${now.toUTCString()} </p>`;
		body += `Now Date String: ${now.toDateString()} </p>`;
		body += `Now Locale Date String: ${now.toLocaleDateString()} </p>`;
		body += `Now Locale Time String: ${now.toLocaleTimeString()} </p>`;
		body += `Now Locale String: ${now.toLocaleString()} </p>`;
		body += `Now ISO String: ${now.toISOString()} </p>`;
		body += `Now JSON String: ${now.toJSON()} </p>`;
		body += `Now Year: ${now.getFullYear()} </p>`;
		body += `Now Month: ${now.getMonth()} </p>`;
		body += `Now Day of Week: ${now.getDay()} </p>`;
		body += `Now Day of Month: ${now.getDate()} </p>`;
		body += `Now number of milliseconds since midnight Jan 1, 1970: ${now.getTime()} </p>`;
		body += `Now Hours: ${now.getHours()} </p>`;
		body += `Now Minutes: ${now.getMinutes()} </p>`;
		body += `Now Seconds: ${now.getSeconds()} </p>`;

		nextMonth.setDate(now.getDate() + 30);
		body += `30 days from now: ${nextMonth} </p>`;

		nextMonth.setDate(now.getDate() + 30);
		body += "30 days from now: " + nextMonth + "</p>";

		let dateUS = new Intl.DateTimeFormat("en-US");
		let dateDE = new Intl.DateTimeFormat("de-DE");
		body += `US: ${dateUS.format(new Date())}, DE: ${dateDE.format(new Date())} </p>`;

		res.type("text/html").status(200).send(body);
	});

	//array
	app.get("/array", (req, res) => {
		var colors = ["<font color=\"red\">Red</font>",
			"<font color=\"green\">Green</font>",
			"<font color=\"blue\">Blue</font>"
		];
		var extColors = ["<font color=\"black\">Black</font>",
			"<font color=\"white\">White</font>",
			"<font color=\"orange\">Orange</font>",
			"<font color=\"purple\">Purple</font>"
		];

		var body = "";

		//toString converts simple and complex types to a String Reprsentation
		//This allows the output of all Array elements	
		body = `Complete Array: ${colors.toString()} </p>`;

		//Elements can be accessed by index - the first element is zero	
		body += `First Element: ${colors[0]} </p>`;

		//length tells you how many elements in an array	
		body += `Number of Elements: ${colors.length.toString()} </p>`;

		//indexOf allows you to get the zero-based position of a particular value in an array    
		body += `Position of Blue: ${colors.indexOf("Blue").toString()} </p>`;

		//Common technique to loop through all elements in an array
		body += "Loop of Elements: ";
		for (let color of colors) {
			body += color + " ";
		}
		body += "</p>";

		//Combine two arrays
		colors = colors.concat(extColors);
		body += `Combined Array: ${colors.toString()} </p>`;

		//Reverse Sort the Array
		colors.reverse();
		body += `Reverse Sort: ${colors.toString()} </p>`;

		//Sort Ascending 
		colors.sort();
		body += `Sort Ascending: ${colors.toString()} </p>`;

		//Remove the last element
		colors.pop();
		body += "Remove the last element: " + colors.toString() + "</p>";

		//Remove the first element
		colors.shift();
		body += `Remove the last element: ${colors.toString()} </p>`;

		//Copy specific positions - slice(start,end)
		var slicedColors = colors.slice(2, 4);
		body += `Slice out the 3rd and 4th element: ${slicedColors.toString()} </p>`;

		//Add multiple elements at specific position - splice(insertion Index, number of elements, value1, ...)
		colors.splice(2, 2, "<font color=\"malachite\">Malachite</font>", "<font color=\"fallow\">Fallow</font>");
		body += `Add two values at position 3: ${colors.toString()} </p>`;

		//Add an element to the beginning of the array - unshift
		colors.unshift("<font color=\"brown\">Brown</font>");
		body += `Add element to the beginning of the array: ${colors.toString()} </p>`;

		res.type("text/html").status(200).send(body);
	});

	//json
	app.get("/json", (req, res) => {
		var client = req.db;
		client.prepare(
			`SELECT * 
			   FROM "PO.Header" LIMIT 10`,
			(err, statement) => {
				if (err) {
					return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				statement.exec([],
					(err, results) => {
						if (err) {
							return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						} else {
							for (let result of results) {
								result.DISCOUNTAMOUNT = (result.GROSSAMOUNT - result.GROSSAMOUNT * .10);
							}
							return res.type("application/json").status(200).send(JSON.stringify(results));
						}
					});
				return null;
			});
	});

	//objects
	app.get("/objects", async(req, res) => {
		var body = "";

		body += "<b>Object Literals</b></p>";
		//Object Literal	
		var colors = {
			red: "#FF0000",
			green: "#00FF00",
			blue: "#0000FF",
			favoriteColor: () => {
				var now = new Date();
				if (now.getDay() === 1) { //If Monday
					return this.blue;
				} else {
					return this.red;
				}
			}
		};

		body += `<span style="color: ${colors.red}">Red</span></p>`;
		body += `<span style="color: ${colors["blue"]}">Blue</span></p>`;
		body += `<span style="color: ${colors.green}">Green</span></p>`;
		body += `<span style="color: ${colors.favoriteColor()}">Favorite Color</span></p>`;

		body += "<b>References</b></p>";
		//References 
		//regular data types are assigned by value	
		var value1 = "First Value";
		var value2 = value1;
		value1 = "New Value";
		body += `Value 1: ${value1} </p>`; // = First Value
		body += `Value 2: ${value2} </p>`; // = New Value

		//objects are assigned by reference
		var value3 = {
			val: "First Value"
		};
		var value4 = value3;
		value3.val = "New Value";
		body += `Value 3: ${value3.val} </p>`; // = New Value
		body += `Value 4: ${value4.val} </p>`; // = New Value 	

		body += "<b>Object Constructor</b></p>";
		//Object Constructor
		function purchaseOrder(purchaseOrderID) {
			this.discount = function() {
							return (this.grossAmount - this.grossAmount * ".10");
			};
			let me = this;
			return new Promise(async(resolve, reject) => {
				try {
					let dbPromises = require(global.__base + "utils/dbPromises");
					let dbConn = new dbPromises(req.db);
					const statement = await dbConn.preparePromisified(
						`SELECT * 
		        		   FROM "PO.Header" 
		        		  WHERE PURCHASEORDERID = ?`);
					const result = await dbConn.statementExecPromisified(statement, [purchaseOrderID]);
					console.log(JSON.stringify(result));
					me.purchaseOrderID = result[0].PURCHASEORDERID;
					me.grossAmount = result[0].GROSSAMOUNT;
					resolve(me);
				} catch (e) {
					reject(e);
				}
			});
		}

		try {
			var po = await new purchaseOrder(300000001);
			body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;
			po = await new purchaseOrder(300000002);
			body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;
			return res.type("text/html").status(200).send(body);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(e)}, ${e.toString}`);
		}
	});

	//classes
	app.get("/classes", async(req, res) => {
		var body = "";
		body += "<b>True Classes</b></p>";
		//Class Literal	
		class color {
			constructor() {
				this.red = "#FF0000";
				this.green = "#00FF00";
				this.blue = "#0000FF";
			}

			favoriteColor() {
				var now = new Date();
				if (now.getDay() === 1) { //If Monday
					return this.blue;
				} else {
					return this.red;
				}
			}
		}
		let colors = new color();
		body += `<span style="color: ${colors.red}">Red</span></p>`;
		body += `<span style="color: ${colors["blue"]}">Blue</span></p>`;
		body += `<span style="color: ${colors.green}">Green</span></p>`;
		body += `<span style="color: ${colors.favoriteColor()}">Favorite Color</span></p>`;

		body += "<b>Class Constructor</b></p>";
		//Class Constructor
		class purchaseOrder {
			constructor(po) {
				this.purchaseOrderID = po.PURCHASEORDERID;
				this.grossAmount = po.GROSSAMOUNT;
			}
			discount() {
				return (this.grossAmount - this.grossAmount * ".10");
			}
		}

		class POFactory {
			static async create(id) {
				async function load(id) {
					let dbPromises = require(global.__base + "utils/dbPromises");
					let dbConn = new dbPromises(req.db);
					const statement = await dbConn.preparePromisified(
						`SELECT * 
		        			   FROM "PO.Header" 
		        			  WHERE PURCHASEORDERID = ?`);
					const result = await dbConn.statementExecPromisified(statement, [id]);
					return result[0];
				}
				let po = await load(id);
				return new purchaseOrder(po);
			}
		}

		try {
			var po = null;
			po = await POFactory.create(300000000);
			body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

			po = await POFactory.create(300000001);
			body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

			return res.type("text/html").status(200).send(body);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(e)}, ${e.toString}`);
		}
	});

	//promises
	app.get("/promises", (req, res) => {
		var body = "";

		function readFilePromisified(filename) {
			return new Promise(
				(resolve, reject) => {
					require("fs").readFile(filename, "utf8", (error, data) => {
						if (error) {
							reject(error);
						} else {
							resolve(data);
						}
					});
				}
			);
		}

		readFilePromisified(global.__base + "async/file.txt")
			.then(text => {
				return res.type("text/html").status(200).send(text);
			})
			.catch(error => {
				console.log(error);
			});
	});

	return app;
};
