import { runAllHosUnitTests } from './test_hos_engine';

console.log('==================================================');
console.log('Running FMCSA HOS Engine Unit Tests (All 16 Tests)');
console.log('==================================================');

const results = runAllHosUnitTests();
let passedCount = 0;

for (const res of results) {
  if (res.passed) {
    passedCount++;
    console.log(`[PASS] ${res.name}`);
  } else {
    console.error(`[FAIL] ${res.name}: ${res.message}`);
  }
}

console.log('==================================================');
console.log(`Results: ${passedCount}/${results.length} tests passed.`);
console.log('==================================================');

if (passedCount < results.length) {
  process.exit(1);
} else {
  process.exit(0);
}
