import { encodeFunctionData, erc20Abi } from 'viem';
import { OperationType } from '@polymarket/builder-relayer-client';
import { USDC_E_CONTRACT_ADDRESS } from '../constant/token';

export const createUsdcTransferTx = ({ recipient, amount }) => {
    const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient, amount],
    });

    return {
        to: USDC_E_CONTRACT_ADDRESS,
        operation: OperationType.Call,
        data,
        value: '0',
    };
};