#include <stdio.h>
#include <string.h>

#include "clock.h"

/* Keep track of most recent reading of cycle counter */
static unsigned cyc_hi = 0, cyc_lo = 0;

void access_counter(unsigned *hi, unsigned *lo) /* NOLINT */ {
    /* Get cycle counter */
    asm("rdtsc; movl %%edx,%0; movl %%eax,%1"
    : "=r" (*hi), "=r" (*lo)
    : /* No input */
    : "%edx", "%eax");
}

void start_counter() {
    access_counter(&cyc_hi, &cyc_lo);
}

double get_counter() {
    double result;
    unsigned hi, lo, borrow;
    unsigned n_cyc_hi, n_cyc_lo;
    /* Get cycle counter */
    access_counter(&n_cyc_hi, &n_cyc_lo);
    /* Do double precision subtraction */
    lo = n_cyc_lo - cyc_lo;
    borrow = lo > n_cyc_lo;
    hi = n_cyc_hi - cyc_hi - borrow;
    result = (double) hi * (1 << 30) * 4 + lo;
    if (result < 0) {
        fprintf(stderr, "Error: Cycle counter returning negative value: %.0f\n", result);
    }
    return result;
}

/* Keep track of clock speed */
double cpu_ghz = 0.0;

/* Get megahertz from /etc/proc */
#define MAX_BUF 512

double mhz(int verbose) {
    static char buf[MAX_BUF];
    FILE *fp = fopen("/proc/cpuinfo", "r");
    if (!fp) {
        fprintf(stderr, "Can't open /proc/cpuinfo to get clock information\n");
        cpu_ghz = 1.0;
        return 1000.0;
    }

    cpu_ghz = 0.0;
    while (fgets(buf, MAX_BUF, fp)) {
        if (strstr(buf, "cpu MHz")) {
            double cpu_mhz = 0.0;
            sscanf(buf, "cpu MHz\t: %lf", &cpu_mhz) /* NOLINT */;
            cpu_ghz = cpu_mhz / 1000.0;
            break;
        }
    }
    fclose(fp);

    if (cpu_ghz == 0.0) {
        fprintf(stderr, "Can't open /proc/cpuinfo to get clock information\n");
        cpu_ghz = 1.0;
        return 1000.0;
    }
    if (verbose) {
        printf("Processor Clock Rate ~= %.4f GHz (extracted from file)\n", cpu_ghz);
    }
    return cpu_ghz * 1000;
}
