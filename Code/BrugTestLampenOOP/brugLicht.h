#ifndef BRUGLICHT_H
#define BRUGLAMPEN_H

#include <avr/io.h>

class brugLampen{
public:
    bruglampen();
    ~bruglampen();
    void init();
    void doorvaartVerbieden();
    void aanstondsToestaan();
    void doorvaartToestaan();
    void doorVaartverbiedenBrugOpen();
    void doorvaartToestaanGeslotenBrugTweerichting();
    void doorvaartToestaanGeslotenBrugEenrichting();
private:
    brugLampen brugLampen;
    test_delay = 1000;
    pin_53 = PB0;
    pin_51 = PB2;
    pin_50 = PB3;
    pin_48 = PL1;
};
#endif
