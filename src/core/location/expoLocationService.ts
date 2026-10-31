import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import type { LocationService } from './LocationService';

function toCoords(position: Location.LocationObject) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function createExpoLocationService(): LocationService {
  return {
    getCurrentCoordinates: async () => {
      // Emulators often have no fresh GPS fix. Prefer last known, then a low-accuracy request.
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 1000 * 60 * 60,
        requiredAccuracy: 5000,
      });
      if (lastKnown) {
        return toCoords(lastKnown);
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: LocationAccuracy.Low,
      });
      return toCoords(position);
    },
  };
}
