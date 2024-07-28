// NetworkStatusManager.tsx
import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const NetworkStatusManager: React.FC = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        Toast.show({
          type: 'success',
          text1: 'Internet Connected',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Internet Disconnected',
          position: 'top',
        });
      }
    });

    // Cleanup the event listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default NetworkStatusManager;
