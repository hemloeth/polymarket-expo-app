import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMagic } from '../lib/magic';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const magic = getMagic();
            const isLoggedIn = await magic.user.isLoggedIn();

            if (isLoggedIn) {
                const userInfo = await magic.user.getInfo();
                const accounts = await magic.rpcProvider.request({
                    method: 'eth_accounts',
                });
                setUser(userInfo);
                setAddress(accounts[0]);
                console.log('✅ Already logged in:', userInfo.email);
            }
        } catch (error) {
            console.log('Not logged in:', error.message);
        }
    }

    async function loginWithEmail(email) {
        setLoading(true);
        try {
            const magic = getMagic();

            await magic.auth.loginWithEmailOTP({ email });

            const userInfo = await magic.user.getInfo();
            const accounts = await magic.rpcProvider.request({
                method: 'eth_accounts',
            });

            setUser(userInfo);
            setAddress(accounts[0]);
            console.log('✅ Logged in:', userInfo.email);

        } catch (error) {
            console.error('❌ Login failed:', error.message);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            const magic = getMagic();
            await magic.user.logout();
            setUser(null);
            setAddress(null);
            console.log('✅ Logged out');
        } catch (error) {
            console.error('❌ Logout failed:', error.message);
        }
    }

    return (
        <WalletContext.Provider
            value={{
                user,
                address,
                loading,
                isLoggedIn: !!user,
                loginWithEmail,
                logout,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}