#include <avr/io.h>
#include <avr/interrupt.h>

// Function to initialize the timer for input capture
void initTimer() {
    // Set the timer mode for input capture with rising edge detection
    TCCR1B |= (1 << ICES1);
    // Enable input capture interrupt
    TIMSK1 |= (1 << ICIE1);
    // Enable global interrupts
    sei();
}

// Interrupt service routine for input capture
ISR(TIMER1_CAPT_vect) {
    // Read the captured value from the ICR1 register
    uint16_t capturedValue = ICR1;
    // Calculate duty cycle or frequency as needed
    // You can also perform further actions with the captured value here
}

int main() {
    // Initialize timer for input capture
    initTimer();

    // Other initialization code

    while (1) {
        // Your main application code here
    }

    return 0;
}
