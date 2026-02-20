import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = {
    white: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#6e6e6e',
    textTertiary: '#9e9e9e',
    accent: '#6C47FF', // User's purple accent
    success: '#2e7d32', // User's green
    successBg: '#e8f5e9',
    error: '#c62828', // User's red
    errorBg: '#ffebee',
    box: '#f7f7f7',
    border: '#eeeeee',
};

const MarketCard = ({ market, onPress }) => {
    if (!market) return null;

    // Helper to safely handle Gamma API's varying data formats
    const parseData = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    };

    const outcomes = parseData(market.outcomes);
    const outcomePrices = parseData(market.outcomePrices);

    // Fallback for prices if available in tokens array (common in some Gamma responses)
    const yesPrice = outcomePrices[0]
        ? `${(parseFloat(outcomePrices[0]) * 100).toFixed(0)}¢`
        : (market.tokens?.[0]?.price ? `${(parseFloat(market.tokens[0].price) * 100).toFixed(0)}¢` : 'N/A');

    const noPrice = outcomePrices[1]
        ? `${(parseFloat(outcomePrices[1]) * 100).toFixed(0)}¢`
        : (market.tokens?.[1]?.price ? `${(parseFloat(market.tokens[1].price) * 100).toFixed(0)}¢` : 'N/A');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.header}>
                <Image
                    source={{ uri: market.icon || 'https://polymarket.com/favicon.ico' }}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{market.groupAlpha || 'Crypto'}</Text>
                </View>
            </View>

            <Text style={styles.question} numberOfLines={2}>
                {market.question}
            </Text>

            <View style={styles.priceRow}>
                <View style={[styles.priceButton, styles.yesButton]}>
                    <Text style={styles.buttonLabel}>YES</Text>
                    <Text style={[styles.priceText, styles.yesText]}>{yesPrice}</Text>
                </View>

                <View style={[styles.priceButton, styles.noButton]}>
                    <Text style={styles.buttonLabel}>NO</Text>
                    <Text style={[styles.priceText, styles.noText]}>{noPrice}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>
                        Vol: ${parseFloat(market.volume || 0).toLocaleString()}
                    </Text>
                    <View style={styles.dot} />
                    <Text style={styles.statsText}>
                        Liq: ${parseFloat(market.liquidity || 0).toLocaleString()}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    tagContainer: {
        backgroundColor: colors.box,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    question: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
        lineHeight: 22,
    },
    priceRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    priceButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesButton: {
        backgroundColor: colors.successBg,
    },
    noButton: {
        backgroundColor: colors.errorBg,
    },
    buttonLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: colors.textSecondary,
        marginBottom: 2,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '800',
    },
    yesText: {
        color: colors.success,
    },
    noText: {
        color: colors.error,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.box,
        paddingTop: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.textTertiary,
    },
});

export default MarketCard;