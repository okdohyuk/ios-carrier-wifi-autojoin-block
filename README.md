# iOS Carrier Wi-Fi Auto-Join Block

Apple configuration profile generator for blocking automatic connection to common Korean carrier-managed Wi-Fi SSIDs on iPhone and iPad.

## What this repository does

This repository generates a `.mobileconfig` profile that sets `AutoJoin=false` for selected SSIDs, including common hotspot names used by Korean carriers such as KT, SKT, and LG U+.

> [!IMPORTANT]
> Apple configuration profiles do **not** provide a single global “disable all Wi-Fi auto-join forever” switch. The supported approach is to define Wi-Fi payloads per SSID and set `AutoJoin` to `false` for each one.

## Included SSIDs

- `KTWiFi`
- `KT WiFi`
- `KT GiGA WiFi`
- `ollehWiFi`
- `T wifi zone`
- `T wifi zone_secure`
- `U+zone`
- `U+zone_5G`
- `U+wifi`

## Quick download

Each published version is attached as a GitHub Release asset:

- **Latest stable**: download the asset from the latest release
- **Older versions**: open the Releases page and pick the version you want

After the first release is published, users will be able to download:

- `korea-carrier-wifi-autojoin-block.mobileconfig`
- source archive for that exact tagged version

## Repository layout

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── pull_request_template.md
├── data/
│   └── ssids.yml
├── profiles/
│   └── korea-carrier-wifi-autojoin-block.mobileconfig
├── scripts/
│   ├── build-mobileconfig.mjs
│   └── check-mobileconfig.mjs
├── LICENSE
├── package.json
└── README.md
```

## Local development

```bash
npm run build
npm run check
```

Generated output:

```text
profiles/korea-carrier-wifi-autojoin-block.mobileconfig
```

## Versioning and release strategy

This repository uses **Semantic Versioning**.

- `MAJOR`: breaking behavioral changes or structural changes to the generated profile
- `MINOR`: add new SSIDs or new supported profile features without breaking existing usage
- `PATCH`: metadata fixes, documentation fixes, or non-breaking generation fixes

### Release flow

1. Changes merge into `main`
2. GitHub Actions updates a **draft release** automatically
3. Maintainer creates a version tag such as `v0.1.0`
4. Tag push triggers the release workflow
5. Workflow uploads the generated `.mobileconfig` as a downloadable release asset

This gives you:

- a rolling release draft from `main`
- downloadable assets for every published version
- reproducible source snapshots per tag

## GitHub automation included

### 1) Validation workflow

Runs on push and pull request to verify that the profile can be generated and passes a basic consistency check.

### 2) Release Drafter

Runs on `main` and updates a draft release automatically using merged PR labels and titles.

### 3) Tag release workflow

When you push a tag like `v0.1.0`, GitHub Actions:

- rebuilds the profile
- validates it
- creates a GitHub Release
- uploads `korea-carrier-wifi-autojoin-block.mobileconfig`

## How to add or remove SSIDs

Edit `data/ssids.yml`, then rebuild:

```bash
npm run build
npm run check
```

Open a pull request so the validation workflow and release draft can update automatically.

## Installation on iPhone

1. Download the `.mobileconfig` file from Releases
2. Open it on the iPhone
3. Go to **Settings → Profile Downloaded**
4. Install the profile
5. If the device already remembers a matching SSID, consider selecting that Wi-Fi and turning off auto-join manually once, or forgetting/rejoining if iOS keeps old state around

## Known limitations

- Carrier bundles or managed device policies may override expected behavior
- Apple community reports suggest `AutoJoin=false` is not perfectly reliable in every carrier-controlled environment
- New SSIDs may appear over time and require repository updates

## License

MIT
