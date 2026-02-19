import React, { useState } from 'react';
import { View } from 'react-native';
import WalletScreen from '../screens/WalletScreen';
import BottomNavigation from '../components/bottomNavigation/bottomNavbar';

const screens = {
    home: () => <View style={{ flex: 1 }} />,
    stats: () => <View style={{ flex: 1 }} />,
    trophy: () => <View style={{ flex: 1 }} />,
    albums: () => <View style={{ flex: 1 }} />,
    wallet: WalletScreen,
};

export default function BottomTabNavigator() {
    const [activeTab, setActiveTab] = useState('home');
    const CurrentScreen = screens[activeTab];

    return (
        <View style={{ flex: 1 }}>
            <CurrentScreen />
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
    );
}
