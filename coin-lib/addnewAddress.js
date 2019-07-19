import tronweb from './lib/tronweb'
import sjcl from './lib/sjcl-bip39'
import bitcoinjs from './lib/bitcoinjs-3.3.2'
import ethUtil from './lib/ethereumjs-util'
import coinlist from './lib/coinlist'

const PBKDF2_ROUNDS = 2048

// === PRIVATE METHODS
const phraseToSeed = (phrase, passphrase = '') => {
    phrase = phrase.join(' ')
    const phraseNormalized = phrase.normalize('NFKD')

    passphrase = passphrase.normalize('NFKD')
    passphrase = 'mnemonic' + passphrase

    const phraseBits = sjcl.codec.utf8String.toBits(phraseNormalized)
    const passphraseBits = sjcl.codec.utf8String.toBits(passphrase)
    
    const result = sjcl.misc.pbkdf2(phraseBits, passphraseBits, PBKDF2_ROUNDS, 512, hmacSHA512)
    const hashHex = sjcl.codec.hex.fromBits(result)

    return hashHex
}

const hmacSHA512 = function (key) {
    const hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512)
    this.encrypt = function () {
        return hasher.encrypt.apply(hasher, arguments);
    }
}

const calcBip32RootKeyFromSeed = (seed, coin) => {
    const rootKey = bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, coinlist[coin].network)
    return rootKey
}

const generatePath = (coin) => {
    const purpose = 44
    const account = 0
    const change = 0
    const coin_id = coinlist[coin].id
    const path = `m/${purpose}'/${coin_id}'/${account}'/${change}`    
    return path
}

const calcBip32ExtendedKey = (bip32RootKey, path) => {
    if (!bip32RootKey) {
        return bip32RootKey;
    }
    var extendedKey = bip32RootKey;
    // Derive the key from the path
    var pathBits = path.split("/");
    for (var i = 0; i < pathBits.length; i++) {
        var bit = pathBits[i];
        var index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        var hardened = bit[bit.length - 1] == "'";
        var isPriv = !(extendedKey.isNeutered());
        var invalidDerivationPath = hardened && !isPriv;
        if (invalidDerivationPath) {
            extendedKey = null;
        }
        else if (hardened) {
            extendedKey = extendedKey.deriveHardened(index);
        }
        else {
            extendedKey = extendedKey.derive(index);
        }
    }
    return extendedKey
}

const phraseToKeyPair = (phrase, coin, index) => {
    const seed = phraseToSeed(phrase)

    const bip32RootKey = calcBip32RootKeyFromSeed(seed, coin)

    const path = generatePath(coin)

    const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, path)    

    const key = bip32ExtendedKey.derive(index)
    
    return key.keyPair
}

const phraseToBTC = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'btc', index)
    const address = keyPair.getAddress().toString();
    const pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    const privkey = keyPair.toWIF()

    return { address, pubkey, privkey }
}

const phraseToBCH = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'bch', index)
    const address = keyPair.getAddress().toString();
    const pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    const privkey = keyPair.toWIF()

    return { address, pubkey, privkey }
}

const phraseToLTC = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'ltc', index)    
    const address = keyPair.getAddress().toString();
    const pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    const privkey = keyPair.toWIF()

    return { address, pubkey, privkey }
}

const phraseToETH = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'eth', index)
    const hexPubkey = keyPair.getPublicKeyBuffer().toString('hex')
    const privKeyBuffer = keyPair.d.toBuffer(32)
    const hexPrivkey = privKeyBuffer.toString('hex')
    const addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
    const hexAddress = addressBuffer.toString('hex')
    const checksumAddress = ethUtil.toChecksumAddress(hexAddress)
    const address = ethUtil.addHexPrefix(checksumAddress)
    const privkey = ethUtil.addHexPrefix(hexPrivkey)
    const pubkey = ethUtil.addHexPrefix(hexPubkey)

    return { address, pubkey, privkey }
}

const phraseToETC = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'etc', index)
    const hexPubkey = keyPair.getPublicKeyBuffer().toString('hex')
    const privKeyBuffer = keyPair.d.toBuffer(32)
    const hexPrivkey = privKeyBuffer.toString('hex')
    const addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
    const hexAddress = addressBuffer.toString('hex')
    const checksumAddress = ethUtil.toChecksumAddress(hexAddress)
    const address = ethUtil.addHexPrefix(checksumAddress)
    const privkey = ethUtil.addHexPrefix(hexPrivkey)
    const pubkey = ethUtil.addHexPrefix(hexPubkey)

    return { address, pubkey, privkey }
}

const phraseToTRX = (phrase, index) => {
    const keyPair = phraseToKeyPair(phrase, 'trx', index)
    const privKeyBuffer = keyPair.d.toBuffer(32)
    const privkey = privKeyBuffer.toString('hex')
    const pubkey = tronweb.address.fromPrivateKey(privkey)
    const address = pubkey

    return { address, pubkey, privkey }
}

export default (phrase, coin, index) => {
    switch (coin) {
        case 'bch':
            return phraseToBCH(phrase, index)
        case 'etc':
            return phraseToETC(phrase, index)
        case 'eth':
            return phraseToETH(phrase, index)
        case 'trx':
            return phraseToTRX(phrase, index)
        case 'ltc':
            return phraseToLTC(phrase, index)
        default:
            return phraseToBTC(phrase, index)

    }

}