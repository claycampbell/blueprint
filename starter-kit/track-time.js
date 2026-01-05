#!/usr/bin/env node

/**
 * Simple Time Tracking Script for Assessment
 *
 * Usage:
 *   node track-time.js start          # Start assessment timer
 *   node track-time.js milestone      # Mark a milestone
 *   node track-time.js stop           # Stop and show summary
 *   node track-time.js status         # Check current time
 */

const fs = require('fs');
const path = require('path');

const TIME_FILE = path.join(__dirname, '.assessment-time.json');

const MILESTONES = [
  'Setup complete',
  'Types defined',
  'API service implemented',
  'Component created',
  'Search working',
  'Debounce added',
  'Tests written',
  'All tests passing',
  'Documentation complete'
];

// Helper functions
function loadTimeData() {
  if (!fs.existsSync(TIME_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(TIME_FILE, 'utf8'));
}

function saveTimeData(data) {
  fs.writeFileSync(TIME_FILE, JSON.stringify(data, null, 2));
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
}

// Commands
function startAssessment() {
  const existing = loadTimeData();
  if (existing && !existing.endTime) {
    console.log('⚠️  Assessment timer is already running!');
    console.log(`Started at: ${formatTime(existing.startTime)}`);
    console.log(`Current duration: ${formatDuration(Date.now() - existing.startTime)}`);
    console.log('\nUse "node track-time.js status" to check progress');
    return;
  }

  const data = {
    startTime: Date.now(),
    milestones: [],
    endTime: null
  };

  saveTimeData(data);
  console.log('✅ Assessment timer started!');
  console.log(`Start time: ${formatTime(data.startTime)}`);
  console.log('\nCommands:');
  console.log('  node track-time.js milestone  - Mark a checkpoint');
  console.log('  node track-time.js status     - Check current time');
  console.log('  node track-time.js stop       - Complete assessment');
  console.log('\nGood luck! 🚀');
}

function addMilestone() {
  const data = loadTimeData();
  if (!data || data.endTime) {
    console.log('❌ No active assessment. Start with: node track-time.js start');
    return;
  }

  const now = Date.now();
  const elapsed = now - data.startTime;

  console.log('\n🎯 Available milestones:');
  MILESTONES.forEach((m, i) => {
    const completed = data.milestones.some(milestone => milestone.name === m);
    console.log(`  ${i + 1}. ${completed ? '✅' : '⬜'} ${m}`);
  });

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('\nEnter milestone number (or custom text): ', (answer) => {
    let milestoneName;
    const num = parseInt(answer);

    if (num > 0 && num <= MILESTONES.length) {
      milestoneName = MILESTONES[num - 1];
    } else {
      milestoneName = answer.trim();
    }

    if (!milestoneName) {
      console.log('❌ No milestone entered');
      readline.close();
      return;
    }

    data.milestones.push({
      name: milestoneName,
      timestamp: now,
      elapsed: elapsed
    });

    saveTimeData(data);
    console.log(`\n✅ Milestone recorded: ${milestoneName}`);
    console.log(`Time: ${formatDuration(elapsed)}`);
    console.log(`Total milestones: ${data.milestones.length}`);
    readline.close();
  });
}

function showStatus() {
  const data = loadTimeData();
  if (!data) {
    console.log('❌ No assessment started. Start with: node track-time.js start');
    return;
  }

  const now = Date.now();
  const elapsed = data.endTime ? (data.endTime - data.startTime) : (now - data.startTime);

  console.log('\n📊 Assessment Status');
  console.log('═══════════════════════════════════════');
  console.log(`Started: ${formatTime(data.startTime)}`);

  if (data.endTime) {
    console.log(`Ended: ${formatTime(data.endTime)}`);
    console.log(`Total Duration: ${formatDuration(elapsed)}`);
    console.log('Status: ✅ Complete');
  } else {
    console.log(`Current Time: ${formatTime(now)}`);
    console.log(`Elapsed: ${formatDuration(elapsed)}`);
    console.log('Status: ⏱️  In Progress');
  }

  if (data.milestones.length > 0) {
    console.log('\n🎯 Milestones:');
    data.milestones.forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.name} - ${formatDuration(m.elapsed)}`);
    });

    // Calculate gaps between milestones
    console.log('\n⏱️  Time Between Milestones:');
    data.milestones.forEach((m, i) => {
      if (i === 0) {
        console.log(`  Setup → ${m.name}: ${formatDuration(m.elapsed)}`);
      } else {
        const prev = data.milestones[i - 1];
        const gap = m.elapsed - prev.elapsed;
        console.log(`  ${prev.name} → ${m.name}: ${formatDuration(gap)}`);
      }
    });
  } else {
    console.log('\n⬜ No milestones recorded yet');
  }

  if (!data.endTime) {
    console.log('\n💡 Tip: Use "node track-time.js milestone" to mark progress');
  }
}

function stopAssessment() {
  const data = loadTimeData();
  if (!data) {
    console.log('❌ No assessment started.');
    return;
  }

  if (data.endTime) {
    console.log('⚠️  Assessment already completed!');
    showStatus();
    return;
  }

  data.endTime = Date.now();
  const totalDuration = data.endTime - data.startTime;

  saveTimeData(data);

  console.log('\n🎉 Assessment Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`Start: ${formatTime(data.startTime)}`);
  console.log(`End: ${formatTime(data.endTime)}`);
  console.log(`Total Duration: ${formatDuration(totalDuration)}`);
  console.log(`Milestones: ${data.milestones.length}`);

  if (data.milestones.length > 0) {
    console.log('\n📋 Summary for RAUL_SUMMARY.md:');
    console.log('─────────────────────────────────────');
    console.log(`**Total Time:** ${formatDuration(totalDuration)}\n`);
    console.log('**Breakdown:**');

    data.milestones.forEach((m, i) => {
      if (i === 0) {
        console.log(`- Setup → ${m.name}: ${formatDuration(m.elapsed)}`);
      } else {
        const prev = data.milestones[i - 1];
        const gap = m.elapsed - prev.elapsed;
        console.log(`- ${m.name}: ${formatDuration(gap)}`);
      }
    });

    const lastMilestone = data.milestones[data.milestones.length - 1];
    const finalGap = totalDuration - lastMilestone.elapsed;
    if (finalGap > 0) {
      console.log(`- Final tasks: ${formatDuration(finalGap)}`);
    }
  }

  console.log('\n📝 Copy the summary above into your reflection document!');
  console.log('\nTime data saved to: .assessment-time.json');
}

// Main
const command = process.argv[2];

switch (command) {
  case 'start':
    startAssessment();
    break;
  case 'milestone':
    addMilestone();
    break;
  case 'status':
    showStatus();
    break;
  case 'stop':
    stopAssessment();
    break;
  default:
    console.log('Assessment Time Tracker\n');
    console.log('Usage:');
    console.log('  node track-time.js start       - Start assessment timer');
    console.log('  node track-time.js milestone   - Mark a checkpoint');
    console.log('  node track-time.js status      - Check current time');
    console.log('  node track-time.js stop        - Complete and show summary');
}
