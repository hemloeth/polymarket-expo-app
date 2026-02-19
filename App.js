import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from './src/context/WalletContext';
import RootNavigator from './src/navigation/RootNavigator';
import { getMagic } from './src/lib/magic';

const magic = getMagic();

export default function App() {
    return (
        <SafeAreaProvider>
            <WalletProvider>
                <RootNavigator />
                <magic.Relayer />
                <StatusBar style="auto" />
            </WalletProvider>
        </SafeAreaProvider>
    );
}