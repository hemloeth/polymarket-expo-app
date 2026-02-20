import { publicClient } from "../lib/viem";

export const ERC20_ABI = [
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "decimals",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
    },
];

export async function getERC20Balance(token, address) {
    const [raw, decimals] = await Promise.all([
        publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address],
        }),
        publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "decimals",
        }),
    ]);

    return Number(raw) / 10 ** decimals;
}
