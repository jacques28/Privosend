export async function generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    )
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('jwk', key)
    return JSON.stringify(exported)
}

export async function importKey(jwkStr: string): Promise<CryptoKey> {
    const jwk = JSON.parse(jwkStr)
    return window.crypto.subtle.importKey(
        'jwk',
        jwk,
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    )
}

export async function encryptFile(file: File, key: CryptoKey): Promise<{ encryptedBlob: Blob; iv: Uint8Array }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const arrayBuffer = await file.arrayBuffer() as ArrayBuffer

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        arrayBuffer
    )

    return {
        encryptedBlob: new Blob([encryptedBuffer]),
        iv,
    }
}

export async function decryptFile(encryptedBlob: Blob, key: CryptoKey, iv: Uint8Array): Promise<Blob> {
    const arrayBuffer = await encryptedBlob.arrayBuffer()

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv as BufferSource,
        },
        key,
        arrayBuffer
    )

    return new Blob([decryptedBuffer])
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
}
