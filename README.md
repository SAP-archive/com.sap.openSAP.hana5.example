# com.sap.openSAP.hana5.example
openSAP HANA5/HANA6 Course: Example Completed Implementation  

Dependencies:

#1: In this exercise, we will create a synonym in order to access a table within another container. This exercise requires that you have the SFLIGHT catalog schema installed in your system and a database user who has access to this schema. You can find more information on loading SFLIGHT into your system, if it doesn’t exist already, here:
http://scn.sap.com/docs/DOC-41576
Afterwards please create a User Provided Service named CROSS_SCHEMA_SFLIGHT to access this schema.

#2: We also will show the usage of an HDI container installed outside of this project.  Please download the MTAR from this URL:
https://github.com/SAP/com.sap.openSAP.hana5.templates/raw/hana2_sps02/ex2/openSAP.CentralDB_1.0.2017.mtar
Then install this MTA into your development space with the command: 
xs deploy openSAP.CentralDB_1.0.2017.mtar --use-namespaces

================
In this course, we will focus on the new and improved features that were introduced in SAP HANA 1.0 SPS 11 and 12 and then expanded upon in HANA 2.0 SPS 0, SPS 01, and SPS 02. Developers taking this course should be able to get up to speed quickly and begin leveraging these new features to enhance their own productivity, as well as tap into powerful new features of SAP HANA itself. Students will learn to use SAP Web IDE for SAP HANA to develop both HDI (SAP HANA Deployment Infrastructure) and XSA (SAP HANA extended application services, advanced model) based applications.

## HANA5 Course Summary
With the delivery of SAP HANA SPS 11, we see a large number of new features in both the underlying SAP HANA infrastructure and in particular in the custom development aspects of SAP HANA native development.

Requirements change over time, and so too has XS within SAP HANA. SAP HANA extended application services in SPS 11 represents an evolution of the application server architecture, building upon the previous strengths while expanding the technical scope. This course will offer an overview of the new architecture and the various expanded capabilities it makes possible.

All of the architectural changes described in this course can be summarized in one key point: Choice. SAP HANA SPS 11 and higher offers customers and partners the freedom of choice of technologies, tools, and deployment options for high-scale development and operation of native SAP HANA applications.

It is also easier to choose between on-premise and cloud deployment. Because of the shared architecture being delivered going forward, it will soon be easy to develop an application that can be deployed on-premise, in the cloud, or in both scenarios without any coding changes.

In this course, we’ll assume that you have baseline knowledge of SAP HANA development and will instead focus on the new and improved features that were introduced in SAP HANA SPS 11 and 12. Developers taking this course should be able to get up to speed quickly and begin leveraging these new features to enhance their own productivity, as well as tap into powerful new features of SAP HANA itself. Students will learn to use SAP Web IDE for SAP HANA to develop both HDI (SAP HANA Deployment Infrastructure) and XSA (SAP HANA extended application services, advanced model) based applications.

## Course Characteristics
Starting from: November 2, 2016, 09:00 UTC. (What does this mean?)
Duration: 5 weeks (3 - 4 hours per week)
Final exam: December 7-15, 2016
Course language: English
How is an openSAP course structured?

## Course Content
Week 1: Introduction
Week 2: Database Development
Week 3: Application Server and UI Development
Week 4: Node.js
Week 5: Wrap-Up
Week 6: Final Exam

## Target Audience
Application developers
SAP HANA developers
HCP developers
Course Requirements
Basic programming knowledge including HTML, JavaScript, and SQL
Baseline SAP HANA development knowledge from one of the previous openSAP HANA courses would be helpful

## How to import code to SAP Web IDE for SAP HANA?

The code can be imported to SAP Web IDE for SAP HANA version SP12 and up. 

- Launch SAP Web IDE for SAP HANA


- Navigate to File->Git->Clone repository


- Enter the URL of the repository [https://github.com/SAP/com.sap.openSAP.hana5.example](https://github.com/SAP/com.sap.openSAP.hana5.example "https://github.com/SAP/com.sap.openSAP.hana5.example") 
- Click Ok button

##Getting Help
If you need addition help resources beyond this document, we would suggest the following content:
•	The Online Help at http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_XS_Advanced_Model_en.pdf

## Exercise Summary

## EXERCISE 1 - HELLO WORLD
### Objective
In this first exercise, we will connect to the remote system, run the new project wizard, and then create an HTML5 module to serve as the application endpoint and proxy all of our services and client-side content. At the end of this exercise you will be able to connect to your server via web browser and see a Hello World message.

## EXERCISE 2 –DATABASE ARTIFACT DEVELOPMENT
### Objective
In this exercise, we will continue to develop our overall application. Applications in the HANA/XS Advanced world, are often made up of multiple modules at design time which deploy to separate micro-services or database container content. We created client side UI application content in the first exercise using the HTML5 module. In this exercise we will create database artifacts, such as database table, stored procedures and user defined functions, using the HDB (HANA Database) module. We will then see how we build these database artifacts using the new container-based, schema-less HDI (HANA Deployment Infrastructure) concepts. 

### Exercise Description 
•	Database Tables via HDBCDS
•	Stored Procedures via HDBPROCEDURE
•	User Defined Functions via HDBFUNCTION
•	Initial table data load via CSV
•	Deploy to HANA via HDI

## EXERCISE 3 –XSJS AND XSODATA SERVICES 
### Objective
For this exercise we will now build the XSJS and XSODATA services used to expose our data model to the user interface. Although XS Advanced runs on node.js, SAP has added modules to node.js to provide XSJS and XSODATA backward compatibility. Therefore you can use the same programming model and much of the same APIs from XS, classic even within this new environment. .

### Exercise Description 
•	Node.js XSJS Bootstap
•	XSJS Services
•	XSODATA Services

## EXERCISE 4 – SAPUI5 USER INTERFACE 
### Objective
For this exercise we will build a proper SAPUI5 user interface that consumes both the XSJS and XSODATA services from our Node.js module.

### Exercise Description 
•	SAPUI5 Entry Point
•	SAPUI5 Component 
•	SAPUI5 Views
•	SAPUI5 Controllers

## EXERCISE 5 – NODE.JS 
### Objective
In exercise 3 we created a Node.js module, but didn’t really do much Node.js specific programming.  We only were using Node.js to run XSJS and XSODATA services. The support for XSJS and XSODATA is an important feature for XS Advanced. It not only allows backward compatible support for much of your existing development; but it provides a simplified programming model as an alternative to the non-block I/O event driven programming model normally used by Node.js. 

But we certainly aren’t limited to only the functionality provided by XSJS and XSODATA.  We have access to the full programming model of Node.js as well. In this exercise we will learn how to extend our existing Node.js module in the SAP Web IDE for SAP HANA. 

You will learn about how to create and use reusable code in the form of node.js modules. You will use packages.json to define dependencies to these modules which make the installation of them quite easy. You will use one of the most popular modules – express; which helps with the setup the handling of the request and response object. You will use express to handle multiple HTTP handlers in the same service by using routes. 

You will learn about the fundamentals of the asynchronous nature of nodel.js. We will so see how this asynchronous capability allows for non-blocking input and output. This technique is one of the basic things that makes Node.js development different from other JavaScript development and also creates one of the reasons for its growing popularity. We will see how these techniques are applied to common operations like HTTP web service calls or even SAP HANA database access. We will also see how to create language translatable text strings and HANA database queries from Node.js.

Our final part of this exercise will demonstrate the ease at which you can tap into the powerful web sockets capabilities of Node.js. We will use web sockets to build a simple chat application. Any message sent from the SAPUI5 client side application will be propagated by the server to all listening clients. 

### Exercise Description 
•	Modules
•	Express Module and package.json
•	Local Modules
•	SAP HANA database access from node.js
•	Basic asynchronous processing
•	Non-blocking I/O
•	Non-blocking HTTP requests
•	Non-blocking database requests
•	Text bundles
•	Web Sockets chat application

## EXERCISE 6 – PACKAGING FOR TRANSPORT 
### Objective
Now that we have a completed application we can package it for transport

### Exercise Description 
•	Build all modules
•	Build project to create MTAR
•	Download MTAR



