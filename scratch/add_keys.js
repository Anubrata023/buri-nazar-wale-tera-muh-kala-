import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'context', 'LanguageContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const keysToAdd = {
  workflow_title: 'Workflow Action Control',
  pass_review: '🔍 Pass for Review',
  allocate_funds: '💰 Allocate Funds',
  resolve_direct: '✅ Resolve Direct',
  resolve_issue: '✅ Resolve Issue',
  resolved_closed: '🎉 Issue is fully resolved & closed.',
  open_google_doc: '🔗 Open Google Doc Draft',
  admin_feed: 'Admin Feed',
  post_update: 'Post Progress Update',
  update_msg: 'Update Message',
  category_label: 'Category',
  update_type: 'Update Type',
  ward_optional: 'Ward / Area (Optional)',
  publish_update: '📢 Publish Progress Update',
  live_feed: 'Live Updates Feed',
  no_updates: 'No updates from the administrator yet.',
  official_tag: 'Official',
  admin_updates: 'Admin Updates',
};

const dicts = ['bn', 'ta', 'te', 'mr'];

dicts.forEach(lang => {
  const marker = `${lang}: {`;
  const index = content.indexOf(marker);
  if (index === -1) {
    console.log(`Could not find ${lang} dictionary`);
    return;
  }
  
  // Find closing brace of this dictionary
  let braceCount = 1;
  let closeIndex = -1;
  for (let i = index + marker.length; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        closeIndex = i;
        break;
      }
    }
  }
  
  if (closeIndex === -1) {
    console.log(`Could not find closing brace for ${lang}`);
    return;
  }
  
  // Build insert content
  let insertText = '';
  Object.entries(keysToAdd).forEach(([key, val]) => {
    if (!content.slice(index, closeIndex).includes(`${key}:`)) {
      insertText += `    ${key}: '${val.replace(/'/g, "\\'")}',\n`;
    }
  });
  
  if (insertText) {
    content = content.slice(0, closeIndex) + insertText + content.slice(closeIndex);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added keys to other dictionaries!');
