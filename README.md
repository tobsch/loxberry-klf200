# LoxBerry Velux Plugin

A LoxBerry plugin that bridges Velux KLF-200 and KLF-150 io-homecontrol gateways to MQTT, enabling control of Velux windows, blinds, and shutters from Loxone and other home automation systems.

**Version**: 1.0.22
**Author**: Tobias Schlottke
**Repository**: [github.com/tobsch/loxberry-velux](https://github.com/tobsch/loxberry-velux)

## Features

- **Velux Gateway Integration**: Control all devices paired with your KLF-200 or KLF-150 gateway
- **MQTT Bridge**: Exposes all devices and scenes via MQTT topics
- **Real-time State Updates**: Automatic state synchronization from gateway to MQTT
- **Bidirectional Control**: Send commands via MQTT, receive state updates
- **Loxone Ready**: Designed for seamless integration with Loxone via LoxBerry MQTT Gateway
- **Home Assistant Compatible**: Standard MQTT topics work out of the box
- **Web Configuration UI**: Easy setup through LoxBerry admin interface
- **Persistent Connection**: Maintains connection with auto-reconnect

## Supported Gateways

| Gateway | Status | Notes |
|---------|--------|-------|
| **Velux KLF-200** | ✅ Fully tested | Primary development platform |
| **Velux KLF-150** | ✅ Compatible | Uses same API protocol |

Both gateways use the same io-homecontrol protocol and API, so this plugin works with either.

## Supported Devices

All io-homecontrol devices compatible with Velux gateways:

- **Roof windows** (VELUX INTEGRA)
- **Roller shutters**
- **Blinds** (venetian, pleated, etc.)
- **Awnings**
- **Garage doors**
- **Other io-homecontrol products**

## Requirements

- **LoxBerry**: Version 3.0 or higher
- **Node.js**: Version 18+ (automatically installed)
- **Velux Gateway**: KLF-200 (firmware 2.0.0.71+) or KLF-150
- **Network**: LAN/WLAN access between LoxBerry and gateway

## Quick Start

1. Install the plugin via LoxBerry Plugin Manager
2. Navigate to the plugin configuration page
3. Enter your gateway IP address and password (WiFi password on device label)
4. Click "Test Connection" to verify connectivity
5. Save configuration - devices will be auto-discovered
6. Configure MQTT Virtual Inputs/Outputs in Loxone Config

## MQTT Schema

The default topic prefix is `klf200` (configurable in plugin settings).

### Device State Topics (subscribe to these)

| Topic | Payload | Description |
|-------|---------|-------------|
| `klf200/status` | `online` / `offline` | Plugin connection status (retained) |
| `klf200/devices/{nodeId}/state` | JSON | Full device state object (retained) |
| `klf200/devices/{nodeId}/position` | `0-100` | Current position: 0=closed, 100=open (retained) |
| `klf200/devices/{nodeId}/moving` | `true/false` | Whether device is currently moving (retained) |
| `klf200/scenes/{sceneId}/state` | JSON | Scene information (retained) |
| `klf200/errors` | JSON | Error notifications (not retained) |

### Device State JSON Format

```json
{
  "nodeId": 0,
  "name": "Bedroom Window",
  "type": "window",
  "position": 50,
  "targetPosition": 50,
  "moving": false,
  "online": true,
  "error": null,
  "lastUpdate": "2024-01-15T10:30:00.000Z"
}
```

Device types: `window`, `blind`, `shutter`, `awning`, `garage`, `gate`, `lock`, `unknown`

### Command Topics (publish to these)

| Topic | Payload | Description |
|-------|---------|-------------|
| `klf200/devices/{nodeId}/cmd` | `open` | Open fully (100%) |
| `klf200/devices/{nodeId}/cmd` | `close` | Close fully (0%) |
| `klf200/devices/{nodeId}/cmd` | `stop` | Stop current movement |
| `klf200/devices/{nodeId}/cmd` | `0-100` | Set to specific position |
| `klf200/devices/{nodeId}/position/set` | `0-100` | Set to specific position (alternative) |
| `klf200/scenes/{sceneId}/cmd` | `run` | Execute a scene |
| `klf200/cmd` | `refresh` | Refresh all device states |
| `klf200/cmd` | `reconnect` | Force reconnect to gateway |

## Controlling Devices

### Position Values

- `0` = Fully closed (window closed, blind down, shutter closed)
- `100` = Fully open (window open, blind up, shutter open)
- `1-99` = Partial positions

### Command Line Examples (mosquitto)

```bash
# Open a window (nodeId 0)
mosquitto_pub -h localhost -t "klf200/devices/0/cmd" -m "open"

# Close a window
mosquitto_pub -h localhost -t "klf200/devices/0/cmd" -m "close"

# Stop movement
mosquitto_pub -h localhost -t "klf200/devices/0/cmd" -m "stop"

# Set blind to 50% (half open)
mosquitto_pub -h localhost -t "klf200/devices/1/cmd" -m "50"

# Alternative: use position/set topic
mosquitto_pub -h localhost -t "klf200/devices/1/position/set" -m "75"

# Run a scene (sceneId 0)
mosquitto_pub -h localhost -t "klf200/scenes/0/cmd" -m "run"

# Subscribe to all device updates
mosquitto_sub -h localhost -t "klf200/devices/#" -v

# Subscribe to a specific device position
mosquitto_sub -h localhost -t "klf200/devices/0/position"
```

### Finding Your Device IDs

After the plugin connects, it publishes all discovered devices to MQTT:

```bash
# List all devices
mosquitto_sub -h localhost -t "klf200/devices/+/state" -v -C 10
```

Or view them in the plugin's web interface under the "Devices" tab.

### Loxone Integration

1. In Loxone Config, create a **Virtual Output** for commands:
   - Address: `klf200/devices/0/cmd`
   - Use as Digital: Send `open`, `close`, `stop`
   - Or use as Analog: Send position `0-100`

2. Create a **Virtual Input** for state:
   - Address: `klf200/devices/0/position`
   - Use as Analog Input for position (0-100)

3. For movement status:
   - Address: `klf200/devices/0/moving`
   - Use as Digital Input (`true`/`false`)

### Home Assistant Integration

The plugin publishes standard MQTT topics that Home Assistant can consume:

```yaml
# configuration.yaml
cover:
  - platform: mqtt
    name: "Bedroom Window"
    command_topic: "klf200/devices/0/cmd"
    position_topic: "klf200/devices/0/position"
    set_position_topic: "klf200/devices/0/position/set"
    payload_open: "open"
    payload_close: "close"
    payload_stop: "stop"
    position_open: 100
    position_closed: 0
```

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [MQTT Topics Reference](docs/MQTT_TOPICS.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [Loxone Integration](docs/LOXONE_INTEGRATION.md)
- [Development Guide](AGENTS.md)

## Development

```bash
# Clone repository
git clone https://github.com/tobsch/loxberry-velux.git

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Package for LoxBerry
npm run package
```

## License

MIT License - see [LICENSE](LICENSE) file.

## Credits

- [klf-200-api](https://github.com/MiSchroe/klf-200-api) - Velux gateway Node.js API wrapper
- [LoxBerry](https://www.loxberry.de/) - Home automation middleware

## Support

- [GitHub Issues](https://github.com/tobsch/loxberry-velux/issues)
- [LoxForum](https://www.loxforum.com/)
