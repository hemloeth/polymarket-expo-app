import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = {
    textPrimary: '#000000',
    textSecondary: '#6e6e6e',
    accent: '#000000',
    white: '#ffffff',
    success: '#4CAF50',
    error: '#FF5252',
    box: '#f7f7f7',
};

const TokenApprovalStep = ({ isApproved, onApprove, isApproving, onNext, onAutomate, isAutomating }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={isApproved ? "check-decagram" : "key-chain-variant"}
                    size={64}
                    color={isApproved ? colors.success : colors.accent}
                />
            </View>
            <Text style={styles.title}>Enable Trading</Text>
            <Text style={styles.description}>
                {isApproved
                    ? "Your wallet is fully authorized to interact with Polymarket contracts."
                    : "You need to approve USDC and Outcome tokens to enable seamless trading on Polymarket."}
            </Text>

            {!isApproved ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, (isApproving || isAutomating) && styles.disabledButton]}
                        onPress={onApprove}
                        disabled={isApproving || isAutomating}
                    >
                        {isApproving && !isAutomating ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Enable Trading</Text>
                                <MaterialCommunityIcons name="flash-outline" size={20} color={colors.white} />
                            </>
                        )}
                    </TouchableOpacity>

                    {!isAutomating && (
                        <TouchableOpacity
                            style={styles.automateButton}
                            onPress={onAutomate}
                        >
                            <MaterialCommunityIcons name="auto-fix" size={20} color={colors.accent} />
                            <Text style={styles.automateButtonText}>Automate Remaining Steps</Text>
                        </TouchableOpacity>
                    )}

                    {isAutomating && (
                        <View style={styles.automationStatus}>
                            <ActivityIndicator size="small" color={colors.accent} />
                            <Text style={styles.automationStatusText}>Automating Setup...</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.successContainer}>
                    <View style={styles.completedBadge}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                        <Text style={styles.completedText}>Approvals Ready</Text>
                    </View>

                    {!isAutomating && (
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={onNext}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.nextButtonText}>Next Step</Text>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.accent} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: colors.box,
        padding: 24,
        borderRadius: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        width: '100%',
        gap: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.7,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    completedText: {
        color: colors.success,
        fontWeight: '700',
        fontSize: 16,
    },
    successContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 24,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.accent,
        width: '100%',
        gap: 4,
    },
    nextButtonText: {
        color: colors.accent,
        fontSize: 18,
        fontWeight: '700',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    automateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.accent,
        borderStyle: 'dashed',
        gap: 8,
    },
    automateButtonText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: '600',
    },
    automationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    automationStatusText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default TokenApprovalStep;
