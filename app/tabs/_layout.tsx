import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function layout(){
    return(
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "orangered",
            tabBarInactiveTintColor: "gray",
            tabBarStyle:{
                backgroundColor: "#fff",
                // elevation:10,
                height: 100,
                borderTopWidth: 1,
            },

            tabBarLabelStyle:{
                fontSize: 12,
                fontWeight: "bold",
                marginTop: 10
            }
        }}>
            <Tabs.Screen name="home" options={{ title: "Accueil",tabBarIcon: ({color}) => <FontAwesome name="home" size={24} color={color} /> }} />
            <Tabs.Screen name="chercher" options={{ title: "Chercher",tabBarIcon: ({color}) => <FontAwesome name="search" size={24} color={color} /> }} />
            <Tabs.Screen name="favoris" options={{ title: "Favoris",tabBarIcon: ({color}) => <FontAwesome name="heart" size={24} color={color} /> }} />
            <Tabs.Screen name="categorie" options={{ title: "Categorie",tabBarIcon: ({color}) => <FontAwesome name="bars" size={24} color={color} /> }} />
            <Tabs.Screen name="index" options={{ href: null }} />
        </Tabs>
    )
}