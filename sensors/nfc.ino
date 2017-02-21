#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <PN532_SPI.h>
#include "PN532.h"
#include "FastLED.h"


const char* ssid     = "Familab";
const char* password = "##########";
const char* mqtt_server = "192.168.11.148";
#define NUM_LEDS 16
#define DATA_PIN 5

PN532_SPI pn532spi(SPI, 2);
PN532 nfc(pn532spi);
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
CRGB leds[NUM_LEDS];

void setup() {
  Serial.begin(9600);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  LEDS.addLeds<WS2812,DATA_PIN,RGB>(leds,NUM_LEDS);
  LEDS.setBrightness(25);

  for(int led = 0; led < NUM_LEDS; led++) {
    leds[led] = CRGB::Green;
  }
  FastLED.show();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1); // halt
  }

  // Got ok data, print it out!
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX);
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);

  // Set the max number of retry attempts to read from a card
  // This prevents us from waiting forever for a card, which is
  // the default behaviour of the PN532.
  nfc.setPassiveActivationRetries(0x10);

  // configure board to read RFID tags
  nfc.SAMConfig();

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    for(int led = 0; led < NUM_LEDS; led++) {
      leds[led] = CRGB::Green;
    }
    FastLED.show();
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
      for(int led = 0; led < NUM_LEDS; led++) {
        leds[led] = CRGB::Red;
      }
      FastLED.show();
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void fadeall() { for(int i = 0; i < NUM_LEDS; i++) { leds[i].nscale8(250); } }

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  boolean success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)

  // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
  // 'uid' will be populated with the UID, and uidLength will indicate
  // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);

  if (success) {
    Serial.println("Found a card!");
    Serial.print("UID Length: ");Serial.print(uidLength, DEC);Serial.println(" bytes");
    Serial.print("UID Value: ");
    for (uint8_t i=0; i < uidLength; i++)
    {
      Serial.print(" 0x");Serial.print(uid[i], HEX);
    }
    Serial.println("");
    for(int led = 0; led < NUM_LEDS; led++) {
      leds[led] = CRGB::Yellow;
    }
    FastLED.show();

    client.publish("nfcTopic", uid, uidLength);

    // wait until the card is taken away
    while (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength)) {}
    for(int led = 0; led < NUM_LEDS; led++) {
      leds[led] = CRGB::Red;
    }
    FastLED.show();
  }
}
