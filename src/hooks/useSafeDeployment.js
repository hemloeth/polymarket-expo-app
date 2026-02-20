import { useCallback, useMemo } from "react";
import {
    RelayerTransactionState,
} from "@polymarket/builder-relayer-client";
import { deriveSafe } from "@polymarket/builder-relayer-client/dist/builder/derive";
import { getContractConfig } from "@polymarket/builder-relayer-client/dist/config";
import { POLYGON_CHAIN_ID } from "../constant/polymarket";

export default function useSafeDeployment(eoaAddress) {

    const derivedSafeAddressFromEoa = useMemo(() => {
        if (!eoaAddress) return undefined;
        try {
            const config = getContractConfig(POLYGON_CHAIN_ID);
            return deriveSafe(eoaAddress, config.SafeContracts.SafeFactory);
        } catch (error) {
            console.error("Error deriving Safe address:", error);
            return undefined;
        }
    }, [eoaAddress]);

    const isSafeDeployed = useCallback(
        async (relayClient, safeAddr) => {
            try {
                const deployed = await relayClient.getDeployed(safeAddr);
                return deployed;
            } catch (err) {
                console.warn("API check failed", err);
                return false;
            }
        },
        []
    );

    const deploySafe = useCallback(
        async (relayClient) => {
            try {
                const response = await relayClient.deploy();

                const result = await relayClient.pollUntilState(
                    response.transactionID,
                    [
                        RelayerTransactionState.STATE_MINED,
                        RelayerTransactionState.STATE_CONFIRMED,
                        RelayerTransactionState.STATE_FAILED,
                    ],
                    "60",
                    3000
                );

                if (!result) throw new Error("Safe deployment failed");
                return result.proxyAddress;
            } catch (err) {
                throw err instanceof Error ? err : new Error("Failed to deploy Safe");
            }
        },
        []
    );

    return {
        derivedSafeAddressFromEoa,
        isSafeDeployed,
        deploySafe,
    };
}