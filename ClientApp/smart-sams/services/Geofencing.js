import * as Location from 'expo-location';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import * as turf from "@turf/turf";
import { Platform } from 'react-native';

const polygonArea = turf.polygon([[
  [11.51005, 3.90104],
  [11.51037, 3.90120],
  [11.51015, 3.90079],
  [11.51053, 3.90098],
  [11.51005, 3.90104] // Closed polygon
]]);

export async function checkGeofenceStatus() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const currentLocation = await Location.getCurrentPositionAsync({});
  const coords = currentLocation.coords;

  // Check for fake GPS (mocked)
  const isMocked = Platform.OS === 'android' && currentLocation.mocked;

  // Check for emulator use
  const isPhysicalDevice = Device.isDevice;
  const networkInfo = await Network.getNetworkStateAsync();

  if (Platform.OS === 'ios') {
    if (!isPhysicalDevice || !networkInfo.isConnected || !networkInfo.isInternetReachable) {
      console.warn("⚠️ Suspicious iOS environment.");
    }
  }

  const myPoint = turf.point([coords.longitude, coords.latitude]);
  const isInsidePolygon = booleanPointInPolygon(myPoint, polygonArea);

  return {
    coords,
    isMocked,
    isInsidePolygon,
    isEmulator: !isPhysicalDevice,
  };
}
