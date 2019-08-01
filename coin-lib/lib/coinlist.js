import bitcoinjs from './bitcoinjs-3.3.2'

// MAINET

export default {
    btc: { id: 0, network : bitcoinjs.bitcoin.networks.bitcoin },
    eth: { id: 60, network : bitcoinjs.bitcoin.networks.bitcoin },
    etc: { id: 61, network : bitcoinjs.bitcoin.networks.bitcoin },
    trx: { id: 195, network : bitcoinjs.bitcoin.networks.bitcoin },
    ltc: { id: 2, network : bitcoinjs.bitcoin.networks.litecoin }, 
    bch: { id: 145, network : bitcoinjs.bitcoin.networks.bitcoin },
}

// TESTNET

// export default {
//     btc: { id: 1, network : bitcoinjs.bitcoin.networks.testnet },
//     eth: { id: 60, network : bitcoinjs.bitcoin.networks.testnet },
//     etc: { id: 61, network : bitcoinjs.bitcoin.networks.testnet },
//     trx: { id: 195, network : bitcoinjs.bitcoin.networks.testnet },
//     ltc: { id: 2, network : bitcoinjs.bitcoin.networks.testnet }, 
//     bch: { id: 145, network : bitcoinjs.bitcoin.networks.testnet },
// }
