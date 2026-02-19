import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';
import LoginScreen from '../screens/LoginScreen';
import BottomNavigation from '../components/bottomNavigation/bottomNavbar';

export default function AppNavigator() {
    const { isLoggedIn, loading } = useWallet();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C47FF" />
            </View>
        );
    }

    if (!isLoggedIn) {
        return <LoginScreen />;
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }} />
            <BottomNavigation />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});