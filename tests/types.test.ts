/**
 * Type Utility Tests
 */

import {
  DeviceType,
  getDeviceType,
  klfPositionToPercent,
  percentToKlfPosition,
  ACTUATOR_TYPE_MAP
} from '../src/types';

describe('Type Utilities', () => {
  describe('getDeviceType', () => {
    test('should return WINDOW for WindowOpener actuator type', () => {
      expect(getDeviceType(4)).toBe(DeviceType.WINDOW);
    });

    test('should return SHUTTER for RollerShutter actuator type', () => {
      expect(getDeviceType(2)).toBe(DeviceType.SHUTTER);
    });

    test('should return BLIND for VenetianBlind actuator type', () => {
      expect(getDeviceType(1)).toBe(DeviceType.BLIND);
    });

    test('should return AWNING for Awning actuator type', () => {
      expect(getDeviceType(3)).toBe(DeviceType.AWNING);
    });

    test('should return GARAGE for GarageOpener actuator type', () => {
      expect(getDeviceType(5)).toBe(DeviceType.GARAGE);
    });

    test('should return GATE for GateOpener actuator type', () => {
      expect(getDeviceType(7)).toBe(DeviceType.GATE);
    });

    test('should return LOCK for Lock actuator type', () => {
      expect(getDeviceType(9)).toBe(DeviceType.LOCK);
    });

    test('should return UNKNOWN for unrecognized type', () => {
      expect(getDeviceType(9999)).toBe(DeviceType.UNKNOWN);
    });
  });

  describe('klfPositionToPercent', () => {
    test('should convert 0 (fully open in KLF) to 100%', () => {
      expect(klfPositionToPercent(0)).toBe(100);
    });

    test('should convert 1 (fully closed in KLF) to 0%', () => {
      expect(klfPositionToPercent(1)).toBe(0);
    });

    test('should convert 0.5 to 50%', () => {
      expect(klfPositionToPercent(0.5)).toBe(50);
    });

    test('should convert 0.25 to 75%', () => {
      expect(klfPositionToPercent(0.25)).toBe(75);
    });

    test('should convert 0.75 to 25%', () => {
      expect(klfPositionToPercent(0.75)).toBe(25);
    });

    test('should round to nearest integer', () => {
      expect(klfPositionToPercent(0.333)).toBe(67);
      expect(klfPositionToPercent(0.666)).toBe(33);
    });
  });

  describe('percentToKlfPosition', () => {
    test('should convert 100% to 0 (fully open in KLF)', () => {
      expect(percentToKlfPosition(100)).toBe(0);
    });

    test('should convert 0% to 1 (fully closed in KLF)', () => {
      expect(percentToKlfPosition(0)).toBe(1);
    });

    test('should convert 50% to 0.5', () => {
      expect(percentToKlfPosition(50)).toBe(0.5);
    });

    test('should convert 75% to 0.25', () => {
      expect(percentToKlfPosition(75)).toBe(0.25);
    });

    test('should convert 25% to 0.75', () => {
      expect(percentToKlfPosition(25)).toBe(0.75);
    });
  });

  describe('Position conversion round-trip', () => {
    test('should be reversible for 0', () => {
      const klf = 0;
      const percent = klfPositionToPercent(klf);
      const back = percentToKlfPosition(percent);
      expect(back).toBe(klf);
    });

    test('should be reversible for 1', () => {
      const klf = 1;
      const percent = klfPositionToPercent(klf);
      const back = percentToKlfPosition(percent);
      expect(back).toBe(klf);
    });

    test('should be reversible for 0.5', () => {
      const klf = 0.5;
      const percent = klfPositionToPercent(klf);
      const back = percentToKlfPosition(percent);
      expect(back).toBe(klf);
    });

    test('should handle percent round-trip', () => {
      for (const percent of [0, 25, 50, 75, 100]) {
        const klf = percentToKlfPosition(percent);
        const back = klfPositionToPercent(klf);
        expect(back).toBe(percent);
      }
    });
  });

  describe('ACTUATOR_TYPE_MAP', () => {
    test('should have entries for common device types', () => {
      // Verify we have mappings for common actuator types
      expect(ACTUATOR_TYPE_MAP[4]).toBe(DeviceType.WINDOW);   // WindowOpener
      expect(ACTUATOR_TYPE_MAP[2]).toBe(DeviceType.SHUTTER);  // RollerShutter
      expect(ACTUATOR_TYPE_MAP[5]).toBe(DeviceType.GARAGE);   // GarageOpener
      expect(ACTUATOR_TYPE_MAP[7]).toBe(DeviceType.GATE);     // GateOpener
    });

    test('should not return undefined for mapped types', () => {
      Object.values(ACTUATOR_TYPE_MAP).forEach(type => {
        expect(type).toBeDefined();
        expect(Object.values(DeviceType)).toContain(type);
      });
    });
  });
});
