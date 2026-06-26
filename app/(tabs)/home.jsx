import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [citoyen, setCitoyen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => {
      if (u) setUser(JSON.parse(u));
    });

    api.get('/user/profile')
      .then((res) => {
        const userData = res.data.user;
        setUser(userData);
        setCitoyen(userData.citoyen);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const toggleDisponible = async () => {
    try {
      const res = await api.put('/citoyen/disponibilite', {
        disponible: !citoyen?.disponible,
      });
      setCitoyen(res.data.user.citoyen);
    } catch (e) { }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerGreeting}>Bonjour</Text>
              <Text style={styles.headerName}>
                {user?.prenom || 'Donneur'} {user?.nom || ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.disponibleBadge}
              onPress={toggleDisponible}
            >
              <View style={[
                styles.dot,
                { backgroundColor: citoyen?.disponible ? '#4ADE80' : '#94A3B8' }
              ]} />
              <Text style={styles.disponibleText}>
                {citoyen?.disponible ? 'Disponible' : 'Indisponible'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.infoIcon}>
                <Feather name="droplet" size={16} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Groupe sanguin</Text>
                <Text style={styles.infoValue}>
                  {citoyen?.groupe_sanguin || '—'}{citoyen?.rhesus || ''}
                </Text>
              </View>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoLabel}>Dernier don</Text>
              <Text style={styles.infoValue}>
                {citoyen?.date_dernier_don
                  ? new Date(citoyen.date_dernier_don).toLocaleDateString('fr-FR')
                  : 'Jamais'}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENU */}
        <View style={styles.content}>

          <Text style={styles.sectionTitle}>Que voulez-vous faire ?</Text>

          {/* 3 ACTIONS */}
          <ActionCard
            bg="#FEF2F2"
            iconBg="#DC2626"
            icon="search"
            title="Chercher du sang"
            subtitle="Trouver une banque disponible"
            chevronColor="#DC2626"
            onPress={() => router.push('/(tabs)/rechercher')}
          />
          <ActionCard
            bg="#EFF6FF"
            iconBg="#2563EB"
            icon="bell"
            title="Voir les alertes"
            subtitle="Répondre aux besoins urgents"
            chevronColor="#2563EB"
            onPress={() => router.push('/(tabs)/alertes')}
          />
          <ActionCard
            bg="#F0FDF4"
            iconBg="#16A34A"
            icon="heart"
            title="Proposer un don"
            subtitle="Donner de votre propre initiative"
            chevronColor="#16A34A"
            onPress={() => router.push('/(tabs)/alertes')}
          />

          {/* STATS */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Vos statistiques</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{citoyen?.nb_dons ?? 0}</Text>
              <Text style={styles.statLabel}>Dons effectués</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[
                styles.statValue,
                { color: citoyen?.eligible ? '#16A34A' : '#F59E0B', fontSize: 16 }
              ]}>
                {citoyen?.eligible ? 'Éligible' : 'Non éligible'}
              </Text>
              <Text style={styles.statLabel}>Statut actuel</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ bg, iconBg, icon, title, subtitle, chevronColor, onPress }) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: bg }]} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={20} color="white" />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={chevronColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DC2626' },
  header: { backgroundColor: '#DC2626', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerGreeting: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  headerName: { color: 'white', fontSize: 20, fontWeight: '700', marginTop: 2 },
  disponibleBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  disponibleText: { color: 'white', fontSize: 12, fontWeight: '500' },
  infoCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { width: 32, height: 32, backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  infoValue: { color: 'white', fontSize: 16, fontWeight: '700', marginTop: 2 },
  infoRight: { alignItems: 'flex-end' },
  content: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 10, minHeight: 500 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  actionCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, gap: 12 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  actionSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderWidth: 1, borderColor: '#EEF1F5', borderRadius: 12, padding: 14 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#DC2626' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});