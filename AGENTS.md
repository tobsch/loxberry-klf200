# Release Workflow

## LoxBerry Auto-Update System

This plugin supports LoxBerry's automatic update feature. Users can configure auto-updates in the LoxBerry Plugin Management UI.

### Configuration Files

- `plugin/plugin.cfg` - Contains `AUTOUPDATE=1` and `RELEASECFG` URL
- `release.cfg` - Contains current version and download URL

### Publishing a New Release

When publishing a new version (e.g., upgrading from `1.0.24` to `1.0.25`):

1. **Update version in `plugin/plugin.cfg`**:
   ```ini
   VERSION=1.0.25
   ```

2. **Update `release.cfg`** with new version and URLs:
   ```ini
   VERSION=1.0.25
   ARCHIVEURL=https://github.com/tobsch/loxberry-velux/archive/v1.0.25.zip
   INFOURL=https://github.com/tobsch/loxberry-velux/releases/tag/v1.0.25
   ```

3. **Commit and push** to main branch

4. **Create GitHub release** tagged `v1.0.25`

### How It Works

1. LoxBerry checks `release.cfg` daily via the URL in `plugin.cfg`
2. Compares `VERSION` in `release.cfg` to installed version
3. If newer, downloads ZIP from `ARCHIVEURL` and installs automatically
4. Users receive notifications based on their settings (Off/Notify only/Releases/Pre- and Releases)

### Pre-releases (Optional)

To support pre-releases, create a `prerelease.cfg` with the same format and add the URL to `plugin.cfg`:
```ini
PRERELEASECFG=https://raw.githubusercontent.com/tobsch/loxberry-velux/main/prerelease.cfg
```
