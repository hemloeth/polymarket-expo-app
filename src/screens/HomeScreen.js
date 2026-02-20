import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useMarkets from '../hooks/useMarkets';
import MarketCard from '../components/MarketCard';

const colors = {
    bg: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#6e6e6e',
    accent: '#6C47FF', // User's purple accent
    border: '#eeeeee',
    box: '#f7f7f7',
};

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState('crypto');
    const { markets, loading, error, refetch, loadMore, hasMore } = useMarkets(selectedCategory);

    const categories = [
        { id: 'crypto', label: 'Crypto' },
        { id: 'btc', label: 'BTC' },
        { id: 'eth', label: 'ETH' },
        { id: 'sol', label: 'SOL' },
    ];

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>🪙 Crypto Markets</Text>
            <View style={styles.tagWrapper}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.tagList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tag,
                                selectedCategory === item.id && styles.activeTag
                            ]}
                            onPress={() => setSelectedCategory(item.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tagText,
                                selectedCategory === item.id && styles.activeTagText
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!loading || markets.length === 0) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.accent} />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.centerContainer}>
            {!loading && (
                <>
                    <Text style={styles.emptyText}>No crypto markets found.</Text>
                    <Text style={styles.emptySubtext}>Try refreshing the page.</Text>
                </>
            )}
        </View>
    );

    if (error && markets.length === 0) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Oops! Failed to load markets.</Text>
                    <Text style={styles.errorSubtext}>{error}</Text>
                    <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 20 }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top']}>
            <FlatList
                data={markets}
                keyExtractor={(item) => item.id || item.marketId || Math.random().toString()}
                renderItem={({ item }) => (
                    <MarketCard
                        market={item}
                        onPress={() => console.log('Market selected:', item.question)}
                    />
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && markets.length > 0}
                        onRefresh={refetch}
                        tintColor={colors.accent}
                    />
                }
            />
            {loading && markets.length === 0 && (
                <View style={[StyleSheet.absoluteFill, styles.overlayLoader]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for bottom tab
    },
    header: {
        paddingTop: 30, // Increased to clear notch/camera
        paddingBottom: 12,
    },
    tagWrapper: {
        marginTop: 20,
        marginHorizontal: -20,
    },
    tagList: {
        paddingHorizontal: 20,
        gap: 10,
    },
    tag: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: colors.box,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTag: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    activeTagText: {
        color: '#ffffff',
    },
    greeting: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    overlayLoader: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF5252',
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
