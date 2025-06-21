import { useEffect, useState } from 'react';
import { checkGeofenceStatus }  from '@/services/Geofencing';

export  function useGeofence(geolocationPolygon) {
  const [status, setStatus] = useState({
    coords: null,
    isInsidePolygon: null,
    isMocked: false,
    // isEmulator: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await checkGeofenceStatus(geolocationPolygon);
        setStatus({ ...result, error: null });
      } catch (err) {
        setStatus((prev) => ({ ...prev, error: err.message }));
      }
    })();
  }, []);

  return status;
}
