import React, { useEffect, useState } from 'react';
import { View, Text, ToastAndroid, Platform, Alert } from 'react-native';
import * as Battery from 'expo-battery';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

const BatteryAlert: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const level = await Battery.getBatteryLevelAsync();
      const charging = await Battery.getBatteryStateAsync();
      setBatteryLevel(level);
      setIsCharging(charging === Battery.BatteryState.CHARGING);
    })();

    const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
    });

    const batteryStateListener = Battery.addBatteryStateListener(({ batteryState }) => {
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    });

    return () => {
      batteryLevelListener.remove();
      batteryStateListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isCharging && batteryLevel !== null && batteryLevel >= 0.9) {
      alertUser();
    }
  }, [batteryLevel, isCharging]);

  const alertUser = async () => {
    // Play a sound
    const { sound } = await Audio.Sound.createAsync(require('@/assets/alert.mp3'));
    setSound(sound);
    await sound.playAsync();

    // Display a toast message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Battery is above 90%', ToastAndroid.LONG);
    } else {
      Alert.alert('Battery Alert', 'Battery is above 90%');
    }

    // Send a notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Battery Alert',
        body: 'Battery is above 90%',
      },
      trigger: null,
    });
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <></>
  );
};

export default BatteryAlert;
