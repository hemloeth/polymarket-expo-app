import { getMagic } from '../lib/magic';
import { ethers } from 'ethers';

export const authService = {
    async initializeSigner() {
        try {
            const magic = getMagic();
            if (!magic) return null;
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            return provider.getSigner();
        } catch (error) {
            console.error('Failed to initialize signer:', error);
            return null;
        }
    },

    async checkUserStatus() {
        try {
            const magic = getMagic();
            const isLoggedIn = await magic.user.isLoggedIn();

            if (isLoggedIn) {
                const userInfo = await magic.user.getInfo();
                const accounts = await magic.rpcProvider.request({
                    method: 'eth_accounts',
                });
                return {
                    user: userInfo,
                    address: accounts[0],
                };
            }
            return null;
        } catch (error) {
            console.error('Error checking user status:', error.message);
            return null;
        }
    },

    async loginWithEmail(email) {
        try {
            const magic = getMagic();
            await magic.auth.loginWithEmailOTP({ email });
            const userInfo = await magic.user.getInfo();
            const accounts = await magic.rpcProvider.request({
                method: 'eth_accounts',
            });
            return {
                user: userInfo,
                address: accounts[0],
            };
        } catch (error) {
            console.error('❌ Login failed:', error.message);
            throw error;
        }
    },

    async logout() {
        try {
            const magic = getMagic();
            await magic.user.logout();
            return true;
        } catch (error) {
            console.error('❌ Logout failed:', error.message);
            throw error;
        }
    }
};
