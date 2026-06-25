import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/api/axios';

export default function Login() {
  const router = useRouter();
  const [email_or_phone, setEmail_or_phone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email_or_phone || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email_or_phone, password });
      const { token, user } = response.data;
      if(user.role!=='citoyen'){
        setError("cet application es reservé qux citoyens")
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem("user");
        return
      }
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Informations passe incorrect');
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
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Connexion</Text>
            <Text style={styles.headerSubtitle}>Bienvenue sur BloodLink</Text>
          </View>

          {/* FORMULAIRE */}
          <View style={styles.form}>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Numero de telephone ou adresse mail</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#94A3B8"
                value={email_or_phone}
                onChangeText={setEmail_or_phone}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btnLogin, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnLoginText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkRegister}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.linkRegisterText}>
                Pas encore de compte ?{' '}
                <Text style={styles.linkRegisterBold}>S'inscrire</Text>
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
  btnLogin: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnLoginText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  linkRegister: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkRegisterText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  linkRegisterBold: {
    color: '#DC2626',
    fontWeight: '600',
  },
});