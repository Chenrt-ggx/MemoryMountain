/* Find number of cycles used by function that takes 2 arguments */

#ifndef CORE_FCYC2_H
#define CORE_FCYC2_H

/* Function to be tested takes two integer arguments */
typedef int (*test_funct)(int, int);

/* Compute time used by function f  */
double fcyc2(test_funct f, int pa, int pb, int clear_cache);

/*
 * Full version of fcyc with control over parameters
 * Parameters:
 *   k:  How many samples must be within epsilon for convergence
 *   epsilon: What is tolerance
 *   max_samples: How many samples until give up
 */
double fcyc2_full(test_funct f, int pa, int pb, int clear_cache, int k, double epsilon, int max_samples);

/*
 * What is convergence status for k minimum measurements within epsilon
 * Returns 0 if not converged, #samples if converged, and -1 if can't
 * reach convergence
 */
int has_converged(int k, double epsilon, int max_samples);

#endif //CORE_FCYC2_H
