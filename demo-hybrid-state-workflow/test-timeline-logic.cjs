// Test the timeline date calculation logic

const getDayOffset = (date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const getDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

console.log('=== Timeline Date Calculation Test ===\n');
console.log('Today:', new Date().toISOString().split('T')[0]);
console.log('Timeline starts from: today (day 0)');
console.log('Timeline shows: 45 days forward\n');

// Test dates from the data
const testProcesses = [
  {
    name: 'OVERDUE Process 1',
    startedAt: new Date('2025-12-23T10:00:00Z'),
    dueDate: new Date('2025-12-28T17:00:00Z')
  },
  {
    name: 'Due This Week',
    startedAt: new Date('2025-12-29T09:00:00Z'),
    dueDate: new Date('2026-01-05T17:00:00Z')
  },
  {
    name: 'Due This Month',
    startedAt: new Date('2025-12-21T08:00:00Z'),
    dueDate: new Date('2026-01-20T17:00:00Z')
  }
];

testProcesses.forEach(process => {
  const startOffset = getDayOffset(process.startedAt);
  const endOffset = getDayOffset(process.dueDate);
  const duration = getDuration(process.startedAt, process.dueDate);

  console.log(`\n${process.name}:`);
  console.log(`  Started: ${process.startedAt.toISOString().split('T')[0]}`);
  console.log(`  Due: ${process.dueDate.toISOString().split('T')[0]}`);
  console.log(`  Start offset: ${startOffset} days`);
  console.log(`  End offset: ${endOffset} days`);
  console.log(`  Duration: ${duration} days`);
  console.log(`  Visible on timeline: ${endOffset >= 0 && startOffset < 45 ? 'YES' : 'NO'}`);

  if (endOffset >= 0 && startOffset < 45) {
    const visibleStart = Math.max(0, startOffset);
    const visibleEnd = Math.min(44, endOffset);
    const visibleDuration = visibleEnd - visibleStart + 1;
    console.log(`  Gantt bar: column ${visibleStart} to ${visibleEnd}, width ${visibleDuration} days`);
    console.log(`  Position: left = ${350 + visibleStart * 40}px, width = ${visibleDuration * 40 - 4}px`);
  }
});

console.log('\n=== Summary ===');
console.log('If dates are correct and Gantt bars still not showing, check:');
console.log('1. Are properties being filtered correctly (activeProcesses with dueDate)?');
console.log('2. Is the expandable state working (expandedProperties Set)?');
console.log('3. Are the Gantt bar divs being rendered in the DOM?');
