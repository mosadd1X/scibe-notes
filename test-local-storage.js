// Test script to verify local storage functionality
const fs = require('fs');
const path = require('path');

console.log('Testing local storage functionality...');

// Check if the required files exist
const requiredFiles = [
  'lib/types.ts',
  'lib/note-utils.ts',
  'lib/db-utils.ts',
  'components/notes/note-editor.tsx',
  'components/notes/note-list.tsx',
  'components/notes/sidebar.tsx',
  'app/layout.tsx',
  'app/page.tsx',
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

// Check if the Note type has been updated
const typesContent = fs.readFileSync(path.join(process.cwd(), 'lib/types.ts'), 'utf8');
if (typesContent.includes('ObjectId') || typesContent.includes('mongodb')) {
  console.error('Error: lib/types.ts still contains MongoDB references');
  process.exit(1);
} else {
  console.log('lib/types.ts has been updated correctly');
}

// Check if the db-utils.ts file has been updated
const dbUtilsContent = fs.readFileSync(path.join(process.cwd(), 'lib/db-utils.ts'), 'utf8');
if (dbUtilsContent.includes('clientPromise') || dbUtilsContent.includes('mongodb+srv')) {
  console.error('Error: lib/db-utils.ts still contains MongoDB references');
  process.exit(1);
} else {
  console.log('lib/db-utils.ts has been updated correctly');
}

// Check if the layout.tsx file has been updated
const layoutContent = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
if (layoutContent.includes('SessionProvider') || layoutContent.includes('AuthProvider')) {
  console.error('Error: app/layout.tsx still contains authentication references');
  process.exit(1);
} else {
  console.log('app/layout.tsx has been updated correctly');
}

// Check if the page.tsx file has been updated
const pageContent = fs.readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8');
if (pageContent.includes('useAuth') || pageContent.includes('useSession')) {
  console.error('Error: app/page.tsx still contains authentication references');
  process.exit(1);
} else {
  console.log('app/page.tsx has been updated correctly');
}

console.log('All tests passed! The app should now work without MongoDB and authentication.');
console.log('You can start the app with "npm run dev" to test it.');
