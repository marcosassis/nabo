#include "nabo_server.h"
#include <Adafruit_PCD8544.h>

using namespace nabo;

static const unsigned char PROGMEM splash[] =
{ B00000000,B00000000,B00000000,B00000000,B00000000,B11000001,B10000000,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00000000,B11100111,B10000000,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00000000,B10111101,B10000000,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00000000,B10011101,B10000000,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B11000000,B11001001,B11111111,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B01111111,B11111001,B10000001,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00111101,B11111000,B00000001,B00000000,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00110000,B00111100,B00001111,B10001100,B00000000,B00000000,
  B00000000,B00000000,B00000000,B00000000,B00100000,B00000111,B11111100,B01111000,B00000000,B00000000,
  B00000000,B00000000,B00000111,B00000001,B11100000,B00000001,B10000000,B00111110,B00000000,B00000000,
  B00000000,B00000000,B00000111,B10000111,B11100000,B00000001,B10000000,B01100111,B10000000,B00000000,
  B00000000,B00000000,B00000010,B10001111,B10000110,B00000001,B10000000,B00000001,B10000000,B00000000,
  B00000000,B00000000,B00000011,B11011100,B00111111,B10000001,B11000000,B00000000,B11000000,B00000000,
  B00000000,B00000000,B00000000,B01111111,B10111100,B11010001,B11000010,B00000000,B01000000,B00000000,
  B00000000,B00000001,B11100001,B11000000,B11111000,B01111101,B11101111,B10000001,B11100000,B00000000,
  B00000000,B00000001,B11111110,B00000000,B11011100,B01100001,B11111111,B11100000,B00100000,B00000000,
  B00000000,B00000000,B11111100,B00000000,B11000111,B00100000,B01111000,B00100000,B00110001,B11100000,
  B00000000,B00000000,B01110000,B00001100,B00000011,B11100000,B01111000,B01110000,B00010111,B11000000,
  B00000000,B01111101,B11000000,B00011111,B11000001,B11100000,B00111100,B01100000,B00011100,B10000000,
  B00000000,B01111111,B00000000,B11110000,B01100000,B01100000,B00011111,B11110000,B01111001,B10000000,
  B00000000,B00011100,B00000011,B11100000,B00110000,B00111000,B00011111,B01110000,B01110001,B00000000,
  B00000000,B00011000,B00001111,B00000001,B10111000,B00011000,B00000001,B11000000,B11111011,B11000000,
  B00000000,B00010000,B00011110,B00000000,B11111000,B00001110,B00000001,B00000001,B11111100,B01110000,
  B00000000,B00110000,B01111110,B00000001,B11111000,B00000111,B10100000,B00000011,B11111100,B00111000,
  B00000000,B00100000,B11110100,B11000011,B11001110,B00000011,B11110000,B00000110,B00001100,B11100000,
  B00000000,B00100001,B11001100,B11000111,B10000111,B11000000,B11110000,B10001110,B00000010,B01110000,
  B00000000,B00100001,B10001000,B00000111,B00000100,B01100000,B00111111,B11111000,B00000011,B00011000,
  B00000000,B01100111,B10001000,B00000110,B00100100,B00110000,B00100011,B11000000,B00000001,B00000100,
  B00000000,B11000111,B00001000,B00001110,B00111100,B01111100,B00000000,B00000000,B00000000,B10000110,
  B00000000,B10000111,B00001000,B00001100,B00011000,B11111100,B00000000,B00000000,B00000000,B11000010,
  B00000000,B10000111,B00010000,B00011000,B01111000,B00011000,B00000000,B00000000,B00000000,B01111110,
  B00000000,B10000111,B00010000,B11111111,B11110000,B00111000,B00000000,B00000000,B00000000,B01111000,
  B00011100,B10001111,B00010011,B10000000,B00010000,B00110000,B00000000,B00000000,B00000000,B00100000,
  B00011111,B10001100,B00110110,B00000000,B00000000,B01100000,B00000000,B00000000,B00000000,B00100000,
  B00000111,B00001000,B00111100,B00000000,B00000000,B01100000,B00000000,B00000000,B00000000,B00110000,
  B00001100,B00011000,B00101000,B00000100,B00000000,B11100000,B00000000,B00000000,B00000000,B00010000,
  B00001000,B00011000,B00101000,B00000100,B00000000,B10000000,B00000000,B00000000,B00000000,B00010000,
  B01111000,B11110000,B01111100,B00011111,B11111111,B10000000,B00000000,B00000000,B00000000,B00010000,
  B11110001,B11110000,B01111100,B00111111,B11111111,B00000000,B00000000,B00000000,B00000000,B00010000,
  B10000111,B10000000,B00110000,B01111100,B00000000,B00000000,B00000000,B00000000,B00000000,B00010000,
  B10000111,B10000000,B01110000,B11111110,B00000000,B00000000,B00000000,B00000000,B00000000,B00010000,
  B11011101,B10000000,B11110000,B11100111,B00000000,B00000000,B00000000,B00000000,B00000000,B00010000,
  B01110000,B00000001,B10110000,B11110011,B00000000,B00000000,B00000000,B00001100,B00000000,B00010000,
  B00000000,B00000001,B00110000,B11000011,B00000000,B00000000,B01100000,B00001100,B00000000,B00010000,
  B00000000,B00000011,B00010000,B11000011,B00000000,B00000000,B01100000,B00000000,B00000000,B00110000,
  B00000000,B00000010,B00010000,B11000011,B00000000,B00000000,B00000000,B00000000,B00000000,B01100000,
  B00000000,B00000010,B00010000,B11000110,B00000000,B00000000,B00000000,B00000000,B00000000,B11000000,
  B00000000,B00001110,B00010000,B11000111,B00000000,B00000000,B00000000,B00000000,B00000000,B10000000 };

//                                          CLK DIN DC  CE  RST
Adafruit_PCD8544 display = Adafruit_PCD8544(D5, D7, D6, D1, D2);

void setup() {
  Serial.println("hello");
  display.begin();
  display.setContrast(50);
  display.clearDisplay();
  display.drawBitmap(0, 0, splash, 80, 48, 1);
  display.display();

  nabo_server::setup();

  Serial.println("all files:");
  Dir dir = SPIFFS.openDir("/");
  while(dir.next()) {
    Serial.print(dir.fileSize());
    Serial.print("\t");
    Serial.println(dir.fileName());
  }
  Serial.println("end setup");
}

void loop() {
  nabo_server::loop();
  
  static uint32_t chrono = millis();
  static uint8_t buffer48x48[288]; // 48*48/8

  static uint8_t frame = 0;
  static uint8_t robrotim = 0;

  if(millis()-chrono > 1000) {
    chrono = millis();

    String filename = "/";
    filename = filename + (robrotim?robrotim-1?"margarida":"gengibre":"nabo") + "/" + frame + ".bin";
    Serial.println(filename);
    
    File file = SPIFFS.open(filename, "r");
    ++frame %= 4;
    if(frame==0)
      ++robrotim %= 3;
    
    if(!file)
      Serial.print("can't open ");
    else {
      Serial.print("opened ");
      display.clearDisplay();
      file.readBytes((char*)buffer48x48, 288);
      display.drawBitmap(18, 0, buffer48x48, 48, 48, 1);
      display.display();
    }
  }
}
