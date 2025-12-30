// Test: Memory limitations and data size handling
// This tests the maximum amount of data Windmill can process in a single job

export async function main(): Promise<any> {
  console.log('Starting memory limit test...');

  const results = {
    tests: [] as any[],
    maxArraySize: 0,
    maxStringSize: 0,
    maxObjectSize: 0,
    memoryLimit: 'Unknown',
    recommendations: [] as string[]
  };

  // Test 1: Array size limits
  console.log('Test 1: Testing array size limits...');
  const arrayTest = testArrayLimits();
  results.tests.push(arrayTest);
  results.maxArraySize = arrayTest.maxSize;

  // Test 2: String size limits
  console.log('Test 2: Testing string size limits...');
  const stringTest = testStringLimits();
  results.tests.push(stringTest);
  results.maxStringSize = stringTest.maxSize;

  // Test 3: Object complexity limits
  console.log('Test 3: Testing object complexity limits...');
  const objectTest = testObjectLimits();
  results.tests.push(objectTest);
  results.maxObjectSize = objectTest.maxSize;

  // Test 4: JSON parsing limits
  console.log('Test 4: Testing JSON parsing limits...');
  const jsonTest = testJSONLimits();
  results.tests.push(jsonTest);

  // Analyze results and provide recommendations
  results.memoryLimit = estimateMemoryLimit(results);
  results.recommendations = generateRecommendations(results);

  return results;
}

function testArrayLimits(): any {
  const result = {
    testName: 'Array Size Limit',
    maxSize: 0,
    maxElements: 0,
    error: null as string | null
  };

  try {
    const testArray = [];
    // Try to create increasingly large arrays
    for (let i = 0; i < 10000000; i += 1000) {
      testArray.push(new Array(1000).fill('x'));
      if (i % 100000 === 0) {
        result.maxElements = testArray.length * 1000;
        result.maxSize = JSON.stringify(testArray).length;
      }
    }
  } catch (error: any) {
    result.error = error.message;
  }

  return result;
}

function testStringLimits(): any {
  const result = {
    testName: 'String Size Limit',
    maxSize: 0,
    maxLength: 0,
    error: null as string | null
  };

  try {
    let testString = '';
    const chunk = 'x'.repeat(1024 * 1024); // 1MB chunks

    // Try to create increasingly large strings
    for (let i = 0; i < 1000; i++) {
      testString += chunk;
      result.maxLength = testString.length;
      result.maxSize = testString.length; // Size in bytes (roughly)
    }
  } catch (error: any) {
    result.error = error.message;
  }

  return result;
}

function testObjectLimits(): any {
  const result = {
    testName: 'Object Complexity Limit',
    maxSize: 0,
    maxDepth: 0,
    maxProperties: 0,
    error: null as string | null
  };

  try {
    // Test object depth
    let deepObject: any = {};
    let current = deepObject;
    for (let i = 0; i < 10000; i++) {
      current.next = {};
      current = current.next;
      result.maxDepth = i;
    }
  } catch (error: any) {
    result.error = error.message;
  }

  try {
    // Test number of properties
    const wideObject: any = {};
    for (let i = 0; i < 1000000; i++) {
      wideObject[`prop${i}`] = i;
      result.maxProperties = i;
    }
    result.maxSize = JSON.stringify(wideObject).length;
  } catch (error: any) {
    if (!result.error) result.error = error.message;
  }

  return result;
}

function testJSONLimits(): any {
  const result = {
    testName: 'JSON Processing Limit',
    maxParseSize: 0,
    maxStringifySize: 0,
    error: null as string | null
  };

  try {
    // Create a large object
    const largeObject = {
      data: new Array(100000).fill({
        id: Math.random(),
        value: 'x'.repeat(100),
        nested: { a: 1, b: 2, c: 3 }
      })
    };

    // Test stringify
    const jsonString = JSON.stringify(largeObject);
    result.maxStringifySize = jsonString.length;

    // Test parse
    const parsed = JSON.parse(jsonString);
    result.maxParseSize = jsonString.length;
  } catch (error: any) {
    result.error = error.message;
  }

  return result;
}

function estimateMemoryLimit(results: any): string {
  const sizes = [
    results.maxArraySize,
    results.maxStringSize,
    results.maxObjectSize
  ].filter(s => s > 0);

  if (sizes.length === 0) return 'Could not determine';

  const maxSize = Math.max(...sizes);

  if (maxSize > 1024 * 1024 * 1024) return `>${Math.floor(maxSize / (1024 * 1024 * 1024))}GB`;
  if (maxSize > 1024 * 1024) return `>${Math.floor(maxSize / (1024 * 1024))}MB`;
  if (maxSize > 1024) return `>${Math.floor(maxSize / 1024)}KB`;
  return `>${maxSize} bytes`;
}

function generateRecommendations(results: any): string[] {
  const recommendations = [];

  // Array recommendations
  if (results.maxArraySize > 0) {
    if (results.maxArraySize < 10 * 1024 * 1024) {
      recommendations.push('⚠️ Array size limit is low. Consider streaming for large datasets.');
    } else {
      recommendations.push('✅ Array size limit is sufficient for most use cases.');
    }
  }

  // String recommendations
  if (results.maxStringSize > 0) {
    if (results.maxStringSize < 50 * 1024 * 1024) {
      recommendations.push('⚠️ String size limit may affect large file processing.');
    } else {
      recommendations.push('✅ String size limit is adequate for document processing.');
    }
  }

  // Object recommendations
  if (results.tests.find((t: any) => t.testName === 'Object Complexity Limit').maxDepth < 100) {
    recommendations.push('⚠️ Object nesting depth is limited. Flatten deep structures.');
  }

  // General recommendations
  recommendations.push('💡 For large data processing, use pagination or streaming.');
  recommendations.push('💡 Store large results in S3 or database instead of returning directly.');

  return recommendations;
}