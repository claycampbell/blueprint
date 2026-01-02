const fs = require('fs');

// Read the file
let content = fs.readFileSync('multipleProperties.ts', 'utf8');

// Replace all 2024 and early 2025 dates with 2025-2026 dates
const replacements = {
  // OVERDUE examples (started before, due in past)
  "'2024-12-20T10:00:00Z'": "'2025-12-23T10:00:00Z'",  // 8 days ago
  "'2024-12-28T17:00:00Z'": "'2025-12-28T17:00:00Z'",  // 3 days ago OVERDUE
  
  // DUE WITHIN WEEK
  "'2024-12-28T09:00:00Z'": "'2025-12-29T09:00:00Z'",  // 2 days ago
  "'2025-01-02T17:00:00Z'": "'2026-01-05T17:00:00Z'",  // 5 days from now
  
  "'2024-12-15T10:00:00Z'": "'2025-12-26T10:00:00Z'",  // 5 days ago
  "'2025-01-04T17:00:00Z'": "'2026-01-06T17:00:00Z'",  // 6 days from now
  
  "'2024-12-10T08:00:00Z'": "'2025-12-28T08:00:00Z'",  // 3 days ago
  "'2025-01-03T17:00:00Z'": "'2026-01-07T17:00:00Z'",  // 7 days from now
  
  // DUE THIS MONTH
  "'2024-12-16T08:00:00Z'": "'2025-12-21T08:00:00Z'",  // 10 days ago
  "'2025-01-15T17:00:00Z'": "'2026-01-20T17:00:00Z'",  // 20 days from now
  
  "'2024-12-20T08:00:00Z'": "'2025-12-25T08:00:00Z'",  // 6 days ago  
  "'2025-01-20T17:00:00Z'": "'2026-01-25T17:00:00Z'",  // 25 days from now
  
  "'2024-11-20T08:00:00Z'": "'2025-12-20T08:00:00Z'",  // 11 days ago
  "'2025-01-25T17:00:00Z'": "'2026-01-28T17:00:00Z'",  // 28 days from now
  
  // OVERDUE
  "'2024-12-22T09:00:00Z'": "'2025-12-20T09:00:00Z'",  // 11 days ago
  "'2024-12-30T17:00:00Z'": "'2025-12-26T17:00:00Z'",  // 5 days ago OVERDUE
  
  "'2024-12-05T09:00:00Z'": "'2025-12-15T09:00:00Z'",  // 16 days ago
  "'2025-02-10T17:00:00Z'": "'2026-02-05T17:00:00Z'",  // 36 days from now
  
  "'2024-12-05T08:00:00Z'": "'2025-12-18T08:00:00Z'",  // 13 days ago
  "'2024-12-27T17:00:00Z'": "'2025-12-27T17:00:00Z'",  // 4 days ago OVERDUE
  
  // FUTURE
  "'2025-01-10T08:00:00Z'": "'2026-01-05T08:00:00Z'",  // 5 days from now
  "'2025-01-08T09:00:00Z'": "'2026-01-10T09:00:00Z'",  // 10 days from now
  
  // Generic date replacements for created/updated
  "'2025-01-15T10:00:00Z'": "'2025-12-15T10:00:00Z'",
  "'2024-12-15T08:00:00Z'": "'2025-12-15T08:00:00Z'"
};

// Apply all replacements
Object.entries(replacements).forEach(([oldDate, newDate]) => {
  content = content.replace(new RegExp(oldDate, 'g'), newDate);
});

// Write back
fs.writeFileSync('multipleProperties.ts', content);
console.log('✅ Dates updated successfully!');
