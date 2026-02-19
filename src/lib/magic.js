import { Magic } from '@magic-sdk/react-native-expo';
import { OAuthExtension } from '@magic-ext/react-native-expo-oauth';

let magicInstance = null;

export function getMagic() {
    if (!magicInstance) {
        magicInstance = new Magic('pk_live_E029673E82E77914', {  // paste your actual key here
            extensions: [new OAuthExtension()],
        });
        console.log('✅ Magic instance created');
        console.log('✅ OAuth available:', !!magicInstance.oauth);
    }
    return magicInstance;
}

export default getMagic;