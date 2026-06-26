import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Modal,
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

const TYPE_BADGE = {
  URGENCE_IMMEDIATE: { label: 'Urgent', bg: '#FEF2F2', text: '#991B1B' },
  RECONSTITUTION: { label: 'Normal', bg: '#FFFBEB', text: '#92400E' },
};

const GROUPE_BG = {
  URGENCE_IMMEDIATE: { bg: '#FEF2F2', text: '#DC2626' },
  RECONSTITUTION: { bg: '#EFF6FF', text: '#2563EB' },
};

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repondreId, setRepondreId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    api.get('/alertes/actives')
      .then((res) => setAlertes(res.data.alertes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRepondre = async (id) => {
    setRepondreId(id);
    try {
      const res = await api.post(`/alertes/${id}/repondre`);
      setConfirmation(res.data.reponse);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible de répondre');
    } finally {
      setRepondreId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alertes actives</Text>
          <Text style={styles.headerSubtitle}>
            {alertes.length} alerte{alertes.length > 1 ? 's' : ''} près de vous
          </Text>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color="#DC2626" style={{ marginTop: 40 }} />
          ) : alertes.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="bell-off" size={32} color="#94A3B8" />
              <Text style={styles.emptyText}>Aucune alerte active</Text>
              <Text style={styles.emptySubtext}>Revenez plus tard</Text>
            </View>
          ) : (
            alertes.map((alerte) => {
              const badge = TYPE_BADGE[alerte.type_alerte] || TYPE_BADGE.RECONSTITUTION;
              const groupeStyle = GROUPE_BG[alerte.type_alerte] || GROUPE_BG.RECONSTITUTION;
              const isResponding = repondreId === alerte.id_alerte;

              return (
                <View key={alerte.id_alerte} style={styles.alerteCard}>
                  <View style={styles.alerteHeader}>
                    <View style={styles.alerteLeft}>
                      <View style={[styles.groupeBadge, { backgroundColor: groupeStyle.bg }]}>
                        <Text style={[styles.groupeText, { color: groupeStyle.text }]}>
                          {alerte.groupe}{alerte.rhesus || ''}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.alerteType}>
                          {alerte.type_alerte === 'URGENCE_IMMEDIATE' ? 'Urgence immédiate' : 'Reconstitution'}
                        </Text>
                        <Text style={styles.alerteBanque}>{alerte.banque?.nom}</Text>
                      </View>
                    </View>
                    <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.typeBadgeText, { color: badge.text }]}>{badge.label}</Text>
                    </View>
                  </View>

                  <Text style={styles.alerteDistance}>
                    {alerte.distance_km ?? '?'} km
                  </Text>

                  {!alerte.eligible && alerte.raison_ineligibilite ? (
                    <View style={styles.ineligibleBox}>
                      <Feather name="info" size={13} color="#F59E0B" />
                      <Text style={styles.ineligibleText}>{alerte.raison_ineligibilite}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btnRepondre, isResponding && styles.btnDisabled]}
                      onPress={() => handleRepondre(alerte.id_alerte)}
                      disabled={isResponding}
                    >
                      {isResponding ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.btnRepondreText}>Répondre à l'alerte</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* MODALE CONFIRMATION */}
      <Modal visible={!!confirmation} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <View style={styles.modalIcon}>
              <Feather name="check-circle" size={40} color="#16A34A" />
            </View>

            <Text style={styles.modalTitle}>Réponse enregistrée !</Text>
            <Text style={styles.modalSubtitle}>
              Présentez ce numéro en arrivant à la banque
            </Text>

            <View style={styles.numeroBox}>
              <Text style={styles.numeroText}>{confirmation?.numero_reponse}</Text>
            </View>

            <View style={styles.modalInfo}>
              <Feather name="map-pin" size={14} color="#94A3B8" />
              <Text style={styles.modalInfoText}>{confirmation?.banque}</Text>
            </View>

            <View style={styles.modalInfo}>
              <Feather name="phone" size={14} color="#94A3B8" />
              <Text style={styles.modalInfoText}>{confirmation?.telephone}</Text>
            </View>

            <Text style={styles.modalInstructions}>
              {confirmation?.instructions}
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setConfirmation(null)}
            >
              <Text style={styles.modalBtnText}>Compris</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DC2626' },
  header: { backgroundColor: '#DC2626', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  content: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12, minHeight: 400 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  emptySubtext: { fontSize: 13, color: '#94A3B8' },
  alerteCard: { borderWidth: 1, borderColor: '#EEF1F5', borderRadius: 14, padding: 14, gap: 10 },
  alerteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alerteLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  groupeBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  groupeText: { fontSize: 12, fontWeight: '700' },
  alerteType: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  alerteBanque: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  alerteDistance: { fontSize: 12, color: '#94A3B8' },
  ineligibleBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFFBEB', borderRadius: 10, padding: 10 },
  ineligibleText: { fontSize: 12, color: '#92400E', flex: 1, lineHeight: 18 },
  btnRepondre: { backgroundColor: '#DC2626', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnRepondreText: { color: 'white', fontSize: 13, fontWeight: '700' },

  // MODALE
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, alignItems: 'center', gap: 12 },
  modalIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  modalSubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },
  numeroBox: { backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#DC2626', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, borderStyle: 'dashed' },
  numeroText: { fontSize: 22, fontWeight: '700', color: '#DC2626', letterSpacing: 2 },
  modalInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalInfoText: { fontSize: 13, color: '#64748B' },
  modalInstructions: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },
  modalBtn: { backgroundColor: '#DC2626', borderRadius: 12, paddingVertical: 13, paddingHorizontal: 40, marginTop: 8 },
  modalBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
});