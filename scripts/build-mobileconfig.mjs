import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'yaml';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const dataPath = path.join(repoRoot, 'data', 'ssids.yml');
const pkgPath = path.join(repoRoot, 'package.json');
const outPath = path.join(repoRoot, 'profiles', 'korea-carrier-wifi-autojoin-block.mobileconfig');

const config = yaml.parse(fs.readFileSync(dataPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const xmlEscape = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const uuidFor = (seed) => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 32).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5').toUpperCase();

const payloadUuid = uuidFor(`${config.profile.identifier}@${pkg.version}`);

const networkPayloads = config.networks.map((network) => {
  const identifier = `${config.profile.identifier}.${network.identifier_suffix}`;
  const uuid = uuidFor(identifier);
  return `    <dict>
      <key>AutoJoin</key><false/>
      <key>EncryptionType</key><string>Any</string>
      <key>HIDDEN_NETWORK</key><false/>
      <key>PayloadDescription</key><string>${xmlEscape(`Disable auto-join for ${network.display_name}`)}</string>
      <key>PayloadDisplayName</key><string>${xmlEscape(`Block ${network.display_name} Auto-Join`)}</string>
      <key>PayloadIdentifier</key><string>${xmlEscape(identifier)}</string>
      <key>PayloadType</key><string>com.apple.wifi.managed</string>
      <key>PayloadUUID</key><string>${uuid}</string>
      <key>PayloadVersion</key><integer>1</integer>
      <key>SSID_STR</key><string>${xmlEscape(network.ssid)}</string>
    </dict>`;
}).join('\n');

const document = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
${networkPayloads}
  </array>
  <key>PayloadDescription</key>
  <string>${xmlEscape(config.profile.description)}</string>
  <key>PayloadDisplayName</key>
  <string>${xmlEscape(config.profile.display_name)}</string>
  <key>PayloadIdentifier</key>
  <string>${xmlEscape(config.profile.identifier)}</string>
  <key>PayloadOrganization</key>
  <string>${xmlEscape(config.organization)}</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${payloadUuid}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, document);
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
