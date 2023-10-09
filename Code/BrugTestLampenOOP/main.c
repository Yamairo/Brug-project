/*
 */

#include <avr/io.h>
#include "brugLampen.h"

brugLampen brugLampen;

int main(void) {
    brugLampen.init();
    while (1) {
        brugLampen.doorvaartVerbieden();
        _delay_ms(test_delay);
        brugLampen.aanstondsToestaan();
        _delay_ms(test_delay);
        brugLampen.doorvaartToestaan();
        _delay_ms(test_delay);
        brugLampen.doorvaartToestaanGeslotenBrugTweerichting();
        _delay_ms(test_delay);
        brugLampen.doorvaartToestaanGeslotenBrugEenrichting();
        _delay_ms(test_delay);
    }
}
