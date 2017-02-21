# Goals with this project:

* Access Control system
* Reusable IOT system
* Separation of concerns
* Enable people with different skill sets to work on the project

# High level overview:

There are 2 networks and one controller. One network is the sensor network and one network is the control network. I recommend logically separating these with vlan's. Sensors, controls and the controller connect to a mqtt server for messaging.

In FamiLAB's case we have it configured as follows:

FamiLAB-Sensor (Hidden Wifi 10.10.10.0/24, Vlan 10)
FamiLAB-Control (Hidden Wifi 10.10.20.0/24, Vlan 20)
Admin (Wired only, 10.10.100.0/24, Vlan 100)

All sensors are connected to the FamiLAB-Sensor wifi or are wired into the same Vlan. And controls are connected the same to the FamiLAB-Control network.

The MQTT server (mosquito) exists on the admin network and firewall rules are setup to allow both the sensor network and the control network to access it. MQTT is configured with a username and password for the sensor topics and a separate username and password for the control topics.

NodeRed (nodered.org) is setup on the admin network and is only able to talk to the mqtt server, the internet and to admin's who are vpn'd in.

Sensors push raw data to mqtt with no processing and only formatting (JSON). NodeRed processes this data, performs any processing, logic and anything else that is needed and pushes specially coded commands back to mqtt for feedback on the sensors (red light for denied for example) and control commands to the control systems (lock/unlock). Again the control systems are extremely simple and have minimal logic.

A typical workflow for access control is:

Sensor boots, connects to mqtt, is ready to read NFC cards.
NFC card is present, sensor reads it, formats the UID into a JSON packet with information like which sensor and sends it to the NfcTopic on the mqtt server.
NodeRed receives the data from the NfcTopic, preforms logic to decide is access is allowed, assuming it is, tells the sensor to turn blue (open), tells the door to unlock, waits 5 seconds, tells the sensor to turn green (ready to read), tells the door to lock.
Sensor and Door control receive both commands and perform their actions.

# Wiring

Parts: ESP8266, Neopixel Ring, Elechouse NFC v3

The NFC is connected via SPI with SS on pin D4 (2), MOSI to pin D7, MISO to pin D6, SCK to pin D5, Vcc to 3.3v, Gnd to Gnd.
The neopixel ring is connected to D1 (5) with a 1k resistor inline and diode inline, Gnd to Gnd, and Vcc to 3.3v with a capacitor in between Vcc and Gnd.
