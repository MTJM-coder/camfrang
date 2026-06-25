import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text, TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

export default function Profil() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [citoyen, setCitoyen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => {
      if (u) setUser(JSON.parse(u));
    });

    api.get('/citoyen/profil')
      .then((res) => setCitoyen(res.data.citoyen))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const toggleDisponible = async (value) => {
    try {
      const res = await api.put('/citoyen/disponibilite', { disponible: value });
      setCitoyen(res.data.citoyen);
    } catch (e) { }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) { }
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.replace('/(auth)/splash');
  };

  const initiales = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initiales}</Text>
          </View>
          <Text style={styles.headerName}>{user?.prenom} {user?.nom}</Text>
          <Text style={styles.headerSub}>
            {citoyen?.groupe_sanguin}{citoyen?.rhesus} • Donneur actif
          </Text>
        </View>

        {/* CONTENU */}
        <View style={styles.content}>

          {/* DISPONIBILITE */}
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Disponible à donner</Text>
            <Switch
              value={citoyen?.disponible ?? false}
              onValueChange={toggleDisponible}
              trackColor={{ false: '#EEF1F5', true: '#FCA5A5' }}
              thumbColor={citoyen?.disponible ? '#DC2626' : '#94A3B8'}
            />
          </View>

          <MenuItem
            icon="user"
            label="Modifier le profil"
            onPress={() => { }}
          />
          <MenuItem
            icon="clock"
            label="Historique des dons"
            onPress={() => { }}
          />
          <MenuItem
            icon="clipboard"
            label="Questionnaire santé"
            onPress={() => router.push('/(auth)/questionnaire')}
          />

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Feather name={icon} size={18} color="#94A3B8" />
        <Text style={styles.menuItemText}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#DC2626' },
  header: { 
    backgroundColor: '#DC2626', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 40, 
    alignItems: 'center'
   },
  avatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  avatarText: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '700' 
  },
  headerName: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '700'
   },
  headerSub: {
     color: 'rgba(255,255,255,0.7)', 
     fontSize: 13, 
     marginTop: 4 
    },
  content: { 
    backgroundColor: 'white',
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 20, 
    gap: 10, 
    minHeight: 400 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderColor: '#EEF1F5', 
    borderRadius: 12, 
    padding: 14 
  },
  menuItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  menuItemText: { 
    fontSize: 14, 
    color: '#1E293B' 
  },
  logoutItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    borderWidth: 1, 
    borderColor: '#FEE2E2', 
    borderRadius: 12, 
    padding: 14 },
  logoutText: { 
    fontSize: 14, 
    color: '#DC2626', 
    fontWeight: '500' 
  },
});