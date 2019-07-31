import '../shim'
import { Buffer } from 'buffer'
import BN from 'bignumber.js'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import rpc from './lib/ethRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'

const estimateByteSize = async ({ sender, receiver, amount, coin }) => {
    const amount_bn_btc = new BN(amount)

    if (amount_bn_btc.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    try {
        bitcoinjs.address.toOutputScript(sender, coinlist.btc.network)
    } catch (error) {
        return Promise.reject({ code: 9013 })
    }

    try {
        bitcoinjs.address.toOutputScript(receiver, coinlist.btc.network)
    } catch (error) {
        return Promise.reject({ code: 9004 })
    }

    let utxos = []
    try {
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/${coin}test/${sender}`)
        utxos = utxos_response.data.data.txs
    } catch (error) {
        return Promise.reject({ code: 9008 })
    }

    let inputs = []
    let sum_input_value = new BN(0)
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]    
        inputs.push({txid: utxo.txid, vout: utxo.output_no})
        sum_input_value = sum_input_value.plus(new BN(utxo.value))
        if (sum_input_value.isGreaterThanOrEqualTo(amount_bn_btc)) {
            break
        }
    }

    return inputs.length === 0 ? Promise.resolve(null) : Promise.resolve({ bytesize: inputs.length * 148 + 34 * 2 + 10, data: {inputs, sum_input_value} })

}

const estimateGasLimit = async ({ sender, receiver, amount, data }) => {
    const amount_bn_eth = new BN(amount)

    if (amount_bn_eth.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    if (!ethUtil.isValidAddress(sender)) {
        return Promise.reject({ code: 9013 })
    }

    if (!ethUtil.isValidAddress(receiver)) {
        return Promise.reject({ code: 9004 })
    }

    let payload = {
        from: sender,
        to: receiver,
        value: '0x' + amount_bn_eth.multipliedBy(1000000000000000000).toString(16),
    }
    if (data) {
        payload.data = data
    }
    try {
        const limit = await rpc('eth_estimateGas', [payload, 'latest'])
        return limit.data.result ? Promise.resolve({gaslimit: new BN(limit.data.result).toNumber()}) : Promise.reject({ code: 9014 })
    } catch (error) {
        return Promise.reject({ code: 9014 })
    }
}

export default async ({ coin, sender, receiver, amount, data }) => {
    if (!coin || !sender || !receiver || !amount) {
        return Promise.reject({ code: 9000 })
    }

    switch (coin) {
        case 'btc':
        case 'bch':
        case 'ltc':
            return estimateByteSize({ sender, receiver, amount, coin })
        case 'eth':
            return estimateGasLimit({ sender, receiver, amount, data })
        default:
            return Promise.reject({ code: 9001 })
    }
}