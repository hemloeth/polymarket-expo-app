// Use a more reliable public RPC (or replace with Alchemy/Infura later)
export const POLYGON_RPC_URL = "https://polygon-mainnet.g.alchemy.com/v2/2i-S900zJGeYg--6TY4OL";
export const POLYGON_CHAIN_ID = 137;
// Re-export API URLs from centralized location
export {
    RELAYER_URL,
    CLOB_API_URL,
    POLYMARKET_PROFILE_URL,
    REMOTE_SIGNING_URL,
} from "./api";

// Chain configuration

// Session storage
export const SESSION_STORAGE_KEY = "polymarket_trading_session";