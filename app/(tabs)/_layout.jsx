import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#DC2626',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: '#F1F5F9',
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        home: 'home',
                        rechercher: 'search',
                        alertes: 'bell',
                        profil: 'user',
                    };
                    return <Feather name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
            <Tabs.Screen name="rechercher" options={{ title: 'Recherche' }} />
            <Tabs.Screen name="alertes" options={{ title: 'Alertes' }} />
            <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
        </Tabs>
    );
}

