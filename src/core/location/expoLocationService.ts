import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import type { LocationService } from './LocationService';

export function createExpoLocationService(): LocationService {
  return {
    getCurrentCoordinates: async () => {
      const position = await Location.getCurrentPositionAsync({
        accuracy: LocationAccuracy.Balanced,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    },
  };
}
