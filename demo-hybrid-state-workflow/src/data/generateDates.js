// Helper to generate dates relative to today
const today = new Date('2025-12-31');

const daysFromNow = (days) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Generate some sample dates
console.log('// OVERDUE (started 8 days ago, due 3 days ago)');
console.log('startedAt:', daysFromNow(-8));
console.log('dueDate:', daysFromNow(-3));
console.log('');

console.log('// DUE THIS WEEK (started 2 days ago, due in 5 days)');
console.log('startedAt:', daysFromNow(-2));
console.log('dueDate:', daysFromNow(5));
console.log('');

console.log('// DUE THIS MONTH (started today, due in 20 days)');
console.log('startedAt:', daysFromNow(0));
console.log('dueDate:', daysFromNow(20));
console.log('');

console.log('// FUTURE (starts in 5 days, due in 15 days)');
console.log('startedAt:', daysFromNow(5));
console.log('dueDate:', daysFromNow(15));
