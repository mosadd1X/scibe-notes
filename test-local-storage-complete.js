// Test script to verify complete removal of MongoDB and authentication
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Testing complete removal of MongoDB and authentication...');

// Check if MongoDB files have been removed
const mongodbFiles = [
  'lib/mongodb.ts',
  'mongodb-test.js',
  'app/api/notes/route.ts',
  'app/api/notes/[id]/route.ts',
  'app/api/notes/[id]/share/route.ts',
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/shared/[shareId]/route.ts',
];

let allFilesRemoved = true;
for (const file of mongodbFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.error(`Error: MongoDB-related file ${file} still exists`);
    allFilesRemoved = false;
  } else {
    console.log(`MongoDB-related file ${file} has been removed`);
  }
}

// Check if package.json has been updated
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

let dependenciesRemoved = true;
const removedDependencies = ['mongodb', 'next-auth', 'bcryptjs'];
for (const dep of removedDependencies) {
  if (packageJson.dependencies[dep]) {
    console.error(`Error: Dependency ${dep} still exists in package.json`);
    dependenciesRemoved = false;
  } else {
    console.log(`Dependency ${dep} has been removed from package.json`);
  }
}

// Check if the new local storage features have been added
const noteUtilsPath = path.join(process.cwd(), 'lib/note-utils.ts');
const noteUtilsContent = fs.readFileSync(noteUtilsPath, 'utf8');

let featuresAdded = true;
const newFeatures = ['clearAllNotes', 'exportNotes', 'importNotes'];
for (const feature of newFeatures) {
  if (!noteUtilsContent.includes(`export function ${feature}`)) {
    console.error(`Error: New feature ${feature} not found in note-utils.ts`);
    featuresAdded = false;
  } else {
    console.log(`New feature ${feature} has been added to note-utils.ts`);
  }
}

// Check if the NoteActionsMenu component has been added
const noteActionsMenuPath = path.join(process.cwd(), 'components/notes/note-actions-menu.tsx');
if (!fs.existsSync(noteActionsMenuPath)) {
  console.error('Error: NoteActionsMenu component not found');
  featuresAdded = false;
} else {
  console.log('NoteActionsMenu component has been added');
}

// Check if the AppHeader has been updated to include the NoteActionsMenu
const appHeaderPath = path.join(process.cwd(), 'components/ui/app-header.tsx');
const appHeaderContent = fs.readFileSync(appHeaderPath, 'utf8');
if (!appHeaderContent.includes('NoteActionsMenu')) {
  console.error('Error: NoteActionsMenu not included in AppHeader');
  featuresAdded = false;
} else {
  console.log('NoteActionsMenu has been included in AppHeader');
}

// Final result
if (allFilesRemoved && dependenciesRemoved && featuresAdded) {
  console.log('\nAll tests passed! MongoDB and authentication have been completely removed.');
  console.log('New features for local storage management have been added.');
  console.log('You can start the app with "npm run dev" to test it.');
} else {
  console.error('\nSome tests failed. Please check the errors above.');
  process.exit(1);
}
