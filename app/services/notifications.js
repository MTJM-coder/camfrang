import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Import ajouté
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import api from '../../src/api/axios';

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

  // 1. SÉCURITÉ : Vérifier si l'utilisateur est authentifié dans l'application
  const authToken = await AsyncStorage.getItem('token');
  if (!authToken) {
    console.log("Enregistrement annulé : Aucun token d'authentification trouvé (l'utilisateur n'est pas connecté).");
    return null; // On stoppe ici pour éviter l'erreur 401 sur le backend
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
      projectId: '96c00ee5-11a2-40ea-897d-d17232d8801b', // depuis app.json → expo.extra.eas.projectId
    })).data;
    console.log('Token FCM généré avec succès :', token);

    // Envoyer le token au backend (l'intercepteur Axios ajoutera automatiquement le Bearer token)
    await api.post('/citoyen/fcm-token', { fcm_token: token });
    console.log('Token FCM synchronisé avec le backend BloodLink !');

    return token;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du token FCM au backend :', error);
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