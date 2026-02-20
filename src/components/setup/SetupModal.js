import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SafeDeploymentStep from './steps/SafeDeploymentStep';
import TokenApprovalStep from './steps/TokenApprovalStep';
import ApiKeyStep from './steps/ApiKeyStep';
import useSafeDeployment from '../../hooks/useSafeDeployment';
import useTokenApprovals from '../../hooks/useTokenApprovals';
import useRelayClient from '../../hooks/useRelayClient';
import useUserApiCredentials from '../../hooks/useUserApiCredentials';
import useClobClient from '../../hooks/useClobClient';
import { useWallet } from '../../context/WalletContext';

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

const SetupModal = ({ visible, onClose, onComplete }) => {
    const { address, safeAddress } = useWallet();
    const { isSafeDeployed, deploySafe } = useSafeDeployment(address);
    const { checkAllTokenApprovals, setAllTokenApprovals } = useTokenApprovals();
    const { relayClient, initializeRelayClient } = useRelayClient();
    const { createOrDeriveUserApiCredentials, getStoredCredentials, clearAllStoredCredentials } = useUserApiCredentials();
    const { clobClient, loading: clobLoading } = useClobClient();

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSafeDepl, setIsSafeDepl] = useState(false);
    const [isTokenAppr, setIsTokenAppr] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [isAutomating, setIsAutomating] = useState(false);

    useEffect(() => {
        if (visible) {
            checkStatus();
        }
    }, [visible, safeAddress]);

    const checkStatus = async () => {
        setIsLoading(true);
        try {
            let client = relayClient;
            if (!client) {
                client = await initializeRelayClient();
            }

            // Step 1: Check Safe Deployment
            const deployed = await isSafeDeployed(client, safeAddress);
            setIsSafeDepl(deployed);

            // Step 2: Check Token Approvals
            const { allApproved } = await checkAllTokenApprovals(safeAddress);
            setIsTokenAppr(allApproved);

            // Step 3: Check API Key
            const credentials = await getStoredCredentials();
            setHasApiKey(!!credentials);

            // Determine current step based on first incomplete requirement
            if (!deployed) {
                setCurrentStep(1);
            } else if (!allApproved) {
                setCurrentStep(2);
            } else if (!credentials) {
                setCurrentStep(3);
            } else {
                // All steps complete
                onComplete?.();
            }
        } catch (error) {
            console.error("Setup status check failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        Alert.alert(
            "Reset Setup",
            "This will clear all local trading credentials. You will need to re-enable trading. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true);
                        await clearAllStoredCredentials();
                        setHasApiKey(false);
                        setCurrentStep(1);
                        await checkStatus();
                    }
                }
            ]
        );
    };

    const handleDeploySafe = async () => {
        setActionLoading(true);
        try {
            let client = relayClient;
            if (!client) {
                client = await initializeRelayClient();
            }
            await deploySafe(client);
            setIsSafeDepl(true);
            return true;
        } catch (error) {
            if (!isAutomating) {
                Alert.alert("Deployment Failed", error.message || "Could not deploy Safe wallet.");
            }
            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveTokens = async () => {
        setActionLoading(true);
        try {
            let client = relayClient;
            if (!client) {
                client = await initializeRelayClient();
            }
            const success = await setAllTokenApprovals(client);
            if (success) {
                setIsTokenAppr(true);
                return true;
            } else {
                throw new Error("Failed to set approvals.");
            }
        } catch (error) {
            if (!isAutomating) {
                Alert.alert("Approval Failed", error.message || "Could not approve tokens.");
            }
            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    const handleGenerateApiKey = async () => {
        setActionLoading(true);
        try {
            await createOrDeriveUserApiCredentials();
            setHasApiKey(true);
            if (!isAutomating) {
                Alert.alert("Success", "Trading setup complete!", [{ text: "Finish", onPress: onComplete }]);
            }
            return true;
        } catch (error) {
            if (!isAutomating) {
                Alert.alert("API Key Failed", error.message || "Could not generate API credentials.");
            }
            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    const handleAutomatedSetup = async () => {
        setIsAutomating(true);
        setIsLoading(true);
        try {
            let client = relayClient;
            if (!client) {
                client = await initializeRelayClient();
            }

            // Step 1: Deploy Safe if needed
            if (!isSafeDepl) {
                setCurrentStep(1);
                setIsLoading(false);
                await handleDeploySafe();
            }

            // Step 2: Token Approvals if needed
            if (!isTokenAppr) {
                setCurrentStep(2);
                setIsLoading(false);
                await handleApproveTokens();
            }

            // Step 3: API Key
            if (!hasApiKey) {
                setCurrentStep(3);
                setIsLoading(false);
                await handleGenerateApiKey();
            }

            Alert.alert("Setup Complete", "All steps finished successfully!", [{ text: "Start Trading", onPress: onComplete }]);
        } catch (error) {
            console.error("Automated setup failed:", error);
            Alert.alert("Setup Interrupted", "Automation stopped at step " + currentStep + ". " + (error.message || ""));
        } finally {
            setIsAutomating(false);
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={styles.loadingText}>Checking your wallet status...</Text>
                </View>
            );
        }

        switch (currentStep) {
            case 1:
                return (
                    <SafeDeploymentStep
                        isDeployed={isSafeDepl}
                        onDeploy={handleDeploySafe}
                        isDeploying={actionLoading}
                        onNext={() => setCurrentStep(2)}
                        onAutomate={handleAutomatedSetup}
                        isAutomating={isAutomating}
                    />
                );
            case 2:
                return (
                    <TokenApprovalStep
                        isApproved={isTokenAppr}
                        onApprove={handleApproveTokens}
                        isApproving={actionLoading}
                        onNext={() => setCurrentStep(3)}
                        onAutomate={handleAutomatedSetup}
                        isAutomating={isAutomating}
                    />
                );
            case 3:
                return (
                    <ApiKeyStep
                        hasApiKey={hasApiKey}
                        onGenerate={handleGenerateApiKey}
                        isGenerating={actionLoading || clobLoading}
                        isClobReady={!!clobClient}
                        onAutomate={handleAutomatedSetup}
                        isAutomating={isAutomating}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={[styles.stepDot, currentStep >= 1 && styles.activeDot, isSafeDepl && styles.completedDot]} />
                        <View style={[styles.stepLine, currentStep >= 2 && styles.activeLine]} />
                        <View style={[styles.stepDot, currentStep >= 2 && styles.activeDot, isTokenAppr && styles.completedDot]} />
                        <View style={[styles.stepLine, currentStep >= 3 && styles.activeLine]} />
                        <View style={[styles.stepDot, currentStep >= 3 && styles.activeDot, hasApiKey && styles.completedDot]} />
                    </View>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                        <MaterialCommunityIcons name="refresh" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {renderStep()}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Step {currentStep} of 3
                    </Text>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeButton: {
        padding: 4,
    },
    resetButton: {
        padding: 4,
        width: 40,
        alignItems: 'center',
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
    },
    activeDot: {
        backgroundColor: colors.accent,
        transform: [{ scale: 1.2 }],
    },
    completedDot: {
        backgroundColor: colors.success,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: '#e0e0e0',
    },
    activeLine: {
        backgroundColor: colors.accent,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    centerContent: {
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: colors.textTertiary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default SetupModal;
