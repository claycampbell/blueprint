// Simple test that can actually run in Windmill
// Copy this content into Windmill UI

export async function main(): Promise<any> {
  console.log("Starting simple Windmill test...");

  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as any
  };

  // Test 1: Basic execution
  console.log("Test 1: Basic execution");
  results.tests.basic = {
    success: true,
    message: "Windmill can execute TypeScript"
  };

  // Test 2: Parallel promises
  console.log("Test 2: Parallel execution");
  const start = Date.now();
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(new Promise(resolve => {
      setTimeout(() => resolve(i), 100);
    }));
  }
  await Promise.all(promises);
  results.tests.parallel = {
    success: true,
    count: 10,
    duration: Date.now() - start
  };

  // Test 3: Memory allocation
  console.log("Test 3: Memory test");
  try {
    const bigArray = new Array(1000000).fill("x");
    results.tests.memory = {
      success: true,
      arraySize: bigArray.length
    };
  } catch (e: any) {
    results.tests.memory = {
      success: false,
      error: e.message
    };
  }

  // Test 4: Error handling
  console.log("Test 4: Error handling");
  try {
    throw new Error("Test error");
  } catch (e: any) {
    results.tests.errorHandling = {
      success: true,
      caught: e.message
    };
  }

  console.log("All tests complete!");
  return results;
}