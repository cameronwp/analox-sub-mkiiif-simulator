# Analox Sub MK III F Simulator

Outputs randomly generated output that looks the same as COM output on the Analox Sub MK III F sensor, according to [its manual](https://www.analoxsensortechnology.com/gfiles/Sub%20MkIIIF%20(ASF3)/8xx%20-%20Reference%20Documents/ASF3-800%20%20%20Sub%20MkIIIF%20User%20Manual%20.pdf) (pg 51).

In case something ever happens to the manual, here's the relevant specification:

> PL1 COMM0 on each Operator Console provides an RS232 data output connection if
it is required to capture and log the instrument status. No data connection
should be made back to the Analox system to avoid interference from unexpected
data sources. Data messages will typically be sent at least once every 5 seconds
for each chamber, although this can be set to be 1s, 5s, 15s, 30s, 60s, 120s,
300s.

> All transmitted data is in ASCII printable characters, communicated at 9600
baud, 1 start bit, 8 data bits, no parity, 1 stop bit, no hardware handshaking,
with a terminating carriage return character (ASCII #13). A comma (#44) and a
space character (#32) delimit each field within the message. Each message is
preceded by a start character (>) and a date and time stamp. There is no comma
between the date and time, as this allows the date and time field to be imported
to an Excel spreadsheet as a combined date and time field. Each message contains
a checksum to validate the data within the message. A 4 digit ASCII checksum
(0000-FFFF hex) is intended as a straight summation of each of the characters in
the message (excluding the checksum itself).

> ### Typical Monitoring System Operator Console Outputs

```
>13-OCT-2006 12:21:37, ID=REM 1, pO2=1.024, CO2=0.001, P= 0.2, ST=Af, CK=xxxx
>13-OCT-2006 12:21:37, ID=REM 2, T= 24.8, H1= 9, ST=Af, CK=xxxx
```

| Key  | Value                                                   |
| ---- | ------------------------------------------------------- |
| >    | Start character followed by date/time stamp             |
| ID   | ID=REM1 or ID=REM2 to indicate the source of the data.  |
| %O2  | Oxygen reading in %O2 (when enabled)                    |
| pO2  | Oxygen reading in partial pressure (mBar pO2)           |
| CO2  | CO2 reading (mBar pCO2)                                 |
| P    | Pressure in MSW                                         |
| T    | Chamber Ambient Temperature in ºC (REM2)                |
| H    | Humidity in %RH                                         |
| ST   | Alarm Status – A/a=Alarm/no alarm, F/f=Fault/no fault   |
| CK   | Checksum                                                |
| CR   | ASCII Carriage Return terminator                        |

## Usage

### Install
```sh
nvm use
npm i
```

You'll also need to install `socat` to create the virtual ports.

Mac: `brew install socat`

Ubuntu Linux: `sudo apt-get install socat`

Windows: [Maybe this](https://github.com/StudioEtrange/socat-windows)? (I haven't tried.)

### Run

```sh
npm run start
```

The first thing that happens is we link to a temporary virtual port on `/tmp/tty1`. We're solely using it as a writer. Open another terminal and read from the "reader" port (`/tmp/tty2`) with:

```sh
cat < /tmp/tty2
```

You should see values outputted every 5 seconds.
