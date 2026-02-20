import React, { createContext, useContext, useState, useEffect } from 'react';
import useSafeDeployment from '../hooks/useSafeDeploment';
import { getSafeBalances } from '../balance/balance';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const { derivedSafeAddressFromEoa } = useSafeDeployment(address);
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [safeBalances, setSafeBalances] = useState(null);
    const [signer, setSigner] = useState(null);

    // Orchestration: Sync app state with service status on mount
    useEffect(() => {
        const initialize = async () => {
            const status = await authService.checkUserStatus();
            if (status) {
                setUser(status.user);
                setAddress(status.address);
            }
        };
        initialize();
    }, []);

    // Orchestration: Fetch balance when address changes
    useEffect(() => {
        if (address) {
            refreshUsdcBalance(address);
        } else {
            setUsdcBalance(null);
        }
    }, [address]);

    // Orchestration: Fetch safe balances when derived safe address changes
    useEffect(() => {
        async function loadSafeBalances() {
            if (!derivedSafeAddressFromEoa) {
                setSafeBalances(null);
                return;
            }
            try {
                const res = await getSafeBalances(derivedSafeAddressFromEoa);
                setSafeBalances(res);
            } catch (err) {
                console.error('Failed fetching safe balances', err);
                setSafeBalances(null);
            }
        }
        loadSafeBalances();
    }, [derivedSafeAddressFromEoa]);

    // Actions: Thinner wrappers that delegate to services and update state
    async function initializeSigner() {
        const ethersSigner = await authService.initializeSigner();
        setSigner(ethersSigner);
        return ethersSigner;
    }

    async function loginWithEmail(email) {
        setLoading(true);
        try {
            const { user, address } = await authService.loginWithEmail(email);
            setUser(user);
            setAddress(address);
            console.log('✅ Logged in:', user.email);
            return { user, address };
        } catch (error) {
            console.error('❌ Login failed:', error.message);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await authService.logout();
            setUser(null);
            setAddress(null);
            setUsdcBalance(null);
            setSigner(null);
            console.log('✅ Logged out');
        } catch (error) {
            console.error('❌ Logout failed:', error.message);
        }
    }

    async function refreshUsdcBalance(walletAddress) {
        const balance = await tokenService.fetchUsdcBalance(walletAddress);
        setUsdcBalance(balance);
        return balance;
    }

    async function transferUsdc({ recipient, amount }) {
        try {
            const currentSigner = signer || await initializeSigner();
            const hash = await tokenService.transferUsdc({
                signer: currentSigner,
                recipient,
                amount
            });
            await refreshUsdcBalance(address);
            return hash;
        } catch (error) {
            console.error('❌ Transfer failed:', error.message);
            throw error;
        }
    }

    return (
        <WalletContext.Provider
            value={{
                user,
                address,
                safeAddress: derivedSafeAddressFromEoa,
                loading,
                isLoggedIn: !!user,
                loginWithEmail,
                logout,
                usdcBalance,
                fetchUsdcBalance: refreshUsdcBalance,
                safeBalances,
                transferUsdc,
                initializeSigner,
                signer,
                fetchSafeBalances: getSafeBalances,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
