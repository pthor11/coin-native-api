import '../shim'
import BN from 'bignumber.js'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import ethRPC from './lib/ethRPC'
import etcRPC from './lib/etcRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'
import abi from 'ethereumjs-abi'

const estimateByteSizeBTC = async ({ sender, receiver, amount }) => {
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
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        utxos = utxos_response.data.data.txs
    } catch (error) {
        return Promise.reject({ code: 9008 })
    }

    let inputs = []
    let sum_input_value = new BN(0)
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        inputs.push({ txid: utxo.txid, vout: utxo.output_no })
        sum_input_value = sum_input_value.plus(new BN(utxo.value))
        if (sum_input_value.isGreaterThanOrEqualTo(amount_bn_btc)) {
            break
        }
    }

    return inputs.length === 0 ? Promise.resolve(null) : Promise.resolve({ bytesize: inputs.length * 148 + 34 * 2 + 10, data: { inputs, sum_input_value: sum_input_value.toNumber() } })
}

const estimateByteSizeLTC = async ({ sender, receiver, amount }) => {
    const amount_bn_btc = new BN(amount)

    if (amount_bn_btc.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    try {
        bitcoinjs.address.toOutputScript(sender, coinlist.ltc.network)
    } catch (error) {
        return Promise.reject({ code: 9013 })
    }

    try {
        bitcoinjs.address.toOutputScript(receiver, coinlist.ltc.network)
    } catch (error) {
        return Promise.reject({ code: 9004 })
    }

    let utxos = []
    try {
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/ltctest/${sender}`)
        utxos = utxos_response.data.data.txs
    } catch (error) {
        return Promise.reject({ code: 9008 })
    }

    let inputs = []
    let sum_input_value = new BN(0)
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        inputs.push({ txid: utxo.txid, vout: utxo.output_no })
        sum_input_value = sum_input_value.plus(new BN(utxo.value))
        if (sum_input_value.isGreaterThanOrEqualTo(amount_bn_btc)) {
            break
        }
    }

    return inputs.length === 0 ? Promise.resolve(null) : Promise.resolve({ bytesize: inputs.length * 148 + 34 * 2 + 10, data: { inputs, sum_input_value: sum_input_value.toNumber() } })
}

const estimateByteSizeBCH = async ({ sender, receiver, amount }) => {
    const amount_bn_btc = new BN(amount)

    if (amount_bn_btc.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    try {
        bitcoinjs.address.toOutputScript(sender, coinlist.bch.network)
    } catch (error) {
        return Promise.reject({ code: 9013 })
    }

    try {
        bitcoinjs.address.toOutputScript(receiver, coinlist.bch.network)
    } catch (error) {
        return Promise.reject({ code: 9004 })
    }

    let utxos = []
    try {
        const utxos_response = await axios.get(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${sender}`)
        utxos = utxos_response.data.data[sender].utxo
    } catch (error) {
        return Promise.reject({ code: 9008 })
    }

    let inputs = []
    let sum_input_value = new BN(0)
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        inputs.push({ txid: utxo.transaction_hash, vout: utxo.index })
        sum_input_value = sum_input_value.plus(new BN(utxo.value).dividedBy(100000000))
        if (sum_input_value.isGreaterThanOrEqualTo(amount_bn_btc)) {
            break
        }
    }

    return inputs.length === 0 ? Promise.resolve(null) : Promise.resolve({ bytesize: inputs.length * 148 + 34 * 2 + 10, data: { inputs, sum_input_value: sum_input_value.toNumber() } })
}

const estimateGasLimitETH = async ({ sender, receiver, amount }) => {

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
    // console.log({payload})


    try {
        const limit = await ethRPC('eth_estimateGas', [payload, 'latest'])
        // console.log({limit: limit.data})

        return limit.data.result ? Promise.resolve({ gaslimit: new BN(limit.data.result).toNumber() }) : Promise.reject({ code: 9014 })
    } catch (error) {
        console.log(error.response.data)
        return Promise.reject({ code: 9014 })
    }
}

const estimateGasLimitETC = async ({ sender, receiver, amount }) => {
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

    try {
        const limit = await etcRPC('eth_estimateGas', [payload, 'latest'])
        return limit.data.result ? Promise.resolve({ gaslimit: new BN(limit.data.result).toNumber() }) : Promise.reject({ code: 9014 })
    } catch (error) {
        console.log(error)
        return Promise.reject({ code: 9014 })
    }
}

const estimateGasLimitERC20 = async ({ sender, receiver, contract, amount }) => {
    try {

        const amount_bn_token = new BN(amount)

        if (amount_bn_token.isNaN()) {
            return Promise.reject({ code: 9002 })
        }

        if (!ethUtil.isValidAddress(sender)) {
            return Promise.reject({ code: 9013 })
        }

        if (!ethUtil.isValidAddress(receiver)) {
            return Promise.reject({ code: 9004 })
        }

        const balanceOf_data = `0x` + abi.methodID('balanceOf', ['address']).toString('hex') + abi.rawEncode(['address'], [sender]).toString('hex')        

        const decimals_data = `0x` + abi.methodID('decimals', []).toString('hex') + abi.rawEncode([], []).toString('hex')

        const batch_response = await ethRPC.batch([
            {method: 'eth_call', params: [{ to: contract, data: balanceOf_data }]},
            {method: 'eth_call', params: [{ to: contract, data: decimals_data }]},
        ])

        const [balanceOf_bn_decimals, decimals_bn] = batch_response.data.map(each => new BN (each.result))

        // console.log({balanceOf_bn_decimals: balanceOf_bn_decimals.toString()});
        
        const amount_bn_decimals = amount_bn_token.multipliedBy(new BN(10).pow(decimals_bn))
        // console.log({amount_bn_decimals: amount_bn_decimals.toString()});
        

        if (amount_bn_decimals.isGreaterThanOrEqualTo(balanceOf_bn_decimals)) {
            return Promise.reject({code : 9009})
        }
      
        const transfer_data = `0x` + abi.methodID('transfer', ['address', 'uint256']).toString('hex') + abi.rawEncode(['address', 'uint256'], [receiver, amount]).toString('hex')


        let payload = {
            from: sender,
            to: contract,
            value: '0x0',
            data: transfer_data
        }

        const limit = await ethRPC('eth_estimateGas', [payload, 'latest'])
        // console.log({ limit: limit.data })

        return limit.data.result ? Promise.resolve({ gaslimit: new BN(limit.data.result).toNumber(), data: transfer_data }) : Promise.reject({ code: 9014 })
    } catch (error) {
        console.log(error.response)
        return Promise.reject({ code: 9014 })
    }
}

export default async ({ coin, sender, receiver, contract, amount }) => {
    if (!coin || !sender || !receiver || !amount) {
        return Promise.reject({ code: 9000 })
    }

    switch (coin) {
        case 'btc':
            return estimateByteSizeBTC({ sender, receiver, amount })
        case 'ltc':
            return estimateByteSizeLTC({ sender, receiver, amount })
        case 'bch':
            return estimateByteSizeBCH({ sender, receiver, amount })
        case 'eth':
            return estimateGasLimitETH({ sender, receiver, amount })
        case 'etc':
            return estimateGasLimitETC({ sender, receiver, amount })
        case 'erc20':
            return estimateGasLimitERC20({ sender, receiver, contract, amount })
        default:
            return Promise.reject({ code: 9001 })
    }
}