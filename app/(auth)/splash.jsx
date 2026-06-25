import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Splash() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      {/* Cercles décoratifs */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Logo */}
      <View style={styles.logoBox}>
        <Feather name="droplet" size={40} color="#DC2626" />
      </View>

      {/* Titre */}
      <Text style={styles.title}>BloodLink</Text>
      <Text style={styles.slogan}>Connectons les donneurs au besoin</Text>

      {/* Boutons */}
      <View style={styles.buttons}>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/(tabs)/recherche')}
        >
          <Feather name="search" size={18} color="#DC2626" />
          <Text style={styles.btnPrimaryText}>Chercher du sang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.btnSecondaryText}>S'inscrire — Devenir donneur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnLink}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.btnLinkText}>J'ai déjà un compte → Se connecter</Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.footer}>BloodLink © 2026 — Douala, Cameroun</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  slogan: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 60,
  },
  buttons: {
    width: '80%',
    alignItems: 'center',
    gap: 10,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnPrimaryText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSecondary: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 12,
  },
  btnSecondaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  btnLink: {
    paddingVertical: 10,
  },
  btnLinkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 14,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
});