import { magicPublicClient } from '../lib/magic';
import { formatUnits } from 'viem';
import { createUsdcTransferTx } from '../utils/usdcTransfer';
import { USDC_E_CONTRACT_ADDRESS } from '../constant/token';

const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
    },
];

export const tokenService = {
    async fetchUsdcBalance(walletAddress) {
        try {
            const raw = await magicPublicClient.readContract({
                address: USDC_E_CONTRACT_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [walletAddress],
            });
            const formatted = formatUnits(raw, 6);
            console.log('✅ USDC Balance fetched:', formatted);
            return formatted;
        } catch (error) {
            console.error('❌ USDC Balance fetch failed:', error.message || error);
            return null;
        }
    },

    async transferUsdc({ signer, recipient, amount }) {
        try {
            if (!signer) throw new Error('Signer not initialized');

            const tx = createUsdcTransferTx({
                recipient,
                amount: BigInt(Math.floor(amount * 1e6)), // convert to 6 decimals
            });

            const transaction = await signer.sendTransaction({
                to: tx.to,
                data: tx.data,
                value: tx.value,
            });

            console.log('✅ Tx sent:', transaction.hash);
            await transaction.wait();
            console.log('✅ Tx confirmed!');

            return transaction.hash;
        } catch (error) {
            console.error('❌ Transfer failed:', error.message);
            throw error;
        }
    }
};
