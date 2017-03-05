/**
 * ESP8266 based NFC Sensor
 *
 * Reads NFC Tags and reports them to the MQTT server
 * (Future) Does challenge response with FamiLAB Arduino App
 * Displays Feedback via LED Ring
 * Remote State Control
 * Remote Reset
 * Wifi Management/Reconnect/Watchdog
 * MQTT Reconnect/Watchdog
 * Heartbeat to MQTT
 * Report RSSI to MQTT
 * Report VCC to MQTT
 */
//#define DEBUG

#include <FastLED.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <PN532_SPI.h>
#include <PN532.h>
#include <NfcAdapter.h>
#include <ArduinoJson.h>

// WIFI Config
const char* ssid     = "FamiLAB";
const char* password = "XXXXXX";

// MQTT Config
const char* mqtt_server         = "mqtt.familab.org";
const uint16_t mqtt_port        = 1883;
const char* mqtt_username       = "NFC";
const char* mqtt_password       = "XXXXXX";
const char* mqtt_accounce_topic = "announce";
const char* mqtt_heartbeat_topic = "heartbeat";
const char* mqtt_sensor_topic   = "nfc";

// LED Config
#define NUM_LEDS 16
#define LED_DT 5
#define MAX_BRIGHT 255

// NFC Config
#define NFC_SS_PIN 2
#define NFC_TIMEOUT 100

// Wifi Globals
char mac[18];

// NFC Globals
bool newTag = false;

// LED Globals
struct CRGB leds[NUM_LEDS];
enum animation {
  solid_black, //0
  solid_blue, //1
  solid_green, //2
  solid_red, //3
  solid_yellow, //4
  twist_blue, //5
  twist_green, //6
  twist_red, //7
  twist_yellow, //8
  pulse_corners_blue, //9
  pulse_corners_green, //10
  pulse_corners_red, //11
  pulse_corners_yellow, //12
  pulse_blue, //13
  pulse_green, //14
  pulse_yellow, //15
  pulse_red,  //16
  cylon_blue, //17
  cylon_red, //18
  cylon_green, //19
  cylon_yellow, //20
};

animation state = cylon_red;

// Colors
CRGB blue = CRGB(11, 139, 196);
CRGB yellow = CRGB::Yellow;
CRGB green = CRGB::Green;
CRGB red = CRGB::Red;
CRGB black = CRGB::Black;

// Animation Vars
uint8_t position1 = 0;
uint8_t position2 = NUM_LEDS/4;
uint8_t position3 = NUM_LEDS/2;
uint8_t position4 = NUM_LEDS/4*3;
uint8_t steps = 0;
bool directionUp = false;

// Module Setup
PN532_SPI pn532spi(SPI, NFC_SS_PIN);
NfcAdapter nfc = NfcAdapter(pn532spi);
WiFiClient espClient;
PubSubClient client(espClient);
ADC_MODE(ADC_VCC);

// Animation Functions
void switchState(animation newState) {
  if(state == newState) {
    return;
  }

  #if defined DEBUG
    Serial.print(F("Switching to animation "));
    Serial.println(newState);
  #endif

  position1 = 0;
  position2 = NUM_LEDS/4;
  position3 = NUM_LEDS/2;
  position4 = NUM_LEDS/4*3;
  steps = 0;
  state = newState;
}

void pulse(CRGB color) {
  if(steps == 12) {
    directionUp = false;
  }
  if(steps == 0) {
    directionUp = true;
  }

  fill_solid(leds, NUM_LEDS, color);
  fadeToBlackBy(leds, NUM_LEDS, 256-((21*steps) + 4));
  FastLED.show();

  if(directionUp) {
    steps++;

  } else {
    steps--;
  }
}

void cylon(CRGB color) {
  if(steps == 0){
    steps = random8(NUM_LEDS * .75 , NUM_LEDS * 2);
    directionUp = !directionUp;
  }
  steps--;

  leds[position1] = color;
  FastLED.show();
  fadeToBlackBy(leds, NUM_LEDS, 64);

  if(directionUp) {
    position1++;
    if(position1 == NUM_LEDS) {
      position1 = 0;
    }
  } else {
    position1--;
    if(position1 == 255) {
      position1 = NUM_LEDS - 1;
    }
  }
}

void pulse_corners(CRGB color) {
  if(steps == 12) {
    directionUp = false;
  }
  if(steps == 0) {
    directionUp = true;
  }

  leds[position1] = color;
  leds[position2] = color;
  leds[position3] = color;
  leds[position4] = color;
  fadeToBlackBy(leds, NUM_LEDS, 256-((21*steps) + 4));
  FastLED.show();

  if(directionUp) {
    steps++;

  } else {
    steps--;
  }
}

void twist(CRGB color) {
  if(steps == 0){
    steps = random8(NUM_LEDS * .75 , NUM_LEDS * 2);
    directionUp = !directionUp;
  }
  steps--;

  leds[position1] = color;
  leds[position2] = color;
  leds[position3] = color;
  leds[position4] = color;
  FastLED.show();
  fadeToBlackBy(leds, NUM_LEDS, 128);

  if(directionUp) {
    position1++;
    position2++;
    position3++;
    position4++;
    if(position1 == NUM_LEDS) {
      position1 = 0;
    }
    if(position2 == NUM_LEDS) {
      position2 = 0;
    }
    if(position3 == NUM_LEDS) {
      position3 = 0;
    }
    if(position4 == NUM_LEDS) {
      position4 = 0;
    }
  } else {
    position1--;
    position2--;
    position3--;
    position4--;
    if(position1 == 255) {
      position1 = NUM_LEDS - 1;
    }
    if(position2 == 255) {
      position2 = NUM_LEDS - 1;
    }
    if(position3 == 255) {
      position3 = NUM_LEDS - 1;
    }
    if(position4 == 255) {
      position4 = NUM_LEDS - 1;
    }
  }
}

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

  if(root.containsKey("animation")) {
    const char* animation = root["animation"];
    String animationString = String(animation);
  
    if(animationString == "solid_black") {
      switchState(solid_black);
    } else if (animationString == "solid_green") {
      switchState(solid_green);
    } else if (animationString == "solid_red") {
      switchState(solid_red);
    } else if (animationString == "solid_yellow") {
      switchState(solid_yellow);
    } else if (animationString == "twist_blue") {
      switchState(twist_blue);
    } else if (animationString == "twist_green") {
      switchState(twist_green);
    } else if (animationString == "twist_red") {
      switchState(twist_red);
    } else if (animationString == "twist_yellow") {
      switchState(twist_yellow);
    } else if (animationString == "pulse_corners_blue") {
      switchState(pulse_corners_blue);
    } else if (animationString == "pulse_corners_green") {
      switchState(pulse_corners_green);
    } else if (animationString == "pulse_corners_red") {
      switchState(pulse_corners_red);
    } else if (animationString == "pulse_corners_yellow") {
      switchState(pulse_corners_yellow);
    } else if (animationString == "pulse_blue") {
      switchState(pulse_blue);
    } else if (animationString == "pulse_green") {
      switchState(pulse_green);
    } else if (animationString == "pulse_yellow") {
      switchState(pulse_yellow);
    } else if (animationString == "pulse_red") {
      switchState(pulse_red);
    } else if (animationString == "cylon_blue") {
      switchState(cylon_blue);
    } else if (animationString == "cylon_red") {
      switchState(cylon_red);
    } else if (animationString == "cylon_green") {
      switchState(cylon_green);
    } else if (animationString == "cylon_yellow") {
      switchState(cylon_yellow);
    } else {}
  } else if(root.containsKey("command")) {
    const char* command = root["command"];
    String commandString = String(command);
    if(commandString == "reboot") {
      ESP.restart();
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

  // Setup LEDs
  LEDS.addLeds<WS2812, LED_DT, GRB>(leds, NUM_LEDS).setCorrection(TypicalSMD5050).setTemperature(DirectSunlight);
  FastLED.setBrightness(MAX_BRIGHT);
  set_max_power_in_volts_and_milliamps(3.3, 500); // 3.3V, 500mA.

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

  // Setup NFC
  #if defined DEBUG
    nfc.begin(true);
  #else
    nfc.begin();
  #endif

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqtt_processMessage);
}

// Loops
void readerLoop() {
  if (nfc.tagPresent(NFC_TIMEOUT)) {
    if(newTag) {
      #if defined DEBUG
        Serial.println(F("Tag Present"));
      #endif
      if(state == cylon_blue) {
        switchState(pulse_corners_blue);
      }

      NfcTag tag = nfc.read();
//      tag.print();

      byte uid[7] = {0,0,0,0,0,0,0};
      uint8_t uidLength = tag.getUidLength();
      tag.getUid(uid, uidLength);

      String uidString = "";

      for (int i = 0; i < uidLength; i++) {
        if (uid[i] < 0xF)
        {
            uidString += "0";
        }
        uidString += String((unsigned int)uid[i], (unsigned char)HEX);
      }
      uidString.toUpperCase();

      if(state == pulse_corners_blue) {
        switchState(twist_blue);
      }

      mqtt_publish(mqtt_sensor_topic, "{\"id\": \"" + String(mac) + "\", \"uid\": \"" + uidString + "\"}");
      newTag = false;
    }
  } else {
    newTag = true;
    if(state == twist_blue) {
      switchState(cylon_blue);
    }
  }
}

void animationLoop() {
  switch(state) {
    case solid_black:
      EVERY_N_MILLISECONDS(10) {
        fadeToBlackBy(leds, NUM_LEDS, 64);
        FastLED.show();
      }
      break;
    case solid_blue:
      EVERY_N_MILLISECONDS(10) {
        fill_solid(leds, NUM_LEDS, blue);
        FastLED.show();
      }
      break;
    case solid_green:
      EVERY_N_MILLISECONDS(10) {
        fill_solid(leds, NUM_LEDS, green);
        FastLED.show();
      }
      break;
    case solid_red:
      EVERY_N_MILLISECONDS(10) {
        fill_solid(leds, NUM_LEDS, red);
        FastLED.show();
      }
      break;
    case solid_yellow:
      EVERY_N_MILLISECONDS(10) {
        fill_solid(leds, NUM_LEDS, yellow);
        FastLED.show();
      }
      break;
    case twist_blue:
      EVERY_N_MILLISECONDS(75) {
        twist(blue);
      }
      break;
    case twist_green:
      EVERY_N_MILLISECONDS(75) {
        twist(green);
      }
      break;
    case twist_red:
      EVERY_N_MILLISECONDS(75) {
        twist(red);
      }
      break;
    case twist_yellow:
      EVERY_N_MILLISECONDS(75) {
        twist(yellow);
      }
      break;
    case pulse_corners_blue:
      EVERY_N_MILLISECONDS(10) {
        pulse_corners(blue);
      }
      break;
    case pulse_corners_green:
      EVERY_N_MILLISECONDS(10) {
        pulse_corners(green);
      }
      break;
    case pulse_corners_red:
      EVERY_N_MILLISECONDS(10) {
        pulse_corners(red);
      }
      break;
    case pulse_corners_yellow:
      EVERY_N_MILLISECONDS(10) {
        pulse_corners(yellow);
      }
      break;
    case pulse_blue:
      EVERY_N_MILLISECONDS(10) {
        pulse(blue);
      }
      break;
    case pulse_green:
      EVERY_N_MILLISECONDS(10) {
        pulse(green);
      }
      break;
    case pulse_yellow:
      EVERY_N_MILLISECONDS(10) {
        pulse(yellow);
      }
      break;
    case pulse_red:
      EVERY_N_MILLISECONDS(10) {
        pulse(red);
      }
      break;
    case cylon_blue:
      EVERY_N_MILLISECONDS(10) {
        cylon(blue);
      }
      break;
    case cylon_red:
      EVERY_N_MILLISECONDS(10) {
        cylon(red);
      }
      break;
    case cylon_green:
      EVERY_N_MILLISECONDS(10) {
        cylon(green);
      }
      break;
    case cylon_yellow:
      EVERY_N_MILLISECONDS(10) {
        cylon(yellow);
      }
      break;
    default:
      EVERY_N_MILLISECONDS(10) {
        fadeToBlackBy(leds, NUM_LEDS, 64);
        FastLED.show();
      }
      break;
  }
}

void mqttLoop() {
  client.loop();
  switch(client.state()) {
    case MQTT_CONNECTED:
      if(state == cylon_yellow) {
        switchState(cylon_blue);
      }
      readerLoop();
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
      switchState(cylon_yellow);
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
  animationLoop();

  switch(WiFi.status()) {
    case WL_CONNECTED:
      if(state == cylon_red) {
        switchState(cylon_yellow);
      }
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
