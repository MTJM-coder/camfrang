import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import api from '../api/axios';

// Configuration de l'affichage des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Demander la permission et récupérer le token FCM
export async function enregistrerNotifications() {
  if (!Device.isDevice) {
    console.log('Les notifications nécessitent un vrai appareil');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission notifications refusée');
    return null;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({
  projectId: 'votre-project-id-expo', // depuis app.json → expo.extra.eas.projectId
})).data;
    console.log('Token FCM:', token);

    // Envoyer le token au backend
    await api.post('/citoyen/fcm-token', { fcm_token: token });

    return token;
  } catch (error) {
    console.error('Erreur token FCM:', error);
    return null;
  }
}

// Écouter les notifications reçues
export function ecouterNotifications(onNotification, onResponse) {
  const notifListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification reçue:', notification);
      if (onNotification) onNotification(notification);
    }
  );

  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification cliquée:', response);
      if (onResponse) onResponse(response);
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notifListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}