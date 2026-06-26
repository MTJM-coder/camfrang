import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ecouterNotifications, enregistrerNotifications } from './services/notifications';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Enregistrer les notifications au démarrage
    enregistrerNotifications();

    // Écouter les notifications
    const cleanup = ecouterNotifications(
      (notification) => {
        // Notification reçue en foreground
        console.log('Alerte reçue:', notification.request.content);
      },
      (response) => {
        // Utilisateur a cliqué sur la notification
        const data = response.notification.request.content.data;
        if (data?.alerte_id) {
          router.push('/(tabs)/alertes');
        }
      }
    );

    return cleanup;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}