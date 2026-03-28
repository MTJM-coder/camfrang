import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
    return (
        <>
            <SafeAreaView style={{ flex: 1 / 3, backgroundColor: "orangered", paddingHorizontal: 40, paddingTop: 30 }}>
                <View>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: "500", paddingBottom: 10, paddingTop: 10 }}>
                        how mollah ?
                    </Text>
                </View>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "500", paddingBottom: 10, paddingTop: 10 }} numberOfLines={2}>
                    Que veux-tu apprendre aujourd'hui ?
                </Text>
            </SafeAreaView>

            <SafeAreaView style={styles.main}>

                <View style={styles.container}>
                    <Link href={'/'} asChild>
                        <Pressable style={styles.card}>
                            <View style={styles.iconContainer}>
                                <FontAwesome name='search' size={20} color={"orangered"} />
                            </View>
                            <Text style={styles.cardTitle}>Rechercher un mot</Text>
                            <Text style={styles.cardText}>500+ mots</Text>
                        </Pressable>
                    </Link>
                    <Link href={'/'} asChild>
                        <Pressable style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: "#bef8b4" }]}>
                                <FontAwesome name='star' size={20} color={"green"} />
                            </View>
                            <Text style={styles.cardTitle}>Mot du jour</Text>
                            <Text style={styles.cardText}>Nouveau mot chaque jour</Text>
                        </Pressable>
                    </Link>
                </View>

                <View style={styles.container}>
                    <Link href={'/'} asChild>
                        <Pressable style={styles.card}>
                            <View style={styles.iconContainer}>
                                <FontAwesome name='heart' size={20} color={"orangered"} />
                            </View>
                            <Text style={styles.cardTitle}>Mes favoris</Text>
                            <Text style={styles.cardText}>0 mot sauvegardé</Text>
                        </Pressable>
                    </Link>
                    <Link href={'/'} asChild>

                        <Pressable style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: "#bef8b4" }]}>
                                <FontAwesome name='bars' size={20} color={"green"} />
                            </View>
                            <Text style={styles.cardTitle}>Catégorie</Text>
                            <Text style={styles.cardText}>Rue, argent, amour etc...</Text>
                        </Pressable>
                    </Link>
                </View>
            </SafeAreaView >
        </>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        height: 55,
        width: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 27.5,
        backgroundColor: "#f7dbc8"
    },
    main: { backgroundColor: "#f5f5f5", flex: 1/2, paddingRight: 34, paddingLeft: 34, gap: 20 },
    container: { flexDirection: "row", width: "100%", gap: 20 },
    card: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        borderRadius: 15,
        borderColor: 'gray',
        borderWidth: 1,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    cardTitle: { fontSize: 20, fontWeight: "500", marginVertical: 10 },
    cardText: { color: "gray" }
})

export default Home
