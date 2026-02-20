import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import SetupModal from '../components/setup/SetupModal';
import useTokenApprovals from '../hooks/useTokenApprovals';
import useUserApiCredentials from '../hooks/useUserApiCredentials';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const colors = {
    bg: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#6e6e6e',
    textTertiary: '#9e9e9e',
    accent: '#000000',
    white: '#ffffff',
    success: '#4CAF50',
    error: '#FF5252',
    box: '#f7f7f7',
    border: '#eeeeee',
};

export default function WalletScreen() {
    const { logout, loading, safeAddress, safeBalances, transferUsdc, initializeSigner, signer, usdcBalance } = useWallet();
    const { checkAllTokenApprovals } = useTokenApprovals();
    const { getStoredCredentials } = useUserApiCredentials();

    const [copied, setCopied] = useState(false);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);

    // Trading Setup State
    const [isTradingEnabled, setIsTradingEnabled] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [isSetupModalVisible, setIsSetupModalVisible] = useState(false);

    useEffect(() => {
        if (!signer) {
            initializeSigner();
        }
    }, [signer]);

    useEffect(() => {
        if (safeAddress) {
            checkTradingStatus();
        }
    }, [safeAddress]);

    const checkTradingStatus = async () => {
        if (!safeAddress) return;
        setIsCheckingStatus(true);
        try {
            const { allApproved } = await checkAllTokenApprovals(safeAddress);
            const credentials = await getStoredCredentials();
            setIsTradingEnabled(allApproved && !!credentials);
        } catch (error) {
            console.error("Failed to check trading status:", error);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const copyToClipboard = async () => {
        if (safeAddress) {
            await Clipboard.setStringAsync(safeAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWithdraw = async () => {
        if (!recipient || !amount) {
            Alert.alert('Error', 'Please enter both recipient address and amount');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setTransferLoading(true);
        try {
            const txHash = await transferUsdc({
                recipient,
                amount: parseFloat(amount),
            });
            Alert.alert('Success', `Withdrawal successful!\nTransaction Hash: ${txHash}`);
            setIsWithdrawModalVisible(false);
            setRecipient('');
            setAmount('');
        } catch (error) {
            Alert.alert('Error', error.message || 'Transfer failed');
        } finally {
            setTransferLoading(false);
        }
    };

    const displayBalance = safeBalances?.usdc != null ? safeBalances.usdc : '0.00';
    const mainWalletUsdc = usdcBalance || '0.00';

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Account</Text>
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                ) : (
                    <View style={styles.content}>
                        {/* Balance Overview */}
                        <View style={styles.balanceSection}>
                            <Text style={styles.balanceLabel}>Main Balance</Text>
                            <View style={styles.balanceRow}>
                                <Text style={styles.balanceAmount}>${displayBalance}</Text>
                                <View style={styles.tokenPill}>
                                    <Text style={styles.tokenSymbol}>USDC</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.withdrawButton}
                                onPress={() => setIsWithdrawModalVisible(true)}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="arrow-up-right" size={20} color={colors.white} />
                                <Text style={styles.withdrawButtonText}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Trading Setup Card */}
                        <View style={styles.tuningCard}>
                            <View style={styles.tuningHeader}>
                                <View style={styles.tuningTitleRow}>
                                    <MaterialCommunityIcons
                                        name={isTradingEnabled ? "check-decagram" : "alert-circle-outline"}
                                        size={20}
                                        color={isTradingEnabled ? colors.success : colors.error}
                                    />
                                    <Text style={styles.tuningTitle}>Trading Readiness</Text>
                                </View>
                                {isCheckingStatus && <ActivityIndicator size="small" color={colors.accent} />}
                            </View>

                            <View style={styles.tuningContent}>
                                {isTradingEnabled ? (
                                    <Text style={styles.tuningStatusSuccess}>Your wallet is ready for trading on Polymarket.</Text>
                                ) : (
                                    <>
                                        <Text style={styles.tuningStatusPending}>Complete the setup to start trading on Polymarket.</Text>
                                        <TouchableOpacity
                                            style={styles.enableButton}
                                            onPress={() => setIsSetupModalVisible(true)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.enableButtonText}>Complete Setup</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Deposit Address Card */}
                        <View style={styles.depositCard}>
                            <View style={styles.depositHeader}>
                                <Text style={styles.depositTitle}>Deposit Address</Text>
                                <Text style={styles.networkLabel}>Polygon Network</Text>
                            </View>

                            <View style={styles.addressContainer}>
                                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                                    {safeAddress || 'Address not available'}
                                </Text>
                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={copyToClipboard}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name={copied ? "check" : "content-copy"}
                                        size={20}
                                        color={copied ? colors.success : colors.textPrimary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.depositHint}>
                                Send only USDC on Polygon network to this address.
                            </Text>
                        </View>

                        {/* Signer Info / Secondary Balance Info */}
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Main Wallet Balance</Text>
                            <Text style={styles.infoValue}>{mainWalletUsdc} USDC</Text>
                            <Text style={styles.infoSubtext}>Funds in your main wallet are used for withdrawals.</Text>
                        </View>

                        {/* Logout Button */}
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Withdrawal Modal */}
            <Modal
                visible={isWithdrawModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsWithdrawModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Withdraw USDC</Text>
                            <TouchableOpacity onPress={() => setIsWithdrawModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Recipient Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0x..."
                                value={recipient}
                                onChangeText={setRecipient}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputHeader}>
                                <Text style={styles.inputLabel}>Amount</Text>
                                <Text style={styles.maxLabel}>Max: {mainWalletUsdc}</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.confirmButton, transferLoading && styles.disabledButton]}
                            onPress={handleWithdraw}
                            disabled={transferLoading}
                        >
                            {transferLoading ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.confirmButtonText}>Send USDC</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Setup Modal */}
            <SetupModal
                visible={isSetupModalVisible}
                onClose={() => setIsSetupModalVisible(false)}
                onComplete={() => {
                    setIsSetupModalVisible(false);
                    checkTradingStatus();
                }}
            />
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
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    balanceSection: {
        marginVertical: 32,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    balanceAmount: {
        fontSize: 48,
        color: colors.textPrimary,
        fontWeight: '800',
        letterSpacing: -1,
    },
    tokenPill: {
        backgroundColor: colors.box,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 12,
    },
    tokenSymbol: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    withdrawButton: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
    },
    withdrawButtonText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 16,
    },
    depositCard: {
        backgroundColor: colors.box,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    depositHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    depositTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    networkLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        backgroundColor: '#e8e8e8',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    addressContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eeeeee',
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        marginRight: 12,
    },
    copyButton: {
        padding: 4,
    },
    depositHint: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textTertiary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    infoSubtext: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 16,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingBottom: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    maxLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textTertiary,
    },
    input: {
        backgroundColor: colors.box,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    confirmButton: {
        backgroundColor: colors.accent,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.6,
    },
    tuningCard: {
        backgroundColor: colors.box,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    tuningHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tuningTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tuningTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    tuningContent: {
        marginTop: 4,
    },
    tuningStatusSuccess: {
        fontSize: 14,
        color: colors.success,
        fontWeight: '600',
    },
    tuningStatusPending: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    enableButton: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    enableButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});
