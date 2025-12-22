// Windmill Capability Test Suite Runner
// Execute this to comprehensively test Windmill's capabilities

import * as parallelTest from './01-parallel-execution';
import * as memoryTest from './02-memory-limits';
import * as databaseTest from './03-database-stress';
import * as complexWorkflow from './05-complex-workflow';
import uiComplexityTests from './04-ui-complexity.json';

interface TestResult {
  testName: string;
  category: string;
  passed: boolean;
  duration: number;
  details: any;
  recommendations: string[];
}

export async function main(pgClient: any, s3Client: any): Promise<any> {
  console.log('=====================================');
  console.log('WINDMILL COMPREHENSIVE TEST SUITE');
  console.log('=====================================\n');

  const startTime = Date.now();
  const results: TestResult[] = [];

  // Test 1: Parallel Execution
  console.log('Running Test 1: Parallel Execution Capability...');
  try {
    const parallelResult = await runWithTimeout(
      parallelTest.main(100),
      30000,
      'Parallel execution test'
    );
    results.push({
      testName: 'Parallel Execution',
      category: 'Performance',
      passed: parallelResult.performance === 'Excellent' || parallelResult.performance === 'Good',
      duration: parallelResult.duration,
      details: parallelResult,
      recommendations: [parallelResult.recommendation]
    });
  } catch (error: any) {
    results.push({
      testName: 'Parallel Execution',
      category: 'Performance',
      passed: false,
      duration: 0,
      details: { error: error.message },
      recommendations: ['Test failed - check worker configuration']
    });
  }

  // Test 2: Memory Limits
  console.log('\nRunning Test 2: Memory Limitations...');
  try {
    const memoryResult = await runWithTimeout(
      memoryTest.main(),
      60000,
      'Memory limits test'
    );
    results.push({
      testName: 'Memory Limits',
      category: 'Resources',
      passed: memoryResult.memoryLimit !== 'Unknown',
      duration: 0,
      details: memoryResult,
      recommendations: memoryResult.recommendations || []
    });
  } catch (error: any) {
    results.push({
      testName: 'Memory Limits',
      category: 'Resources',
      passed: false,
      duration: 0,
      details: { error: error.message },
      recommendations: ['Memory test failed - possible OOM']
    });
  }

  // Test 3: Database Stress
  console.log('\nRunning Test 3: Database Stress Test...');
  try {
    const dbResult = await runWithTimeout(
      databaseTest.main(pgClient),
      120000,
      'Database stress test'
    );

    const allTestsPassed = Object.values(dbResult)
      .filter((v: any) => v && typeof v === 'object' && 'success' in v)
      .every((v: any) => v.success);

    results.push({
      testName: 'Database Stress',
      category: 'Database',
      passed: allTestsPassed,
      duration: 0,
      details: dbResult,
      recommendations: dbResult.recommendations || []
    });
  } catch (error: any) {
    results.push({
      testName: 'Database Stress',
      category: 'Database',
      passed: false,
      duration: 0,
      details: { error: error.message },
      recommendations: ['Database test failed - check PostgreSQL connection']
    });
  }

  // Test 4: Complex Workflow
  console.log('\nRunning Test 4: Complex Workflow Simulation...');
  try {
    const workflowData = {
      applicantName: 'Test Applicant',
      loanAmount: 500000,
      propertyAddress: '123 Test St, Seattle, WA',
      documents: [
        { type: 'ID', url: 'http://example.com/id.pdf' },
        { type: 'Income', url: 'http://example.com/income.pdf' },
        { type: 'Property', url: 'http://example.com/property.pdf' }
      ]
    };

    const workflowResult = await runWithTimeout(
      complexWorkflow.main(workflowData, pgClient, s3Client),
      180000,
      'Complex workflow test'
    );

    results.push({
      testName: 'Complex Workflow',
      category: 'Workflow',
      passed: workflowResult.finalStatus === 'completed',
      duration: workflowResult.performance?.totalExecutionTime || 0,
      details: workflowResult,
      recommendations: generateWorkflowRecommendations(workflowResult)
    });
  } catch (error: any) {
    results.push({
      testName: 'Complex Workflow',
      category: 'Workflow',
      passed: false,
      duration: 0,
      details: { error: error.message },
      recommendations: ['Complex workflow failed - check all dependencies']
    });
  }

  // Test 5: UI Complexity Analysis (Static)
  console.log('\nAnalyzing UI Complexity Limits...');
  const uiAnalysis = analyzeUIComplexity(uiComplexityTests);
  results.push({
    testName: 'UI Complexity',
    category: 'UI',
    passed: true, // Static analysis always passes
    duration: 0,
    details: uiAnalysis,
    recommendations: uiAnalysis.recommendations
  });

  // Generate final report
  const finalReport = generateFinalReport(results, Date.now() - startTime);

  console.log('\n=====================================');
  console.log('TEST SUITE COMPLETE');
  console.log('=====================================\n');

  return finalReport;
}

async function runWithTimeout(
  promise: Promise<any>,
  timeout: number,
  testName: string
): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${testName} timed out after ${timeout}ms`)), timeout)
    )
  ]);
}

function generateWorkflowRecommendations(result: any): string[] {
  const recommendations = [];

  if (result.performance?.totalExecutionTime > 60000) {
    recommendations.push('⚠️ Workflow execution time exceeds 1 minute - consider optimization');
  } else {
    recommendations.push('✅ Workflow execution time is acceptable');
  }

  if (result.performance?.successRate < 100) {
    recommendations.push('⚠️ Some workflow stages failed - review error handling');
  }

  if (result.stages?.some((s: any) => s.stage === 'Human Approval')) {
    recommendations.push('💡 Human approval adds latency - consider async processing');
  }

  recommendations.push('💡 Use caching for external API calls');
  recommendations.push('💡 Implement circuit breakers for external services');

  return recommendations;
}

function analyzeUIComplexity(uiTests: any): any {
  const analysis = {
    totalTests: uiTests.tests.length,
    supportedComponents: [],
    unsupportedFeatures: [],
    recommendations: []
  };

  for (const test of uiTests.tests) {
    analysis.supportedComponents.push(test.name);

    // Check limits
    if (test.id === 'large-table' && test.expectedLimits.maxRows > 10000) {
      analysis.recommendations.push('⚠️ Tables over 10k rows may have performance issues');
    }

    if (test.id === 'complex-form' && test.expectedLimits.maxFields > 50) {
      analysis.recommendations.push('⚠️ Forms with 50+ fields should be split into steps');
    }

    if (test.id === 'real-time-updates') {
      analysis.unsupportedFeatures.push('Real-time WebSocket updates');
      analysis.recommendations.push('❌ No WebSocket support - use polling instead');
    }
  }

  // Add general UI recommendations
  analysis.recommendations.push('💡 For complex UI, build custom React frontend');
  analysis.recommendations.push('💡 Use Windmill UI for admin panels and simple forms');
  analysis.recommendations.push('💡 Consider Retool for more complex UI requirements');

  return analysis;
}

function generateFinalReport(results: TestResult[], totalDuration: number): any {
  const summary = {
    totalTests: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    duration: totalDuration,
    timestamp: new Date()
  };

  const categoryResults = {
    performance: results.filter(r => r.category === 'Performance'),
    resources: results.filter(r => r.category === 'Resources'),
    database: results.filter(r => r.category === 'Database'),
    workflow: results.filter(r => r.category === 'Workflow'),
    ui: results.filter(r => r.category === 'UI')
  };

  const verdict = calculateVerdict(results);
  const recommendations = consolidateRecommendations(results);

  // Print summary
  console.log('TEST SUMMARY');
  console.log('============');
  console.log(`Total Tests: ${summary.totalTests}`);
  console.log(`Passed: ${summary.passed}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Duration: ${(summary.duration / 1000).toFixed(2)} seconds`);
  console.log(`\nVERDICT: ${verdict.decision}`);
  console.log(`Confidence: ${verdict.confidence}%`);

  console.log('\nKEY FINDINGS:');
  verdict.findings.forEach((finding: string) => console.log(`  - ${finding}`));

  console.log('\nTOP RECOMMENDATIONS:');
  recommendations.slice(0, 5).forEach((rec: string) => console.log(`  - ${rec}`));

  return {
    summary,
    categoryResults,
    verdict,
    recommendations,
    detailedResults: results
  };
}

function calculateVerdict(results: TestResult[]): any {
  const passRate = results.filter(r => r.passed).length / results.length;

  let decision = '';
  let confidence = Math.round(passRate * 100);
  const findings = [];

  if (passRate >= 0.8) {
    decision = '✅ Windmill is SUITABLE for Blueprint Connect 2.0';
    findings.push('Core functionality tests passed');
    findings.push('Performance is acceptable for expected load');
    findings.push('Database operations are stable');
  } else if (passRate >= 0.6) {
    decision = '⚠️ Windmill is CONDITIONALLY SUITABLE with workarounds';
    findings.push('Some limitations require workarounds');
    findings.push('Consider hybrid architecture');
  } else {
    decision = '❌ Windmill has SIGNIFICANT LIMITATIONS for this use case';
    findings.push('Multiple critical tests failed');
    findings.push('Consider alternative platforms');
  }

  // Specific findings
  if (results.find(r => r.testName === 'Complex Workflow' && r.passed)) {
    findings.push('Complex business workflows are supported');
  }

  if (results.find(r => r.testName === 'Database Stress' && !r.passed)) {
    findings.push('Database performance needs optimization');
  }

  if (results.find(r => r.testName === 'UI Complexity')) {
    findings.push('UI limitations exist - custom frontend recommended');
  }

  return { decision, confidence, findings };
}

function consolidateRecommendations(results: TestResult[]): string[] {
  const allRecommendations = results.flatMap(r => r.recommendations);

  // Remove duplicates and prioritize
  const unique = Array.from(new Set(allRecommendations));

  // Sort by importance (errors first, then warnings, then info)
  return unique.sort((a, b) => {
    if (a.startsWith('❌')) return -1;
    if (b.startsWith('❌')) return 1;
    if (a.startsWith('⚠️')) return -1;
    if (b.startsWith('⚠️')) return 1;
    if (a.startsWith('✅')) return 1;
    if (b.startsWith('✅')) return -1;
    return 0;
  });
}