export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationService {
  getCurrentCoordinates(): Promise<Coordinates>;
}
