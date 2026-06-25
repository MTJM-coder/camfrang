import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator, Linking,
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

const GROUPES = ['O', 'A', 'B', 'AB'];
const RHESUS = ['+', '-'];

const STATUT_COLOR = {
  OK: { bg: '#F0FDF4', text: '#16A34A' },
  FAIBLE: { bg: '#FFFBEB', text: '#F59E0B' },
  CRITIQUE: { bg: '#FEF2F2', text: '#DC2626' },
  RUPTURE: { bg: '#F1F5F9', text: '#94A3B8' },
};

export default function Rechercher() {
  const [groupe, setGroupe] = useState('');
  const [rhesus, setRhesus] = useState('');
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rechercheFaite, setRechercheFaite] = useState(false);

  const handleRecherche = async () => {
    if (!groupe || !rhesus) return;
    setLoading(true);
    setRechercheFaite(true);

    try {
      const res = await api.get('/sang/recherche', {
        params: { groupe_sanguin: groupe, rhesus },
      });
      setResultats(res.data.resultats || res.data.data || []);
    } catch (e) {
      setResultats([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chercher du sang</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Groupe sanguin</Text>
            <View style={styles.filterRow}>
              {GROUPES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.filterBtn, groupe === g && styles.filterBtnActive]}
                  onPress={() => setGroupe(g)}
                >
                  <Text style={[styles.filterBtnText, groupe === g && styles.filterBtnTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterLabel, { marginTop: 10 }]}>Rhésus</Text>
            <View style={styles.filterRow}>
              {RHESUS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.filterBtn, rhesus === r && styles.filterBtnActive]}
                  onPress={() => setRhesus(r)}
                >
                  <Text style={[styles.filterBtnText, rhesus === r && styles.filterBtnTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btnRecherche, (!groupe || !rhesus) && styles.btnDisabled]}
            onPress={handleRecherche}
            disabled={!groupe || !rhesus}
          >
            {loading ? (
              <ActivityIndicator color="#DC2626" />
            ) : (
              <>
                <Feather name="search" size={16} color="#DC2626" />
                <Text style={styles.btnRechercheText}>Rechercher</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* RESULTATS */}
        <View style={styles.content}>
          {rechercheFaite && !loading && (
            <Text style={styles.resultatCount}>
              {resultats.length} banque{resultats.length > 1 ? 's' : ''} trouvée{resultats.length > 1 ? 's' : ''}
            </Text>
          )}

          {resultats.map((b) => {
            const statut = b.stock?.statut || 'RUPTURE';
            const colors = STATUT_COLOR[statut] || STATUT_COLOR.RUPTURE;
            return (
              <View key={b.id_banque} style={styles.banqueCard}>
                <View style={styles.banqueHeader}>
                  <View style={styles.banqueInfo}>
                    <Text style={styles.banqueNom}>{b.nom}</Text>
                    <Text style={styles.banqueDetail}>
                      {b.distance_km != null ? `${b.distance_km} km • ` : ''}{b.quartier || b.ville}
                    </Text>
                  </View>
                  <View style={[styles.statutBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statutText, { color: colors.text }]}>{statut}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.btnItineraire}
                  onPress={() => Linking.openURL(b.itineraire_url)}
                >
                  <Feather name="map-pin" size={14} color="white" />
                  <Text style={styles.btnItineraireText}>Voir itinéraire</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {rechercheFaite && !loading && resultats.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="alert-circle" size={32} color="#94A3B8" />
              <Text style={styles.emptyText}>Aucune banque trouvée</Text>
              <Text style={styles.emptySubtext}>Essayez un autre groupe sanguin</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DC2626' },
  header: { backgroundColor: '#DC2626', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  filterSection: { marginBottom: 14 },
  filterLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8 },
  filterRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  filterBtnActive: { backgroundColor: 'white' },
  filterBtnText: { color: 'white', fontSize: 13, fontWeight: '500' },
  filterBtnTextActive: { color: '#DC2626', fontWeight: '700' },
  btnRecherche: { backgroundColor: 'white', borderRadius: 12, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnDisabled: { opacity: 0.5 },
  btnRechercheText: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
  content: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12, minHeight: 400 },
  resultatCount: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginBottom: 4 },
  banqueCard: { borderWidth: 1, borderColor: '#EEF1F5', borderRadius: 14, padding: 14, gap: 10 },
  banqueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  banqueInfo: { flex: 1 },
  banqueNom: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  banqueDetail: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statutBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statutText: { fontSize: 11, fontWeight: '600' },
  btnItineraire: { backgroundColor: '#DC2626', borderRadius: 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnItineraireText: { color: 'white', fontSize: 13, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  emptySubtext: { fontSize: 13, color: '#94A3B8' },
});