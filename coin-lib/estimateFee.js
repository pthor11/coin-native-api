import '../shim'
import { Buffer } from 'buffer'
import BN from 'bignumber.js'
import * as  bitcoinjs from 'bitcoinjs-lib'
import rpc from './lib/ethRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'

const estimateByteSize = async ({ sender, privkey, receiver, amount }) => {
    const amount_bn_btc = new BN(amount)
    
    if (amount_bn_btc.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    let keyPair
    try {
        keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
    } catch (error) {
        return Promise.reject({ code: 9003 })
    }

    try {
        bitcoinjs.address.toOutputScript(receiver, coinlist.btc.network)
    } catch (error) {
        return Promise.reject({ code: 9004 })
    }

    let utxos = []
    try {
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        utxos = utxos_response.data.data.txs
    } catch (error) {
        return Promise.reject({code: 9008})
    }

    let inputCount = 0
    let sum_input_value = new BN(0)
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        sum_input_value = sum_input_value.plus(new BN(utxo.value))
        inputCount += 1
        if (sum_input_value.isGreaterThanOrEqualTo(amount_bn_btc)) {
            break
        } 
    }
        
    return inputCount === 0 ? 0 : inputCount * 148 + 34 * 2 + 10
    
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
        return Promise.reject({ code: 9000 })
    }

    switch (coin) {
        case 'btc':
            return estimateByteSize({ sender, privkey, receiver, amount })
        case 'eth':
            return estimateGasLimit({ sender, receiver, amount, data })
        default:
            return Promise.reject({ code: 9001 })
    }
}