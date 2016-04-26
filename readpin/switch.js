/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)

// The program is using the Node.js built-in `fs` module
// to load the config.json and any other files needed
var fs = require("fs");

// The program is using the Node.js built-in `path` module to find
// the file path to needed files on disk
var path = require("path");

var datastore = require("./datastore");
var mqtt = require("./mqtt");

var config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config.json"))
);


var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var myOnboardLed = new m.Gpio(13); //LED hooked up to digital pin 13 (or built in pin on Intel Galileo Gen2 as well as Intel Edison)
myOnboardLed.dir(m.DIR_OUT); //set the gpio direction to output
var ledState = true; //Boolean to hold the state of Led

var myDigitalPin = new m.Gpio(26); //setup digital read on pin 26 UART-1-RX
myDigitalPin.dir(m.DIR_IN); //set the gpio direction to input

periodicActivity(); //call the periodicActivity function

function periodicActivity() //
{
  var myDigitalValue =  myDigitalPin.read(); //read the digital value of the pin
  console.log('Gpio is ' + myDigitalValue +' '+Date()); //write the read value out to the console
  log("switch level is "+ myDigitalValue);
  setTimeout(periodicActivity,1000); //call the indicated function after 1 second (1000 milliseconds)
  
  myOnboardLed.write(myDigitalValue?1:0); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
    
}

// Store record in the remote datastore and/or mqtt server
// when access control event has occurred
function log(event) {
  var msg = new Date().toISOString() + " " + event;
  console.log(msg);

  var payload = { value: msg };
  datastore.log(config, payload);
  mqtt.log(config, payload);
}



  




/*
var mraa = require('mraa');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printUsage() {
    console.log("version         Print version");
    console.log("get pin         Get pin level");
    console.log("set pin level   Set pin level");
    console.log("monitor pin     Monitor pin level changes");
}

function getVersion() {
    console.log('MRAA Version: ' + mraa.getVersion());
}

function setPin() {
    var pinNumber = arguments[0];
    var pinValue = arguments[1];
    var pin = new mraa.Gpio(pinNumber);
    pin.dir(mraa.DIR_OUT);
    pin.write(pinNumber, pinValue);
}

function getPin() {
    var pinNumber = arguments[0];
    var pin = new mraa.Gpio(pinNumber);
    pin.dir(mraa.DIR_IN);
    console.log('Gpio ' + pinNumber + ' = ' + pin.read());
}

function onPinLevelChange() {
    console.log('gpio level change');
}

function monitorPin() {
    var pinNumber = arguments[0];
    try {
        var pin = new mraa.Gpio(pinNumber);
        pin.dir(mraa.DIR_IN);
        pin.isr(mraa.EDGE_BOTH, onPinLevelChange);
        rl.question('Press ENTER to stop', function(answer) {
            rl.close();
            pin.isrExit();
        });
    } catch (err) {
     console.log(err.message);
    }
}

getPin(45);

const args = process.argv;
const argc = args.length;
if (argc >= 3) {
    const cmd = args[2];
    switch (args[2]) {
    case "version":
        getVersion();
        break;
    case "get":
        var pinNumber = parseInt(args[3]);
        getPin(pinNumber);
        break;
    case "set":
        var pinNumber = parseInt(args[3]);
        var pinValue = parseInt(args[4]);
        getPin(pinNumber, pinValue);
        break;
    case "monitor":
        var pinNumber = parseInt(args[3]);
        monitorPin(pinNumber);
        break;
    default:
        console.log("Invalid command " + args[2]);
        break;
    }
} else {
    console.log("Command not specified");
    printUsage();
}

*/
