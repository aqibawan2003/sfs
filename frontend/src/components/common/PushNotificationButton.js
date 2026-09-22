import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_BASE_URL from '../../utils/api';

const toUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const value = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(window.atob(value), character => character.charCodeAt(0));
};

const PushNotificationButton = () => {
  const [state, setState] = useState('checking');
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  useEffect(() => {
    if (!supported) return setState('unsupported');
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => registration.pushManager.getSubscription())
      .then(subscription => setState(subscription ? 'enabled' : Notification.permission === 'denied' ? 'denied' : 'disabled'))
      .catch(() => setState('unsupported'));
  }, [supported]);

  const enable = async () => {
    try {
      setState('working');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return setState(permission === 'denied' ? 'denied' : 'disabled');
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [{ data }, registration] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/push/public-key`, { headers }),
        navigator.serviceWorker.ready,
      ]);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUint8Array(data.publicKey),
      });
      await axios.post(`${API_BASE_URL}/api/push/subscribe`, subscription.toJSON(), { headers });
      setState('enabled');
    } catch (error) {
      console.error('Could not enable push notifications:', error);
      setState('disabled');
    }
  };

  const disable = async () => {
    try {
      setState('working');
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      const token = Cookies.get('token');

      if (subscription) {
        await axios.delete(`${API_BASE_URL}/api/push/unsubscribe`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { endpoint: subscription.endpoint },
        });
        await subscription.unsubscribe();
      }

      setState('disabled');
    } catch (error) {
      console.error('Could not disable push notifications:', error);
      setState('enabled');
    }
  };

  if (state === 'unsupported') return null;
  const isBusy = state === 'working' || state === 'checking';
  const isBlocked = state === 'denied';
  const isEnabled = state === 'enabled';
  const tooltip = isEnabled
    ? 'Disable phone alerts'
    : isBlocked
      ? 'Notifications are blocked. Allow them in your phone or browser settings.'
      : isBusy
        ? 'Setting up phone alerts…'
        : 'Enable phone alerts';

  return (
    <button
      type="button"
      onClick={isEnabled ? disable : enable}
      disabled={isBusy || isBlocked}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 text-base text-white/85 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-default disabled:opacity-45"
      title={tooltip}
      aria-label={tooltip}
    >
      {isBlocked ? '🔕' : '🔔'}
    </button>
  );
};

export default PushNotificationButton;
