import { createPublicClient, http, encodeFunctionData, erc20Abi } from 'viem';
import { OperationType } from '@polymarket/builder-relayer-client';
import { polygon } from 'viem/chains';
import {
    USDC_E_CONTRACT_ADDRESS,
    CTF_CONTRACT_ADDRESS,
    CTF_EXCHANGE_ADDRESS,
    NEG_RISK_CTF_EXCHANGE_ADDRESS,
    NEG_RISK_ADAPTER_ADDRESS,
} from '../constant/token';

const POLYGON_RPC_URL = process.env.EXPO_PUBLIC_RPC_URL;

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const erc1155Abi = [
    {
        inputs: [
            { name: 'operator', type: 'address' },
            { name: 'approved', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'account', type: 'address' },
            { name: 'operator', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
];

const publicClient = createPublicClient({
    chain: polygon,
    transport: http(POLYGON_RPC_URL),
});

const USDC_E_SPENDERS = [
    { address: CTF_CONTRACT_ADDRESS, name: 'CTF Contract' },
    { address: NEG_RISK_ADAPTER_ADDRESS, name: 'Neg Risk Adapter' },
    { address: CTF_EXCHANGE_ADDRESS, name: 'CTF Exchange' },
    { address: NEG_RISK_CTF_EXCHANGE_ADDRESS, name: 'Neg Risk CTF Exchange' },
];

const OUTCOME_TOKEN_SPENDERS = [
    { address: CTF_EXCHANGE_ADDRESS, name: 'CTF Exchange' },
    { address: NEG_RISK_CTF_EXCHANGE_ADDRESS, name: 'Neg Risk Exchange' },
    { address: NEG_RISK_ADAPTER_ADDRESS, name: 'Neg Risk Adapter' },
];

const checkUSDCApprovalForSpender = async (safeAddress, spender) => {
    try {
        const allowance = await publicClient.readContract({
            address: USDC_E_CONTRACT_ADDRESS,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [safeAddress, spender],
        });
        const threshold = BigInt('1000000000000');
        return allowance >= threshold;
    } catch (error) {
        console.warn(`Failed to check USDC approval for ${spender}:`, error);
        return false;
    }
};

const checkERC1155ApprovalForSpender = async (safeAddress, spender) => {
    try {
        const isApproved = await publicClient.readContract({
            address: CTF_CONTRACT_ADDRESS,
            abi: erc1155Abi,
            functionName: 'isApprovedForAll',
            args: [safeAddress, spender],
        });
        return isApproved;
    } catch (error) {
        console.warn(`Failed to check ERC1155 approval for ${spender}:`, error);
        return false;
    }
};

export const checkAllApprovals = async (safeAddress) => {
    const usdcApprovals = {};
    const outcomeTokenApprovals = {};

    await Promise.all(
        USDC_E_SPENDERS.map(async ({ address, name }) => {
            usdcApprovals[name] = await checkUSDCApprovalForSpender(safeAddress, address);
        })
    );

    await Promise.all(
        OUTCOME_TOKEN_SPENDERS.map(async ({ address, name }) => {
            outcomeTokenApprovals[name] = await checkERC1155ApprovalForSpender(safeAddress, address);
        })
    );

    const allApproved =
        Object.values(usdcApprovals).every((approved) => approved) &&
        Object.values(outcomeTokenApprovals).every((approved) => approved);

    return {
        allApproved,
        usdcApprovals,
        outcomeTokenApprovals,
    };
};

export const createAllApprovalTxs = () => {
    const safeTxns = [];

    for (const { address } of USDC_E_SPENDERS) {
        safeTxns.push({
            to: USDC_E_CONTRACT_ADDRESS,
            operation: OperationType.Call,
            data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'approve',
                args: [address, BigInt(MAX_UINT256)],
            }),
            value: '0',
        });
    }

    for (const { address } of OUTCOME_TOKEN_SPENDERS) {
        safeTxns.push({
            to: CTF_CONTRACT_ADDRESS,
            operation: OperationType.Call,
            data: encodeFunctionData({
                abi: erc1155Abi,
                functionName: 'setApprovalForAll',
                args: [address, true],
            }),
            value: '0',
        });
    }

    return safeTxns;
};
