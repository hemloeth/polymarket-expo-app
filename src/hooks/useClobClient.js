import { useState, useEffect } from 'react';
import { ClobClient } from "@polymarket/clob-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { useWallet } from "../context/WalletContext";
import { CLOB_API_URL, POLYGON_CHAIN_ID, REMOTE_SIGNING_URL } from "../constant/polymarket";
import useUserApiCredentials from "./useUserApiCredentials";

/**
 * Hook to initialize and provide a Polymarket ClobClient instance
 * Includes Builder order attribution and Safe signature support
 */
export default function useClobClient() {
    const { signer, safeAddress } = useWallet();
    const { getStoredCredentials } = useUserApiCredentials();
    const [clobClient, setClobClient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initClient = async () => {
            if (!signer || !safeAddress) {
                setClobClient(null);
                return;
            }

            try {
                setLoading(true);
                const creds = await getStoredCredentials();

                if (!creds) {
                    setClobClient(null);
                    setLoading(false);
                    return;
                }

                console.log("Initializing CLOB Client with Safe Address:", safeAddress);

                const builderConfig = new BuilderConfig({
                    remoteBuilderConfig: {
                        url: REMOTE_SIGNING_URL(),
                    },
                });

                const client = new ClobClient(
                    CLOB_API_URL,
                    POLYGON_CHAIN_ID,
                    signer,
                    creds,
                    2, // signatureType = 2 for EOA associated to a Gnosis Safe proxy wallet
                    safeAddress,
                    undefined,
                    false,
                    builderConfig
                );

                setClobClient(client);
                setError(null);
            } catch (err) {
                console.error("Failed to initialize CLOB client:", err);
                setError(err);
                setClobClient(null);
            } finally {
                setLoading(false);
            }
        };

        initClient();
    }, [signer, safeAddress]);

    return { clobClient, loading, error };
}
