import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "orangered"
      }}

    >
      <View style={styles.container}>
        <Text>
          <FontAwesome name="tint" size={90} color="#fff" />;
        </Text>
      </View>
      <Text style={styles.title}>CamFrang</Text>
      <Text style={styles.slogan}>Le premier lexique du camfranglais à dans votre poche</Text>
      <Link href={'/tabs/home'} style={styles.btn}>
        <Pressable>
          <Text style={{ fontSize: 20, color: "orangered", fontWeight: 500 }}>Commencer</Text>
        </Pressable>
      </Link>
      {/* <Link href={'/'} style={styles.slogan}>J'ai déja un compte</Link> */}
    </SafeAreaView>
  );


}
const styles = StyleSheet.create({
  container: { backgroundColor: "rgba(255, 255, 255,0.4)", padding: 40, borderRadius: 25 },
  title: { fontSize: 40, color: "white", fontWeight: "bold", paddingBottom: 10, paddingTop: 10 },
  slogan: { fontSize: 20, color: '#fff', textAlign: "center", marginHorizontal: 60 },
  btn: { backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 50, marginTop: 70, marginBottom: 30, borderRadius: 30 }
})