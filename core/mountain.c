/* mountain.c - Generate the memory mountain. */

#include <stdio.h>
#include <stdlib.h>

#include "fcyc2.h" /* measurement routines */
#include "clock.h" /* routines to access the cycle counter */

#define MIN_BYTES (1 << 14)  /* First working set size */
#define MAX_BYTES (1 << 27)  /* Last working set size */
#define MAX_STRIDE 15        /* Stride x8 bytes */
#define MAX_ELEMS (MAX_BYTES/sizeof(long))

long data[MAX_ELEMS];        /* The global array we'll be traversing */

void init_data(long *array, int n);

int test(int elems, int stride);

double run(int size, int stride, double Mhz);

int main() {
    int size;        /* Working set size (in bytes) */
    int stride;      /* Stride (in array elements) */
    double Mhz;      /* Clock frequency */

    init_data(data, MAX_ELEMS); /* Initialize each element in data */
    Mhz = mhz(0);          /* Estimate the clock frequency */
    printf("Clock frequency is approx. %.1f MHz\n", Mhz);
    printf("Memory mountain (MB/sec)\n");
    putchar('\t');
    for (stride = 1; stride <= MAX_STRIDE; stride++)
        printf("s%d\t", stride);
    putchar('\n');

    for (size = MAX_BYTES; size >= MIN_BYTES; size >>= 1) {
        if (size > (1 << 20))
            printf("%dm\t", size >> 20);
        else
            printf("%dk\t", size >> 10);
        for (stride = 1; stride <= MAX_STRIDE; stride++)
            printf("%.0f\t", run(size, stride, Mhz));
        putchar('\n');
    }
    exit(0);
}

/* init_data - initializes the array */
void init_data(long *array, int n) {
    int i;
    for (i = 0; i < n; i++)
        array[i] = i;
}

/*
 * test - Iterate over first "elems" elements of array "data" with
 *        stride of "stride", using 4x4 loop unrolling.
 */
int test(int elems, int stride) {
    long i, sx2 = stride * 2, sx3 = stride * 3, sx4 = stride * 4;
    long acc0 = 0, acc1 = 0, acc2 = 0, acc3 = 0;
    long length = elems, limit = length - sx4;
    /* Combine 4 elements at a time */
    for (i = 0; i < limit; i += sx4) {
        acc0 = acc0 + data[i];
        acc1 = acc1 + data[i + stride];
        acc2 = acc2 + data[i + sx2];
        acc3 = acc3 + data[i + sx3];
    }
    /* Finish any remaining elements */
    for (; i < length; i += stride) {
        acc0 = acc0 + data[i];
    }
    return acc0 + acc1 + acc2 + acc3;
}

/*
 * run - Run test(elems, stride) and return read throughput (MB/s).
 *       "size" is in bytes, "stride" is in array elements, and Mhz is
 *       CPU clock frequency in Mhz.
 */
double run(int size, int stride, double Mhz) {
    int elems = size / (int) sizeof(double);
    /* Warm up the cache */
    test(elems, stride);
    /* Call test(elems,stride) */
    double cycles = fcyc2(test, elems, stride, 0);
    /* Convert cycles to MB/s */
    return (1.0 * size / stride) / (cycles / Mhz);
}
