/* Routines for using cycle counter */

#ifndef CORE_CLOCK_H
#define CORE_CLOCK_H

/* Start the counter */
void start_counter();

/* Get # cycles since counter started */
double get_counter();

/* Determine clock rate of processor */
double mhz(int verbose);

#endif //CORE_CLOCK_H
