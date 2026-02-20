// Polymarket API URLs
export const RELAYER_URL = "https://relayer-v2.polymarket.com/";
export const CLOB_API_URL = "https://clob.polymarket.com";
export const GEOBLOCK_API_URL = "https://polymarket.com/api/geoblock";
export const GAMMA_API_URL = "https://gamma-api.polymarket.com";
export const POLYMARKET_PROFILE_URL = (address) =>
    `https://polymarket.com/${address}`;

// Backend API
export const BACKEND_URL =
    process.env.EXPO_PUBLIC_BACKEND_URL || "https://polymarket-backend-2edb.onrender.com/api";

// RPC
export const POLYGON_RPC_URL =
    process.env.EXPO_PUBLIC_RPC_URL || "https://polygon-rpc.com";

// Remote signing endpoint
export const REMOTE_SIGNING_URL = () => `${BACKEND_URL}/sign`;