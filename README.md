# Tracking Project

Tracking is a shipment tracking application built with html css javascript

#Project Description
The main idea of the project is to create user friendly interface to use shipping tracking API
After customer adding shipping order the company will provide him with a shipping code which will be used in the application to get the current state and state log of this shipment
The application consists of main page that contains company information and button to track a shipment
When user press the button the application open a new form asking the user to input the shipment tracking code
By inserting the code and press submit button the application send the code to to API to be processed and the result will show in new window
shipment tracking code can be for a single container for shipment contains many containers 

#Installation
1- create a new folder (tracking) in your web root
2- copy all files to the new folder

#Using the application
open your browser and navigate to http://yourserver/tracking
-notes-
replace : your server with the domain name of yours
replace : traking with the new forder name in my case (tracking)

#tracking a shipment 
1-click the plus button attached to the header of application.
2-in the new form enter the shipping code
3- click submit button
the form will be closed and the result will appear in the form of cards.
each card represents a status for the shipment
shipment status will be arranged as the newly status comes first
