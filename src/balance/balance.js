import { formatEther } from "viem";
import { publicClient } from "../lib/viem";
import { getERC20Balance } from "./erc20";
import { USDC_E_CONTRACT_ADDRESS } from "../constant/token";

export async function getSafeBalances(safeAddress) {
    const [matic, usdc] = await Promise.all([
        publicClient.getBalance({ address: safeAddress }),
        getERC20Balance(USDC_E_CONTRACT_ADDRESS, safeAddress),
    ]);

    return {
        matic: formatEther(matic),
        usdc, // USDCe balance, already formatted in getERC20Balance
    };
}