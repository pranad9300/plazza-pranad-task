import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { PermissionState } from '@/core/permissions';
import { useDependencies } from '@/di/DependenciesProvider';
import type { DeliveryCoords } from '../../domain/entities/PermissionSnapshot';

function formatCoords(coords: DeliveryCoords): string {
  return `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
}

function needsAction(state: PermissionState): boolean {
  return state === 'undetermined' || state === 'denied' || state === 'blocked';
}

function canRequestAgain(state: PermissionState): boolean {
  return state === 'undetermined' || state === 'denied';
}

export function usePermissionsViewModel() {
  const { permissions, location, settingsLinker } = useDependencies();
  const [locationState, setLocationState] = useState<PermissionState>('undetermined');
  const [notificationState, setNotificationState] = useState<PermissionState>('undetermined');
  const [coordsLabel, setCoordsLabel] = useState<string | null>(null);
  const requestingRef = useRef(false);
  const didAskOnLaunchRef = useRef(false);

  const loadCoords = useCallback(async () => {
    try {
      const coords = await location.getCurrentCoordinates();
      setCoordsLabel(formatCoords(coords));
    } catch {
      setCoordsLabel(null);
    }
  }, [location]);

  const refresh = useCallback(async () => {
    const [loc, notif] = await Promise.all([
      permissions.getLocation(),
      permissions.getNotifications(),
    ]);
    setLocationState(loc);
    setNotificationState(notif);
    if (loc === 'granted') {
      await loadCoords();
    } else {
      setCoordsLabel(null);
    }
  }, [permissions, loadCoords]);

  const requestAll = useCallback(async () => {
    if (requestingRef.current) {
      return;
    }
    requestingRef.current = true;
    try {
      const currentLoc = await permissions.getLocation();
      const currentNotif = await permissions.getNotifications();

      // Brief: ask again while denied; only blocked must go to Settings.
      const nextLoc = canRequestAgain(currentLoc)
        ? await permissions.requestLocation()
        : currentLoc;
      const nextNotif = canRequestAgain(currentNotif)
        ? await permissions.requestNotifications()
        : currentNotif;

      setLocationState(nextLoc);
      setNotificationState(nextNotif);
      if (nextLoc === 'granted') {
        await loadCoords();
      } else {
        setCoordsLabel(null);
      }
    } finally {
      requestingRef.current = false;
    }
  }, [permissions, loadCoords]);

  const openSettings = useCallback(async () => {
    await settingsLinker.openAppSettings();
  }, [settingsLinker]);

  useEffect(() => {
    void (async () => {
      await refresh();
      if (!didAskOnLaunchRef.current) {
        didAskOnLaunchRef.current = true;
        await requestAll();
      }
    })();
  }, [refresh, requestAll]);

  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === 'active') {
        void refresh();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refresh]);

  const locationNeedsAction = needsAction(locationState);
  const notificationNeedsAction = needsAction(notificationState);
  const needsRationale = locationNeedsAction || notificationNeedsAction;
  const isBlocked = locationState === 'blocked' || notificationState === 'blocked';

  return {
    locationState,
    notificationState,
    coordsLabel,
    deliveryLine:
      locationState !== 'granted'
        ? 'Delivering to: Location unavailable'
        : coordsLabel
          ? `Delivering to: ${coordsLabel}`
          : 'Delivering to: Location unavailable',
    needsRationale,
    isBlocked,
    locationNeedsAction,
    notificationNeedsAction,
    requestAll,
    openSettings,
    refresh,
  };
}
