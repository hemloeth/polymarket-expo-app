import { useState, useEffect } from 'react';
import { GAMMA_API_URL } from '../constant/api';

const LIMIT = 25;

const CRYPTO_FILTERS = {
    crypto: { tag_id: 21 },
    btc: { tag_id: 21, keyword: 'bitcoin' },
    eth: { tag_id: 21, keyword: 'ethereum' },
    sol: { tag_id: 21, keyword: 'solana' },
};

export default function useMarkets(category = 'crypto') {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMarkets(0);
    }, [category]);

    async function fetchMarkets(currentOffset = 0) {
        setLoading(true);
        try {
            const filter = CRYPTO_FILTERS[category];

            const response = await fetch(
                `${GAMMA_API_URL}/events?tag_id=${filter.tag_id}&closed=false&active=true&limit=${LIMIT}&offset=${currentOffset}&order=volume24hr&ascending=false`
            );
            const data = await response.json();

            let allMarkets = data.flatMap(event => event.markets || []);

            // Filter by keyword for BTC, ETH, SOL
            if (filter.keyword) {
                allMarkets = allMarkets.filter(market =>
                    market.question?.toLowerCase().includes(filter.keyword)
                );
            }

            if (currentOffset === 0) {
                setMarkets(allMarkets);
            } else {
                setMarkets(prev => [...prev, ...allMarkets]);
            }

            setHasMore(data.length === LIMIT);
            setOffset(currentOffset + LIMIT);
            console.log(`✅ ${category} markets fetched:`, allMarkets.length);
        } catch (err) {
            console.error('❌ Failed to fetch markets:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function loadMore() {
        if (!loading && hasMore) {
            fetchMarkets(offset);
        }
    }

    return {
        markets,
        loading,
        error,
        hasMore,
        loadMore,
        refetch: () => fetchMarkets(0),
    };
}