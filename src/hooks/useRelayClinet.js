"use client";

import { useState, useCallback } from "react";
import { RelayClient } from "@polymarket/builder-relayer-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { getMagic } from "../lib/magic"; // Use relative path
import {
    RELAYER_URL,
    REMOTE_SIGNING_URL,
} from "../constant/api";
import { POLYGON_CHAIN_ID } from "../constant/polymarket";

export default function useRelayClient() {
    const [relayClient, setRelayClient] = useState(null);

    const initializeRelayClient = useCallback(async () => {
        try {
            const magic = getMagic();

            // Create Viem Wallet Client from Magic provider
            const walletClient = createWalletClient({
                account: (await magic.user.getMetadata()).publicAddress,
                chain: polygon,
                transport: custom(magic.rpcProvider),
            });

            // Configure Builder Signing with backend URL
            // REMOTE_SIGNING_URL is likely a function returning the URL
            const builderConfig = new BuilderConfig({
                remoteBuilderConfig: {
                    url: REMOTE_SIGNING_URL(),
                },
            });

            // Initialize Relay Client
            const client = new RelayClient(
                RELAYER_URL,
                POLYGON_CHAIN_ID,
                walletClient,
                builderConfig
            );

            setRelayClient(client);
            return client;
        } catch (error) {
            console.error("Failed to initialize RelayClient:", error);
            throw error;
        }
    }, []);

    const clearRelayClient = useCallback(() => {
        setRelayClient(null);
    }, []);

    return {
        relayClient,
        initializeRelayClient,
        clearRelayClient,
    };
}
