// Test: Maximum parallel execution capability
// This tests how many parallel operations Windmill can handle

export async function main(parallelCount: number = 100): Promise<any> {
  console.log(`Starting parallel execution test with ${parallelCount} operations`);

  const startTime = Date.now();
  const results = {
    requested: parallelCount,
    completed: 0,
    failed: 0,
    errors: [] as string[],
    duration: 0,
    averageTime: 0
  };

  // Create array of promises for parallel execution
  const promises = [];

  for (let i = 0; i < parallelCount; i++) {
    // Simulate API call or database operation
    promises.push(
      simulateOperation(i)
        .then(() => {
          results.completed++;
          return { id: i, status: 'success' };
        })
        .catch((error) => {
          results.failed++;
          results.errors.push(`Operation ${i}: ${error.message}`);
          return { id: i, status: 'failed', error: error.message };
        })
    );
  }

  // Execute all promises in parallel
  const operationResults = await Promise.allSettled(promises);

  results.duration = Date.now() - startTime;
  results.averageTime = results.duration / parallelCount;

  // Analyze results
  const analysis = {
    ...results,
    successRate: (results.completed / parallelCount) * 100,
    performance: getPerformanceRating(results.duration, parallelCount),
    bottleneck: identifyBottleneck(results),
    recommendation: getRecommendation(results, parallelCount)
  };

  return analysis;
}

async function simulateOperation(id: number): Promise<void> {
  // Simulate varying operation times
  const delay = Math.random() * 1000 + 500; // 500-1500ms

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 5% chance of failure to test error handling
      if (Math.random() > 0.95) {
        reject(new Error(`Simulated failure for operation ${id}`));
      } else {
        resolve();
      }
    }, delay);
  });
}

function getPerformanceRating(duration: number, count: number): string {
  const avgTime = duration / count;
  if (avgTime < 100) return 'Excellent';
  if (avgTime < 500) return 'Good';
  if (avgTime < 1000) return 'Acceptable';
  return 'Poor';
}

function identifyBottleneck(results: any): string {
  if (results.failed > results.completed * 0.1) {
    return 'High failure rate indicates system overload';
  }
  if (results.averageTime > 1000) {
    return 'Processing time per operation is high';
  }
  if (results.duration > 30000) {
    return 'Total execution time exceeds reasonable limits';
  }
  return 'No significant bottleneck detected';
}

function getRecommendation(results: any, parallelCount: number): string {
  if (results.successRate < 90) {
    return `Reduce parallel operations to ${Math.floor(parallelCount * 0.7)} for better stability`;
  }
  if (results.performance === 'Excellent' || results.performance === 'Good') {
    return `System can handle ${parallelCount} parallel operations effectively`;
  }
  return `Consider batching operations in groups of ${Math.floor(parallelCount / 2)}`;
}