import { Magic } from '@magic-sdk/react-native-expo';
import { OAuthExtension } from '@magic-ext/react-native-expo-oauth';
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";



let magicInstance = null;

export function getMagic() {
    if (!magicInstance) {
        magicInstance = new Magic(process.env.EXPO_PUBLIC_MAGIC_PUBLISHABLE_KEY, {  // paste your actual key here
            extensions: [new OAuthExtension()],
        });
        console.log('✅ Magic instance created');
        console.log('✅ OAuth available:', !!magicInstance.oauth);
    }
    return magicInstance;
}

export const magicPublicClient = createPublicClient({
    chain: polygon,
    transport: http(process.env.EXPO_PUBLIC_RPC_URL || "https://polygon-rpc.com"),
})

export default getMagic;