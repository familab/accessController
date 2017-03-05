/**
 * ESP8266 based 16 Port Relay Controller
 *
 * Listens to MQTT server and turns on and off relays
 * Remote Reset
 * Wifi Management/Reconnect/Watchdog
 * MQTT Reconnect/Watchdog
 * Heartbeat to MQTT
 * Report RSSI to MQTT
 * Report VCC to MQTT
 */
#define DEBUG

#include "everyMillis.h"
#include <Wire.h>
#include <Adafruit_MCP23017.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WIFI Config
const char* ssid     = "FamiLAB";
const char* password = "XXXXXX";

// MQTT Config
const char* mqtt_server         = "mqtt.familab.org";
const uint16_t mqtt_port        = 1883;
const char* mqtt_username       = "RELAY";
const char* mqtt_password       = "XXXXXX";
const char* mqtt_accounce_topic = "announce";
const char* mqtt_heartbeat_topic = "heartbeat";

// LED Globals
bool state = false;

// Wifi Globals
char mac[18];

// Module Setup
Adafruit_MCP23017 mcp;
WiFiClient espClient;
PubSubClient client(espClient);
ADC_MODE(ADC_VCC);

// MQTT functions
void mqtt_processMessage(char* topic, byte* payload, uint8_t length) {
  #if defined DEBUG
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
      Serial.print((char)payload[i]);
    }
    Serial.println();
  #endif

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(payload);

  #if defined DEBUG
    root.printTo(Serial);
    Serial.println();
  #endif

  if (!root.success()) {
    #if defined DEBUG
      Serial.println("parseObject() failed");
    #endif
    return;
  }

  if(root.containsKey("command")) {
    const char* command = root["command"];
    String commandString = String(command);
    if(commandString == "reboot") {
      ESP.restart();
    }
  }

  if(root.containsKey("controlChannel")) {
    if(root.containsKey("state")) {
      uint8_t channel = root["controlChannel"];
      channel --;
  
      bool state = root["state"];

      #if defined DEBUG
        Serial.println("Writing to Channel " + String(channel) + " the value " + String(state));

      #endif

      mcp.digitalWrite(channel, state);
    }
  }
}

void mqtt_publish(const char* topic, String payload) {
  char buffer[128];
  payload.toCharArray(buffer, 128);

  #if defined DEBUG
    Serial.print("Message sent [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < strlen(buffer); i++) {
      Serial.print((char)buffer[i]);
    }
    Serial.println();
  #endif

  client.publish(topic, buffer, strlen(buffer));
}

void heartbeat(bool force) {
  if(force) {
    sendHeartbeat();
  } else {
    heartbeat();
  }
}

void heartbeat() {
  EVERY_N_MILLISECONDS(5000) {
    sendHeartbeat();
  }
  EVERY_N_MILLISECONDS(500) {
    digitalWrite(LED_BUILTIN, state);
    state = !state;
  }
}

void sendHeartbeat() {
  mqtt_publish(mqtt_heartbeat_topic, "{\"id\": \"" + String(mac) + "\", \"rssi\": " + WiFi.RSSI() + ", \"vcc\": " + ESP.getVcc()/1024.00f + "}");
}

// Setup
void setup() {
  #if defined DEBUG
    Serial.begin(9600);
//    Serial.setDebugOutput(true);
  #endif

  // Setup LED
  pinMode(LED_BUILTIN, OUTPUT);

  // Setup Wifi
  WiFi.mode(WIFI_STA);
  char macAddress[6];
  WiFi.macAddress((byte*)macAddress);
  sprintf(mac, "%X:%X:%X:%X:%X:%X", macAddress[5], macAddress[4], macAddress[3], macAddress[2], macAddress[1], macAddress[0]);

  #if defined DEBUG
    Serial.print(F("MAC Address "));
    Serial.println(mac);
    Serial.print(F("Connecting to "));
    Serial.println(ssid);
  #endif

  WiFi.begin(ssid, password);

  // Setup MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqtt_processMessage);

  // Setup Outputs
  mcp.begin();
  mcp.pinMode(0, OUTPUT);
  mcp.pinMode(1, OUTPUT);
  mcp.pinMode(2, OUTPUT);
  mcp.pinMode(3, OUTPUT);
  mcp.pinMode(4, OUTPUT);
  mcp.pinMode(5, OUTPUT);
  mcp.pinMode(6, OUTPUT);
  mcp.pinMode(7, OUTPUT);
  mcp.pinMode(8, OUTPUT);
  mcp.pinMode(9, OUTPUT);
  mcp.pinMode(10, OUTPUT);
  mcp.pinMode(11, OUTPUT);
  mcp.pinMode(12, OUTPUT);
  mcp.pinMode(13, OUTPUT);
  mcp.pinMode(14, OUTPUT);
  mcp.pinMode(15, OUTPUT);
}

// Loops
void mqttLoop() {
  client.loop();
  switch(client.state()) {
    case MQTT_CONNECTED:
      break;

    case MQTT_CONNECTION_TIMEOUT:
    case MQTT_CONNECTION_LOST:
    case MQTT_CONNECT_FAILED:
    case MQTT_DISCONNECTED:
    case MQTT_CONNECT_BAD_PROTOCOL:
    case MQTT_CONNECT_BAD_CLIENT_ID:
    case MQTT_CONNECT_UNAVAILABLE:
    case MQTT_CONNECT_BAD_CREDENTIALS:
    case MQTT_CONNECT_UNAUTHORIZED:
    default:
      #if defined DEBUG
        Serial.println(F("Attempting MQTT connection..."));
      #endif

      if(client.connect((char*)mac, mqtt_username, mqtt_password)) {
        #if defined DEBUG
          Serial.print(F("Connected to "));
          Serial.println(mqtt_server);
        #endif
        client.subscribe((char*)mac);
        mqtt_publish(mqtt_accounce_topic, "{\"id\": \"" + String(mac) + "\"}");
        heartbeat(true);
      } else {
        #if defined DEBUG
          Serial.print(F("failed, rc="));
          Serial.println(client.state());
        #endif
      }
      break;
  }
  heartbeat();
}

void loop() {
  switch(WiFi.status()) {
    case WL_CONNECTED:
      mqttLoop();
      break;

    case WL_CONNECTION_LOST:
      #if defined DEBUG
        Serial.println(F("Wifi Connection Lost"));
        WiFi.printDiag(Serial);
      #endif
      ESP.restart();
      break;

    case WL_CONNECT_FAILED:
      #if defined DEBUG
        Serial.println(F("Unable to connect to Wifi"));
      #endif
      ESP.restart();
      break;

    case WL_NO_SSID_AVAIL:
      #if defined DEBUG
        Serial.println(F("WiFi SSID is not avaliable"));
      #endif
      ESP.restart();
      break;

    case WL_NO_SHIELD:
      #if defined DEBUG
        Serial.println(F("WiFi shield not present"));
      #endif
      ESP.restart();
      break;

    case WL_DISCONNECTED:
    case WL_IDLE_STATUS:
    case WL_SCAN_COMPLETED:
      break; //ignore state

    default:
      #if defined DEBUG
        Serial.println(F("Wifi Error"));
        Serial.println(WiFi.status());
      #endif
      ESP.restart();
      break;
  }
}
