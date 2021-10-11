'use strict';

require('dotenv').config()

/* Authentication from .env */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const weatherToken = process.env.WEATHER_AUTH_TOKEN;
const fromMobile = process.env.FROM_MOBILE;

const readlineSync = require('readline-sync');
const readline = require('readline');

start();

async function start() {
    await askQuestions();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function askQuestions() {
    // Ask for city, and wait for user's response
    let city = readlineSync.question('Which city would you like the weather for (e.g. Melbourne, AU)? ');

    // Ask for mobile, and wait for user's response
    let mobile = readlineSync.question('What is your mobile number? ');

    // Validate the mobile number and send using Twilio
    await validateAndSend(mobile, city);

    // Sleep while we wait for the response and transaction ID
    await sleep(4500);

    // Ask use to send to another mobile, and wait for user's response
    let repeat = readlineSync.question('Send to another mobile number? Y for yes, N for no?');

    if (repeat.toLowerCase() == 'y') {
        // Repeat
        await askQuestions();
    }
}

async function validateAndSend(mobile, city) {
    // Get user's IP address information using ipinfo and google-libphonenumber
    const ipInfo = require("ipinfo")
    ipInfo().then(async cLoc => {
        const obj = JSON.parse(JSON.stringify(cLoc));
        let country = obj.country;
        let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
            , PNF = require('google-libphonenumber').PhoneNumberFormat;
        let intMobile = phoneUtil.parse(mobile, country);

        // Twilio requires the mobile in PNF international format however the user will likely enter their number in their local format
        console.log('International Number = ' + phoneUtil.format(intMobile, PNF.INTERNATIONAL));

        // Verify if the mobile number is valid before sending
        if (phoneUtil.isValidNumber(intMobile)) {
            await sendMessage(phoneUtil.format(intMobile, PNF.INTERNATIONAL), city);
        } else {
            console.Log('Mobile number entered is not valid');
        }
    }).catch(console.error)
}

async function sendMessage(mobile, city) {
    // get the weather
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherToken}`

    var message = '';

    const request = require('request');
    request(url, function (err, response, body) {
        if (err) {
            console.log('error:', error);
            message = "Could not get weather for " + city;
            console.log(message);
            return message;
        } else {
            let weather = JSON.parse(body);
            message = `It's ${Math.round(weather.main.temp - 273.15)} degrees in ${weather.name}!`; // original value is in kelvin, convert to degrees celcius
            console.log(message);
        }
    });

    await sleep(1500);

    // Create Twilio client and send the SMS
    const twilio = require('twilio');
    const client = new twilio(accountSid, authToken);

    mobile = mobile.toString();
    mobile = mobile.replace(/\s/g, '');

    client.messages
        .create({
            body: message,
            to: mobile, // Text this number
            statusCallback: 'http://149.28.176.193:8080/Home/PostStatus', // For demo purposes I am providing a working status callback URL
            from: fromMobile, // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
}