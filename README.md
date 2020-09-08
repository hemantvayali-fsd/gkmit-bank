# GMKIT Bank
Basic web application demonstrating the basic features of a bank.

## Installation
Make sure you have [node](https://nodejs.org/en/) installed on your machine.<br>
Clone the project
````bash
cd gmkit-bank
npm install
npm start
````

## Basic Configuration
To take advantage of all the functionalities, create a `.env` file in the root directory and set values for following variables.
* `PORT`<sub><sup>(optional)</sup></sub> Port to run the node app on. Default: 3000</small>
* `SESSION_SECRET`<sub><sup>(optional)</sup></sub> Secret key that will be used to encrypt the cookie. Default: 'secret'
* `MONGO_URI`<sub><sup>(optional)</sup></sub> The URI to connect MongoDB to.<br>
A basic URI looks something like this `mongodb://<username>:<password>@<host>:<port>/<db>?<options>`
* `SENDGRID_API_KEY`<sub><sup>(required)</sup></sub> The app uses `nodemailer` and sendgrid mailing service to send mails at different events.
