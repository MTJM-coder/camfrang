import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,

  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

export default function Register() {
  const [showDatePicker, setShowDatePicker] = useState(false);
const [date, setDate] = useState(new Date())
  const router = useRouter();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    sexe:'',
    date_naissance:'',
    password: '',
    groupe_sanguin: '',
    rhesus: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const groupes = ['O', 'A', 'B', 'AB'];
  const rhesus = ['+', '-'];
  const onChangeDate = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(false);
  setDate(currentDate);

  setForm({
    ...form,
    date_naissance: currentDate.toISOString().split('T')[0], // format YYYY-MM-DD
  });
};

  const handleRegister = async () => {
    if (!form.nom || !form.telephone || !form.password || !form.groupe_sanguin || !form.rhesus) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/citizen/register', form);
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      router.replace('/(auth)/questionnaire');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Inscription</Text>
            <Text style={styles.headerSubtitle}>Créez votre compte donneur</Text>
          </View>

          {/* FORMULAIRE */}
          <View style={styles.form}>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Prénom *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jean"
                  placeholderTextColor="#94A3B8"
                  value={form.prenom}
                  onChangeText={(v) => setForm({ ...form, prenom: v })}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mballa"
                  placeholderTextColor="#94A3B8"
                  value={form.nom}
                  onChangeText={(v) => setForm({ ...form, nom: v })}
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-JJ"
                placeholderTextColor="#94A3B8"
                value={form.date_naisaance}
                onChangeText={(v) => setForm({ ...form, date_naissance: v })}
                keyboardType="date"
                
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor="#94A3B8"
                value={form.telephone}
                onChangeText={(v) => setForm({ ...form, telephone: v })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor="#94A3B8"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          <View style={styles.field}>
  <Text style={styles.label}>Sexe *</Text>

  <View style={styles.choixRow}>
    <TouchableOpacity
      style={[
        styles.choixBtn,
        form.sexe === 'M' && styles.choixBtnActive,
      ]}
      onPress={() => setForm({ ...form, sexe: 'M' })}
    >
      <Text
        style={[
          styles.choixText,
          form.sexe === 'M' && styles.choixTextActive,
        ]}
      >
        Homme
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.choixBtn,
        form.sexe === 'F' && styles.choixBtnActive,
      ]}
      onPress={() => setForm({ ...form, sexe: 'F' })}
    >
      <Text
        style={[
          styles.choixText,
          form.sexe === 'F' && styles.choixTextActive,
        ]}
      >
        Femme
      </Text>
    </TouchableOpacity>
  </View>
</View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={form.password}
                  onChangeText={(v) => setForm({ ...form, password: v })}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Groupe sanguin */}
            <View style={styles.field}>
              <Text style={styles.label}>Groupe sanguin *</Text>
              <View style={styles.choixRow}>
                {groupes.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.choixBtn, form.groupe_sanguin === g && styles.choixBtnActive]}
                    onPress={() => setForm({ ...form, groupe_sanguin: g })}
                  >
                    <Text style={[styles.choixText, form.groupe_sanguin === g && styles.choixTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rhésus */}
            <View style={styles.field}>
              <Text style={styles.label}>Rhésus *</Text>
              <View style={styles.choixRow}>
                {rhesus.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.choixBtn, form.rhesus === r && styles.choixBtnActive]}
                    onPress={() => setForm({ ...form, rhesus: r })}
                  >
                    <Text style={[styles.choixText, form.rhesus === r && styles.choixTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btnRegister, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnRegisterText}>Continuer</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkLogin}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.linkLoginText}>
                Déjà un compte ? <Text style={styles.linkLoginBold}>Se connecter</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  form: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    minHeight: 600,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EEF1F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF1F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  choixRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  choixBtn: {
    borderWidth: 1,
    borderColor: '#EEF1F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  choixBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  choixText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  choixTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  btnRegister: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnRegisterText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  linkLogin: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkLoginText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  linkLoginBold: {
    color: '#DC2626',
    fontWeight: '600',
  },
});