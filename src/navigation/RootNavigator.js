import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useWallet } from '../context/WalletContext';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';

export default function RootNavigator() {
    const { isLoggedIn, loading } = useWallet();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#202020" />
            </View>
        );
    }

    return isLoggedIn ? <BottomTabNavigator /> : <LoginScreen />;
}
