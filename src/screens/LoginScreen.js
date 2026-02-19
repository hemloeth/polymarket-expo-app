import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useWallet } from '../context/WalletContext';

export default function LoginScreen() {
    const { loginWithEmail, loading } = useWallet();
    const [email, setEmail] = useState('');

    const handleLogin = async () => {
        if (!email) return;
        await loginWithEmail(email);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>PolyMarket</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading || !email}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continue with Email</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#333',
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#6C47FF',
        marginBottom: 60,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#6C47FF',
        paddingVertical: 14,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});