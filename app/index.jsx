import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/splash');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DC2626' }}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );
}