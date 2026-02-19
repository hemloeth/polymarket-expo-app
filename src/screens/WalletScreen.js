import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';

const colors = {
    bg: '#fbfbfb',
    box: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#6e6e6e',
    textTertiary: '#9e9e9e',
    accent: '#202020',
};

export default function WalletScreen() {
    const { address, user, logout, loading } = useWallet();
    const handleLogout = async () => {
        await logout();
    };

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Wallet</Text>
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                ) : (
                    <View style={styles.content}>
                        {/* Email Card */}
                        {user?.email && (
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>Email</Text>
                                <Text style={styles.cardValue}>{user.email}</Text>
                            </View>
                        )}

                        {/* Address Card */}
                        {address && (
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>Wallet Address</Text>
                                <Text style={styles.cardValue} numberOfLines={1}>
                                    {address}
                                </Text>
                                <Text style={styles.cardSubtext}>
                                    {address.substring(0, 6)}...{address.substring(address.length - 6)}
                                </Text>
                            </View>
                        )}

                        {/* Logout Button */}
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: colors.box,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: colors.box,
        fontSize: 16,
        fontWeight: '600',
    },
});