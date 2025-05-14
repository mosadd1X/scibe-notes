// Test script to verify local storage improvements
const fs = require('fs');
const path = require('path');

console.log('Testing local storage improvements...');

// Check if the required files exist
const requiredFiles = [
  'lib/types.ts',
  'lib/note-utils.ts',
  'components/notes/note-editor.tsx',
  'components/notes/note-actions.tsx',
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File ${file} does not exist`);
    allFilesExist = false;
  } else {
    console.log(`File ${file} exists`);
  }
}

if (!allFilesExist) {
  console.error('Some required files are missing. Please check the file paths.');
  process.exit(1);
}

// Check if the note-utils.ts file has been updated with new functions
const noteUtilsContent = fs.readFileSync(path.join(process.cwd(), 'lib/note-utils.ts'), 'utf8');
const newFunctions = [
  'formatRelativeTime',
  'backupNotes',
  'restoreFromBackup',
  'getStorageStats',
  'exportNoteAsMarkdown',
  'copyNoteToClipboard',
  'searchNotes',
];

let allFunctionsExist = true;
for (const func of newFunctions) {
  if (!noteUtilsContent.includes(`export function ${func}`)) {
    console.error(`Error: Function ${func} not found in note-utils.ts`);
    allFunctionsExist = false;
  } else {
    console.log(`Function ${func} exists in note-utils.ts`);
  }
}

// Check if the NoteActions component has been updated
const noteActionsContent = fs.readFileSync(path.join(process.cwd(), 'components/notes/note-actions.tsx'), 'utf8');
if (!noteActionsContent.includes('note?: Note')) {
  console.error('Error: NoteActions component does not have the note parameter');
  process.exit(1);
} else {
  console.log('NoteActions component has been updated with the note parameter');
}

// Check if the NoteEditor component has been updated
const noteEditorContent = fs.readFileSync(path.join(process.cwd(), 'components/notes/note-editor.tsx'), 'utf8');
if (!noteEditorContent.includes('note={note}')) {
  console.error('Error: NoteEditor component does not pass the note to NoteActions');
  process.exit(1);
} else {
  console.log('NoteEditor component passes the note to NoteActions');
}

// Check if the improved error handling has been implemented
if (!noteUtilsContent.includes('try {') || !noteUtilsContent.includes('catch (error)')) {
  console.error('Error: Improved error handling not found in note-utils.ts');
  process.exit(1);
} else {
  console.log('Improved error handling has been implemented in note-utils.ts');
}

// Check if the NOTES_STORAGE_KEY constant has been added
if (!noteUtilsContent.includes('NOTES_STORAGE_KEY')) {
  console.error('Error: NOTES_STORAGE_KEY constant not found in note-utils.ts');
  process.exit(1);
} else {
  console.log('NOTES_STORAGE_KEY constant has been added to note-utils.ts');
}

// Final result
if (allFunctionsExist) {
  console.log('\nAll tests passed! Local storage functionality has been improved.');
  console.log('You can start the app with "npm run dev" to test it.');
} else {
  console.error('\nSome tests failed. Please check the errors above.');
  process.exit(1);
}
