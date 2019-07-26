import '../shim'
import { Buffer } from 'buffer'
import BN from 'bignumber.js'
import * as  bitcoinjs from 'bitcoinjs-lib'
import rpc from './lib/ethRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'

const estimateByteSize = async ({ sender, privkey, receiver, amount }) => {
    try {
        const amount_bn_btc = new BN(amount)
        if (amount_bn_btc._isBigNumber()) {
            
        }

        const amount_bn_sat = amount_bn_btc.multipliedBy(100000000)
        
        const keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
        // console.log({keyPair})


        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        const utxos = utxos_response.data.data.txs
        
        const balance = parseInt(100000000 * utxos.reduce((balance, utxo) => balance + parseFloat(utxo.value), 0))

        if (balance === 0 || utxos.length === 0) {
            return 223
        }
        console.log({balance})
        
        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })
        

        const txb = new bitcoinjs.TransactionBuilder(coinlist.btc.network)
        txb.setVersion(1)
        txb.addOutput(receiver, amount)
        txb.addOutput(sender, balance - amount - 223)
        for (let i = 0; i < inputs.length; i++) {
            txb.addInput(inputs[i].txid, inputs[i].vout)
        }
        for (let i = 0; i < inputs.length; i++) {
            txb.sign(i, keyPair)
        }

        const estimate_raw_tx = txb.build().toHex()
        console.log({ estimate_raw_tx })

        return Buffer.byteLength(estimate_raw_tx, 'hex')
    } catch (err) {
        throw new Error(err)
    }
}

const estimateGasLimit = async ({ sender, receiver, amount, data }) => {
    try {
        let payload = {
            from: sender,
            to: receiver,
            value: '0x' + (amount * 1000000000000000000).toString(16),
        }
        if (data) {
            payload.data = data
        }
        const limit = await rpc('eth_estimateGas', [payload, 'latest'])
        return parseInt(limit.data.result)
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export default async ({ coin, sender, privkey, receiver, amount, data }) => {
    if (!coin || !sender || !privkey || !receiver || !amount) {
        return Promise.reject({code: 4000})
    }

    switch (coin) {
        case 'btc':
            return estimateByteSize({ sender, privkey, receiver, amount })
        case 'eth':
            return estimateGasLimit({ sender, receiver, amount, data })
        default:
            return Promise.reject({code: 4001})
    }
}