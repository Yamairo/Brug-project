#include "brugLampen.h"

brugLampen::bruglampen(){}
brugLampen::~bruglampen(){}

void brugLampen::init(){
    /*!
    *Deze functie initialiseerd de pins
    *zodat je niet telkens de DDRB hoeft aan te roepen
    */
    // geel rechts
    DDRB |= (1 << pin_48);
    // geel links
    DDRB |= (1 << pin_50);
    // groen
    DDRB |= (1 << pin_51);
    // rood
    DDRB |= (1 << pin_53);
}

void brugLampen::doorvaartVerbieden(){
    /*!
    *Deze functie zet de rode lichten aan beide kanten aan
    *
    *Dit geeft aan dat er geen verkeer doorheen mag
    */
    PORTB &= ~(1 << pin_51);
    PORTB &= ~(1 << pin_50);
    PORTB &= ~(1 << pin_48);
    PORTB |= (1 << pin_53);
}

void brugLampen::aanstondsToestaan(){
    /*!
    *Deze functie zorgt ervoor dat de rode en groene lichten
    *aan beide kanten aangaan
    *
    *Dit geeft aan dat het verkeer nog niet door mag maar wel alvast kan klaarstaan.
    */
    PORTB &= ~(1 << pin_50);
    PORTB &= ~(1 << pin_48);
    PORTB |= (1 << pin_53);
    PORTB |= (1 << pin_51);
}

void brugLampen::doorvaartToestaan(){
    /*!
    *Deze functie zorgt ervoor dat de groene lichten aangaan
    *aan beide kanten.
    *
    *Dit geeft aan dat er verkeer doorheen mag
    */
    PORTB &= ~(1 << pin_53);
    PORTB &= ~(1 << pin_48);
    PORTB &= ~(1 << pin_50);
    PORTB |= (1 << pin_51);
}

void brugLampen::doorVaartverbiedenBrugOpen(){
    /*!
    *Deze functiee zet de lichten op rood bij een open brug
    *
    *Dit geeft aan dat ondaks dat de brug open is je hier niet doorheen mag varen
    */
    doorvaartVerbieden();
}

void brugLampen::doorvaartToestaanGeslotenBrugTweerichting(){
    /*!
    *Deze functie zorgt ervoor dat de rode lichten aangaan
    *aan beide kanten en één van de gele lichten aangaat.
    *
    *Dit geeft aan dat er verkeer doorheen mag ookal is de brug gesloten,
    *daarnaast geeft dit aan dat er verkeer vanaf de andere kant kan komen.
    */rnaast geeft dit aan dat er verkeer vanaf de andere kant kan komen.
    */
    doorvaartVerbieden();
    PORTB |= (1 << pin_50);
}

void brugLampen::doorvaartToestaanGeslotenBrugEenrichting(){
    /*!
    *Deze functie zorgt ervoor dat de rode lichten aangaan
    *aan beide kanten en één van de gele lichten aangaat.

    *Dit geeft aan dat er verkeer doorheen mag ookal is de brug gesloten,
    *daarnaast geeft dit aan dat er geen verkeer vanaf de andere kant komt.
    */
    doorvaartVerbieden();
    PORTB |= (1 << pin_50);
    PORTB |= (1 << pin_48);
}

