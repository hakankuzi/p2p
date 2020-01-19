const encyption = {}

encyption.encrypt = function (plaintext, key) {
    var encryptedAES = CryptoJS.AES.encrypt(plaintext, key);
    return encryptedAES.toString();
}

encyption.decrypt = function (encrypted, key) {
    var decryptedBytes = CryptoJS.AES.decrypt(encrypted, key);
    var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}