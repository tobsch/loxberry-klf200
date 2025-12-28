#!/bin/bash

# KLF200 Plugin - Pre-uninstall script
# This runs before the plugin is removed

echo "<INFO> KLF200 Plugin pre-uninstall starting..."

# Backup configuration before uninstall so it can be restored on reinstall
# Note: $LBPCONFIG already includes /klf200
BACKUP_DIR="/tmp/klf200_backup"
CONFIG_FILE="$LBPCONFIG/klf200.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "<INFO> Backing up configuration to $BACKUP_DIR..."
    mkdir -p "$BACKUP_DIR"
    cp "$CONFIG_FILE" "$BACKUP_DIR/klf200.json"
    echo "<OK> Configuration backed up."
else
    echo "<INFO> No configuration file found to backup."
fi

# Stop and disable the service
echo "<INFO> Stopping service..."
sudo /usr/bin/systemctl stop klf200.service 2>/dev/null || true
sudo /usr/bin/systemctl disable klf200.service 2>/dev/null || true

# Remove systemd service file
sudo rm -f /etc/systemd/system/klf200.service
sudo /usr/bin/systemctl daemon-reload

# Remove sudoers file
sudo rm -f /etc/sudoers.d/klf200

echo "<OK> Pre-uninstall completed."
exit 0
