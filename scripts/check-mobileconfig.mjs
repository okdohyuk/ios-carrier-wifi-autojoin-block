import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const target = path.join(repoRoot, 'profiles', 'korea-carrier-wifi-autojoin-block.mobileconfig');

if (!fs.existsSync(target)) {
  console.error('Missing generated profile:', target);
  process.exit(1);
}

const content = fs.readFileSync(target, 'utf8');
const required = [
  '<plist version="1.0">',
  '<string>Configuration</string>',
  '<string>com.apple.wifi.managed</string>',
  '<key>AutoJoin</key><false/>'
];

for (const snippet of required) {
  if (!content.includes(snippet)) {
    console.error('Validation failed. Missing snippet:', snippet);
    process.exit(1);
  }
}

const payloadCount = (content.match(/<key>SSID_STR<\/key>/g) || []).length;
if (payloadCount < 3) {
  console.error('Validation failed. Unexpected SSID payload count:', payloadCount);
  process.exit(1);
}

console.log(`Validated profile with ${payloadCount} SSIDs`);
