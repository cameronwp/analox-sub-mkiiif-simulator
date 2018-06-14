const moment = require('moment');
const INTERVAL = 5000;

/**
 * Create the initial base with datetime.
 * @returns {string} `> DD-MON-YYYY HH:MM:SS`
 */
function getBase() {
  return '>' + moment().format('DD-MMM-YYYY HH:MM:ss').toUpperCase();
}

/**
 * Generate a random number given some conditions.
 * @param {number} min integer
 * @param {number} max integer
 * @param {number} precision integer
 * @returns {number} float
 */
function random(min = 0, max = 100, precision = 2) {
  return (Math.random() * (max - min) + min).toFixed(precision);
}

/**
 * Generate a simple checksum.
 * @param {string} str
 * @returns {string} a zero padded 4 digit hex checksum
 */
function checksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum = sum + str[i].charCodeAt(0);
  }
  return sum.toString(16).padStart(4, '0');
}

/**
 * Generate a line of the message from given values.
 * @param {string[]} values
 * @returns {string} message with datetime, checksum
 */
function message(...values) {
  // TODO: randomly cap, lower 'a' and 'f'
  const data = [ getBase(), ...values, 'ST=Af' ].join(', ');
  const ck = checksum(data);

  return `${data}, CK=${ck}\n`;
}

/**
 * Generate message with REM 1 values.
 * @returns {string}
 */
function rem1() {
  return message(
    'ID=REM 1',
    `pO2=${random()}`,
    `CO2=${random(0, 1, 3)}`,
    `P=${random(15, 25, 1)}`
  )
}

/**
 * Generate message with REM 2 values.
 * @returns {string}
 */
function rem2() {
  return message(
    'ID=REM 2',
    `T=${random(15, 35, 1)}`,
    `H1=${random(0, 100, 2)}`
  )
}

/**
 * 50:50 odds for order of REM1 and REM2 in output.
 * @param {SerialPort} port
 */
function write(port) {
  if (Math.random() > 0.5) {
    port.write(rem1());
    port.write(rem2());
  } else {
    port.write(rem2());
    port.write(rem1());
  }
}

/**
 * Immediately write to the port, and then write every INTERVAL seconds.
 * @param {SerialPort} port
 */
function loop(port) {
  return function() {
    write(port);
    setInterval(() => {
      write(port);
    }, INTERVAL)
  }
}

module.exports = loop;
