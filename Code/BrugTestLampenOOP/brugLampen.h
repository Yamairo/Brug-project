#ifndef BRUGLAMPEN_H
#define BRUGLAMPEN_H

#define pin_53 PB0
#define pin_51 PB2
#define pin_50 PB3
#define pin_48 PL1
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
};
#endif
