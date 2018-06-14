const SerialPort = require('serialport');
const port = new SerialPort('/tmp/tty1');
const loop = require('./loop')(port);

port.on('error', console.error);
port.on('open', loop);
