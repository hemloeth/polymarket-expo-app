import { useCallback } from "react";
import { ClobClient } from "@polymarket/clob-client";
import { useWallet } from "../context/WalletContext";
import { CLOB_API_URL, POLYGON_CHAIN_ID } from "../constant/polymarket";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_CREDENTIALS_KEY = "polymarket_api_credentials";

export default function useUserApiCredentials() {
    const { address, signer } = useWallet();

    const createOrDeriveUserApiCredentials = useCallback(async () => {
        if (!address || !signer) throw new Error("Wallet not connected");

        const storageKey = `${API_CREDENTIALS_KEY}_${address.toLowerCase()}`;

        // ClobClient usually expects an ethers signer.
        const tempClient = new ClobClient(
            CLOB_API_URL,
            POLYGON_CHAIN_ID,
            signer
        );

        try {
            // Try to derive existing credentials first
            console.log("[TRACING] createOrDeriveUserApiCredentials started for:", address);

            let credentials;
            try {
                const derivedCreds = await tempClient.deriveApiKey();
                if (derivedCreds?.key && derivedCreds?.secret && derivedCreds?.passphrase) {
                    console.log("Successfully derived existing User API Credentials");
                    credentials = derivedCreds;
                }
            } catch (e) {
                // This catch avoids the 'Red Box' in many React Native environments
                // The CLOB SDK might still log a 400 to the console (XHR failure), which is harmless
                console.log("[STATUS] No existing remote credentials found. This is normal for brand-new users.");
            }

            if (!credentials) {
                // Create new credentials if derivation failed or returned nothing
                console.log("Creating new User API Credentials...");
                credentials = await tempClient.createApiKey();
                console.log("Successfully created new User API Credentials");
            }

            // Store in address-specific AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(credentials));
            return credentials;
        } catch (err) {
            console.error("Critical failure in credential management:", err);
            // We only throw if the ACTUAL key creation fails
            throw err;
        }
    }, [address, signer]);

    const getStoredCredentials = useCallback(async () => {
        if (!address) return null;
        const storageKey = `${API_CREDENTIALS_KEY}_${address.toLowerCase()}`;
        const stored = await AsyncStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : null;
    }, [address]);

    const clearAllStoredCredentials = useCallback(async () => {
        try {
            // Clear current scoped key
            if (address) {
                const storageKey = `${API_CREDENTIALS_KEY}_${address.toLowerCase()}`;
                await AsyncStorage.removeItem(storageKey);
            }
            // Clear legacy global key
            await AsyncStorage.removeItem(API_CREDENTIALS_KEY);
            console.log("✅ Credentials cleared from local storage");
            return true;
        } catch (err) {
            console.error("Failed to clear credentials:", err);
            return false;
        }
    }, [address]);

    return { createOrDeriveUserApiCredentials, getStoredCredentials, clearAllStoredCredentials };
}
