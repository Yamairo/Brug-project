#include <avr/io.h>
#include <util/delay.h>
#include <stdio.h>

void initUART() {
    // Initialize UART communication with a baud rate of 115200
    UBRR0H = 0;
    UBRR0L = 15;
    UCSR0B = (1 << TXEN0);
    UCSR0C = (1 << UCSZ01) | (1 << UCSZ00);
}

void UART_transmit(char data) {
    // Wait for the transmit buffer to be empty
    while (!(UCSR0A & (1 << UDRE0)));
    // Put the data into the transmit buffer
    UDR0 = data;
}

void printWelcomeLine(int x, const char* sensorName) {
    printf("MyAnalogSensor WelcomeLine: x=%d, Sensor Name: %s\n", x, sensorName);
}

void setup() {
    // Initialize UART for communication
    initUART();

    int x = 1;
    char sensorName[] = "MyAnalogSensor";

    // Send link setup
    UART_transmit('L');
    UART_transmit('i');
    UART_transmit('n');
    UART_transmit('k');
    UART_transmit('\n');

    // Print Welcome Line
    printWelcomeLine(x++, sensorName);

    // Additional setup for your hardware goes here
}

void loop() {
    // Your main loop code here
    // This loop will be continuously executed

    // Simulate some delay
    _delay_ms(1000);
}

int main() {
    setup();

    while (1) {
        loop();
    }

    return 0;
}
