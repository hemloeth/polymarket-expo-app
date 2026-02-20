import "react-native-get-random-values";
import * as Crypto from "expo-crypto";
import { Buffer } from "@craftzdog/react-native-buffer";
import * as base64js from "base64-js";

/* ------------------ Buffer ------------------ */
global.Buffer = Buffer;

/* ------------------ Random Utils ------------------ */
const getSecureRandomSync = (length) => {
    try {
        if (Crypto && typeof Crypto.getRandomBytesSync === 'function') {
            return Crypto.getRandomBytesSync(length);
        }
        if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
            const bytes = new Uint8Array(length);
            global.crypto.getRandomValues(bytes);
            return bytes;
        }
    } catch (e) {
        console.warn("[Polyfill] Native crypto not ready, using Math.random fallback for boot");
    }

    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
};

/* ------------------ Secure Random ------------------ */
if (typeof global.crypto !== 'object') {
    global.crypto = {};
}

if (!global.crypto.getRandomValues) {
    global.crypto.getRandomValues = (typedArray) => {
        const randomBytes = getSecureRandomSync(typedArray.length);
        typedArray.set(randomBytes);
        return typedArray;
    };
}

/* ------------------ Base64 ------------------ */
global.base64ToArrayBuffer = (base64) => {
    const bytes = base64js.toByteArray(base64);
    return bytes.buffer;
};

global.base64FromArrayBuffer = (arrayBuffer) => {
    return base64js.fromByteArray(new Uint8Array(arrayBuffer));
};

if (!global.atob) {
    global.atob = (b64) => String.fromCharCode(...base64js.toByteArray(b64));
}

if (!global.btoa) {
    global.btoa = (str) => base64js.fromByteArray(Uint8Array.from(str, (c) => c.charCodeAt(0)));
}
