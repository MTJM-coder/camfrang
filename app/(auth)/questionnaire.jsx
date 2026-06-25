import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, ScrollView,
  StyleSheet,
  Switch,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

export default function Questionnaire() {
  const router = useRouter();
  const [form, setForm] = useState({
    a_tatouage_recent: false,
    maladies_cardiovasculaires: false,
    douleurs_thoraciques: false,
    consomme_alcool: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const questions = [
    {
      key: 'a_tatouage_recent',
      label: 'Avez-vous eu un tatouage ou piercing au cours des 6 derniers mois ?',
      icon: 'alert-triangle',
    },
    {
      key: 'maladies_cardiovasculaires',
      label: 'Souffrez-vous de maladies cardiovasculaires ?',
      icon: 'heart',
    },
    {
      key: 'douleurs_thoraciques',
      label: 'Avez-vous des douleurs thoraciques récurrentes ?',
      icon: 'activity',
    },
    {
      key: 'consomme_alcool',
      label: 'Consommez-vous de l\'alcool régulièrement ?',
      icon: 'coffee',
    },
  ];

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/citoyen/questionnaire', form);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Questionnaire santé</Text>
          <Text style={styles.headerSubtitle}>
            Ces informations permettent de vérifier votre éligibilité au don de sang
          </Text>
        </View>

        {/* CONTENU */}
        <View style={styles.content}>

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#2563EB" />
            <Text style={styles.infoText}>
              Répondez honnêtement — ces informations sont confidentielles et servent uniquement à protéger les receveurs.
            </Text>
          </View>

          {questions.map((q) => (
            <View key={q.key} style={styles.questionCard}>
              <View style={styles.questionLeft}>
                <View style={styles.questionIcon}>
                  <Feather name={q.icon} size={18} color="#DC2626" />
                </View>
                <Text style={styles.questionText}>{q.label}</Text>
              </View>
              <Switch
                value={form[q.key]}
                onValueChange={(v) => setForm({ ...form, [q.key]: v })}
                trackColor={{ false: '#EEF1F5', true: '#FCA5A5' }}
                thumbColor={form[q.key] ? '#DC2626' : '#94A3B8'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btnSubmit, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnSubmitText}>Terminer l'inscription</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSkip} onPress={handleSkip}>
            <Text style={styles.btnSkipText}>Passer pour l'instant</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626',
  },
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
    minHeight: 500,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    fontSize: 13,
    color: '#2563EB',
    flex: 1,
    lineHeight: 20,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEF1F5',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  questionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  questionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  questionText: {
    fontSize: 13,
    color: '#1E293B',
    flex: 1,
    lineHeight: 20,
  },
  btnSubmit: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSkip: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  btnSkipText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});