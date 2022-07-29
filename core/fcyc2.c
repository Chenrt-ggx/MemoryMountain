/* Compute time used by a function f that takes two integer args */

#include <stdio.h>
#include <stdlib.h>

#include "clock.h"
#include "fcyc2.h"

int sample_count = 0;
static double *values = NULL;

#define KEEP_VALUES 1
#define KEEP_SAMPLES 1

#if KEEP_SAMPLES
double *samples = NULL;
#endif

/* Start new sampling process */
static void init_sample(int k, int max_samples) {
    if (values)
        free(values);
    values = calloc(k, sizeof(double));
#if KEEP_SAMPLES
    if (samples)
        free(samples);
    /* Allocate extra for wraparound analysis */
    samples = calloc(max_samples + k, sizeof(double));
#endif
    sample_count = 0;
}

/* Add new sample.  */
void add_sample(double val, int k) {
    int pos = 0;
    if (sample_count < k) {
        pos = sample_count;
        values[pos] = val;
    } else if (val < values[k - 1]) {
        pos = k - 1;
        values[pos] = val;
    }
#if KEEP_SAMPLES
    samples[sample_count] = val;
#endif
    sample_count++;
    /* Insertion sort */
    while (pos > 0 && values[pos - 1] > values[pos]) {
        double temp = values[pos - 1];
        values[pos - 1] = values[pos];
        values[pos] = temp;
        pos--;
    }
}

/* Have k minimum measurements converged within epsilon? */
int has_converged(int k_arg, double epsilon_arg, int max_samples) {
    if ((sample_count >= k_arg) &&
        ((1 + epsilon_arg) * values[0] >= values[k_arg - 1]))
        return sample_count;
    if ((sample_count >= max_samples))
        return -1;
    return 0;
}

/* Code to clear cache */
/* Pentium III has 512K L2 cache, which is 128K ints */
#define ARR_SIZE (1 << 17)
/* Cache block size is 32 bytes */
#define STRIDE 8

static int sink;
static int stuff[ARR_SIZE];

static void clear() {
    int i, x = sink;
    for (i = 0; i < ARR_SIZE; i += STRIDE)
        x += stuff[i];
    sink = x;
}

double fcyc2_full(test_funct f, int pa, int pb, int clear_cache, int k, double epsilon, int max_samples) {
    init_sample(k, max_samples);
    do {
        double cyc;
        if (clear_cache)
            clear();
        f(pa, pb); /* warm cache */
        start_counter();
        f(pa, pb);
        cyc = get_counter();
        add_sample(cyc, k);
    } while (!has_converged(k, epsilon, max_samples) && sample_count < max_samples);
    double result = values[0];
#if !KEEP_VALUES
    free(values);
    values = NULL;
#endif
    return result;
}

double fcyc2(test_funct f, int pa, int pb, int clear_cache) {
    return fcyc2_full(f, pa, pb, clear_cache, 3, 0.01, 500);
}
