import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import btcRPC from './lib/btcRPC'
import ethRPC from './lib/ethRPC'
import estimateFee from './estimateFee'
import BN from 'bignumber.js'
import coinlist from './lib/coinlist'
import { eth } from './config'

const sendBTC = async ({ privkey, receiver, amount, fee }) => {

    let keyPair
    let sender
    try {
        keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
        sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.btc.network }).address
    } catch (error) {
        return Promise.reject({ code: 9003 })
    }

    // let bytesize
    let vinputs
    let bytesize_bn_byte
    let balance_bn_sat
    try {
        const { bytesize, data: { inputs, balance } } = await estimateFee({ coin: 'btc', sender, receiver, amount })
        bytesize_bn_byte = new BN(bytesize)
        balance_bn_sat = new BN(balance).multipliedBy(100000000)        
        vinputs = inputs
    } catch (error) {
        return Promise.reject(error)
    }

    let feerate_bn_sat
    if (fee.feerate) {
        feerate_bn_sat = new BN(bytesize_bn_byte)
    } else {
        try {
            const response = await btcRPC('estimatesmartfee', [2])
            feerate_bn_sat = new BN(response.data.result.feerate).multipliedBy(100000)
        } catch (error) {
            return Promise.reject({ code: 9011 })
        }
    }
    console.log({ feerate_bn_sat });

    const fee_bn_sat = feerate_bn_sat.multipliedBy(bytesize_bn_byte)
    console.log({ fee_bn_sat })

    const estimatedFee = bytesize_bn_byte.multipliedBy(feerate_bn_sat)

    const amount_bn_sat = new BN(amount).multipliedBy(100000000)

    const txb = new bitcoinjs.TransactionBuilder(coinlist.btc.network)
    txb.setVersion(1)
    txb.addOutput(receiver, amount_bn_sat.toNumber())
    txb.addOutput(sender, balance_bn_sat.minus(amount_bn_sat).minus(estimatedFee).toNumber())

    vinputs.forEach(input => {
        txb.addInput(input.txid, input.vout)
    })
    for (let i = 0; i < vinputs.length; i++) {
        txb.sign(i, keyPair)
    }

    const raw_tx = txb.build().toHex()

    try {
        const response = await btcRPC('sendrawtransaction', [raw_tx])
        return response.data ? Promise.resolve(response.data.result) : Promise.reject({code: 9010})
    } catch (error) {
        Promise.reject({code: 9010})
    }
}

const sendETH = async ({ privkey, receiver, amount, fee }) => {
    const amount_bn_eth = new BN(amount)

    if (amount_bn_eth.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    if (!ethUtil.isValidPrivate(ethUtil.toBuffer(privkey))) {
        return Promise.reject({ code: 9003 })
    }

    if (!ethUtil.isValidAddress(receiver)) {
        return Promise.reject({ code: 9004 })
    }

    try {

        const amount_bn_wei = amount_bn_eth.multipliedBy(1000000000000000000)

        const sender = `0x` + ethUtil.privateToAddress(privkey).toString('hex')
        // console.log({ sender })

        let nonce
        try {
            const transactionCount_response = await ethRPC('eth_getTransactionCount', [sender, 'latest'])
            if (transactionCount_response.data) {
                nonce = transactionCount_response.data.result
            } else {
                return Promise.reject({ code: 9005 })
            }
        } catch (error) {
            return Promise.reject({ code: 9005 })
        }

        // console.log({ nonce })

        if (!fee.gasprice) {
            try {
                const gasprice_response = await ethRPC('eth_gasPrice', [])
                if (!gasprice_response.data) {
                    return Promise.reject({ code: 9006 })
                }
                fee.gasprice = gasprice_response.data.result
                // console.log({gasprice: fee.gasprice})

            } catch (error) {
                return Promise.reject({ code: 9006 })
            }
        }
        const gasPrice_bn = new BN(fee.gasprice)
        // console.log({ gasprice: parseInt(fee.gasprice) })

        let gaslimit
        try {
            const gaslimit_response = await ethRPC('eth_estimateGas', [{
                from: sender,
                to: receiver,
                value: `0x` + amount_bn_wei.toString(16)
            }])
            if (!gaslimit_response.data) {
                return Promise.reject({ code: 9007 })
            }
            gaslimit = gaslimit_response.data.result

        } catch (error) {
            return Promise.reject({ code: 9007 })
        }
        const gasLimit_bn = new BN(gaslimit)
        // console.log({ gaslimit: parseInt(gaslimit) })

        let balance_bn
        try {
            const balance_response = await ethRPC('eth_getBalance', [sender, 'latest'])
            if (!balance_response.data) {
                return Promise.reject({ code: 9008 })
            }
            balance_bn = new BN(balance_response.data.result)
        } catch (error) {
            return Promise.reject({ code: 9008 })
        }
        console.log({ balance: balance_bn.toNumber() })

        if (amount_bn_wei.plus(gasPrice_bn).isGreaterThanOrEqualTo(balance_bn)) {
            return Promise.reject({ code: 9009 })
        }

        const tx_data = {
            nonce,
            gasPrice: '0x' + gasPrice_bn.toString(16),
            gasLimit: '0x' + gasLimit_bn.toString(16),
            to: receiver,
            value: '0x' + amount_bn_wei.toString(16),
        }
        // console.log({ tx_data })

        const raw_tx = new Transaction(tx_data, { chain: eth.chain })
        raw_tx.sign(Buffer.from(privkey.substring(2), 'hex'))

        const signedTX = raw_tx.serialize().toString('hex')
        // console.log({ signedTX })

        try {
            const txid_response = await ethRPC('eth_sendRawTransaction', [`0x` + signedTX])
            if (txid_response.data.result) {
                return Promise.resolve(txid_response.data.result)
            } else {
                return Promise.reject({ code: 9010 })
            }
        } catch (error) {
            return Promise.reject({ code: 9010 })
        }
    } catch (err) {
        return Promise.reject({ code: 9010 })
    }
}

const sendTX = async ({ privkey, receiver, amount, fee = {}, coin }) => {
    if (!coin || !privkey || !receiver || !amount) {
        return Promise.reject({ code: 9000 })
    }
    switch (coin) {
        case 'btc':
            return sendBTC({ privkey, receiver, amount, fee })
        case 'eth':
            return sendETH({ privkey, receiver, amount, fee })
        default:
            return Promise.reject({ code: 9001 })
    }
}

export default sendTX