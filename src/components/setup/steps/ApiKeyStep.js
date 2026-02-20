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

const ApiKeyStep = ({ hasApiKey, onGenerate, isGenerating, isClobReady, onAutomate, isAutomating }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={isClobReady ? "shield-check" : "key-plus"}
                    size={64}
                    color={isClobReady ? colors.success : colors.accent}
                />
            </View>
            <Text style={styles.title}>Final Verification</Text>
            <Text style={styles.description}>
                {isClobReady
                    ? "Your trading account is fully initialized with order attribution and Safe support."
                    : "Generate your API credentials and initialize the trading client to start placing orders on Polymarket."}
            </Text>

            {!hasApiKey ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, (isGenerating || isAutomating) && styles.disabledButton]}
                        onPress={onGenerate}
                        disabled={isGenerating || isAutomating}
                    >
                        {isGenerating && !isAutomating ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Enable Trading</Text>
                                <MaterialCommunityIcons name="flash-outline" size={24} color={colors.white} />
                            </>
                        )}
                    </TouchableOpacity>

                    {!isAutomating && (
                        <TouchableOpacity
                            style={styles.automateButton}
                            onPress={onAutomate}
                        >
                            <MaterialCommunityIcons name="auto-fix" size={20} color={colors.accent} />
                            <Text style={styles.automateButtonText}>Automate Final Step</Text>
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
                <View style={styles.statusContainer}>
                    <View style={styles.statusItem}>
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color={colors.success}
                        />
                        <Text style={styles.statusText}>API Key Generated</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <MaterialCommunityIcons
                            name={isClobReady ? "check-circle" : "dots-horizontal"}
                            size={24}
                            color={isClobReady ? colors.success : colors.textTertiary}
                        />
                        <Text style={[styles.statusText, !isClobReady && { color: colors.textTertiary }]}>
                            {isClobReady ? "Trading Client Initialized" : "Initializing Client..."}
                        </Text>
                    </View>

                    {isClobReady && (
                        <View style={styles.attributionBadge}>
                            <MaterialCommunityIcons name="tag-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.attributionText}>Order Attribution Active</Text>
                        </View>
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
    statusContainer: {
        width: '100%',
        backgroundColor: colors.box,
        padding: 24,
        borderRadius: 20,
        gap: 16,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    attributionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
        gap: 4,
    },
    attributionText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textSecondary,
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

export default ApiKeyStep;
