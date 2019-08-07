import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import tronNode from './lib/tronNode'
import { Transaction } from 'ethereumjs-tx'
import Common from 'ethereumjs-common'
import btcRPC from './lib/btcRPC'
import bchRPC from './lib/bchRPC'
import ltcRPC from './lib/ltcRPC'
import ethRPC from './lib/ethRPC'
import etcRPC from './lib/etcRPC'
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
    try {
        const { bytesize, data: { inputs, sum_input_value } } = await estimateFee({ coin: 'btc', sender, receiver, amount })
        bytesize_bn_byte = new BN(bytesize)
        sum_input_value_bn_sat = new BN(sum_input_value).multipliedBy(100000000)
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
    txb.addOutput(sender, sum_input_value_bn_sat.minus(amount_bn_sat).minus(estimatedFee).toNumber())

    vinputs.forEach(input => {
        txb.addInput(input.txid, input.vout)
    })
    for (let i = 0; i < vinputs.length; i++) {
        txb.sign(i, keyPair)
    }

    const raw_tx = txb.build().toHex()

    try {
        const response = await btcRPC('sendrawtransaction', [raw_tx])
        return response.data ? Promise.resolve(response.data.result) : Promise.reject({ code: 9010 })
    } catch (error) {
        Promise.reject({ code: 9010 })
    }
}

const sendBCH = async ({ privkey, receiver, amount, fee }) => {

    let keyPair
    let sender
    try {
        keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.bch.network)
        sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.bch.network }).address
    } catch (error) {
        return Promise.reject({ code: 9003 })
    }

    // let bytesize
    let vinputs
    let bytesize_bn_byte
    try {
        const { bytesize, data: { inputs, sum_input_value } } = await estimateFee({ coin: 'bch', sender, receiver, amount })
        bytesize_bn_byte = new BN(bytesize)
        sum_input_value_bn_sat = new BN(sum_input_value).multipliedBy(100000000)
        vinputs = inputs
    } catch (error) {
        return Promise.reject(error)
    }
    console.log({ vinputs })

    let feerate_bn_sat
    if (fee.feerate) {
        feerate_bn_sat = new BN(bytesize_bn_byte)
    } else {
        try {
            const response = await bchRPC('estimatefee', [])
            feerate_bn_sat = new BN(response.data.result).multipliedBy(100000)
        } catch (error) {
            console.log(error.response.data)

            return Promise.reject({ code: 9011 })
        }
    }
    console.log({ feerate_bn_sat });

    const fee_bn_sat = feerate_bn_sat.multipliedBy(bytesize_bn_byte)
    console.log({ fee_bn_sat })

    const estimatedFee = bytesize_bn_byte.multipliedBy(feerate_bn_sat)

    const amount_bn_sat = new BN(amount).multipliedBy(100000000)

    const txb = new bitcoinjs.TransactionBuilder(coinlist.bch.network)
    txb.setVersion(1)
    txb.addOutput(receiver, amount_bn_sat.toNumber())
    txb.addOutput(sender, sum_input_value_bn_sat.minus(amount_bn_sat).minus(estimatedFee).toNumber())

    vinputs.forEach(input => {
        txb.addInput(input.txid, input.vout)
    })
    for (let i = 0; i < vinputs.length; i++) {
        txb.sign(i, keyPair)
    }



    const raw_tx = txb.build().toHex()
    console.log({ raw_tx })

    try {
        const response = await bchRPC('sendrawtransaction', [raw_tx])
        console.log({ response })

        return response.data ? Promise.resolve(response.data.result) : Promise.reject({ code: 9010 })
    } catch (error) {
        console.log(error.response.data)

        Promise.reject({ code: 9010 })
    }
}

const sendLTC = async ({ privkey, receiver, amount, fee }) => {

    let keyPair
    let sender
    try {
        keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.ltc.network)
        sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.ltc.network }).address
    } catch (error) {
        return Promise.reject({ code: 9003 })
    }

    // let bytesize
    let vinputs
    let bytesize_bn_byte
    try {
        const { bytesize, data: { inputs, sum_input_value } } = await estimateFee({ coin: 'ltc', sender, receiver, amount })
        bytesize_bn_byte = new BN(bytesize)
        sum_input_value_bn_sat = new BN(sum_input_value).multipliedBy(100000000)
        vinputs = inputs
    } catch (error) {
        return Promise.reject(error)
    }
    console.log({ sum_input_value_bn_sat })

    let feerate_bn_sat
    if (fee.feerate) {
        feerate_bn_sat = new BN(bytesize_bn_byte)
    } else {
        try {
            const response = await ltcRPC('estimatesmartfee', [2])
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

    console.log({ amount_bn_sat })
    console.log({ change: sum_input_value_bn_sat.minus(amount_bn_sat).minus(estimatedFee) })

    console.log({ vinputs })


    const txb = new bitcoinjs.TransactionBuilder(coinlist.ltc.network)
    txb.setVersion(1)
    txb.addOutput(receiver, amount_bn_sat.toNumber())
    txb.addOutput(sender, sum_input_value_bn_sat.minus(amount_bn_sat).minus(estimatedFee).toNumber())

    vinputs.forEach(input => {
        txb.addInput(input.txid, input.vout)
    })
    for (let i = 0; i < vinputs.length; i++) {
        txb.sign(i, keyPair)
    }

    const raw_tx = txb.build().toHex()

    try {
        const response = await ltcRPC('sendrawtransaction', [raw_tx])
        return response.data ? Promise.resolve(response.data.result) : Promise.reject({ code: 9010 })
    } catch (error) {
        console.log(error.response.data)
        Promise.reject({ code: 9010 })
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

const sendERC20 = async ({ privkey, receiver, contract, amount, fee }) => {

    if (!ethUtil.isValidPrivate(ethUtil.toBuffer(privkey))) {
        return Promise.reject({ code: 9003 })
    }

    if (!ethUtil.isValidAddress(receiver)) {
        return Promise.reject({ code: 9004 })
    }

    try {

        const sender = `0x` + ethUtil.privateToAddress(privkey).toString('hex')
        console.log({ sender })

        let gaslimit
        let transfer_data
        try {
            const fee_erc20 = await estimateFee({ coin: 'erc20', sender, receiver, contract, amount })
            // console.log({ fee_erc20 })
            gaslimit = fee_erc20.gaslimit
            transfer_data = fee_erc20.data
        } catch (error) {
            return Promise.reject({ code: 9007 })
        }

        const gasLimit_bn = new BN(gaslimit)

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

        const tx_data = {
            nonce,
            gasPrice: '0x' + gasPrice_bn.toString(16),
            gasLimit: '0x' + gasLimit_bn.toString(16),
            to: contract,
            value: '0x0',
            data: transfer_data
        }
        console.log(tx_data)


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
        console.log(err)
        
        return Promise.reject({ code: 9010 })
    }
}

const sendETC = async ({ privkey, receiver, amount, fee }) => {
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
            const transactionCount_response = await etcRPC('eth_getTransactionCount', [sender, 'latest'])
            if (transactionCount_response.data) {
                nonce = transactionCount_response.data.result
            } else {
                return Promise.reject({ code: 9005 })
            }
        } catch (error) {
            console.log(error)

            return Promise.reject({ code: 9005 })
        }

        // console.log({ nonce })

        if (!fee.gasprice) {
            try {
                const gasprice_response = await etcRPC('eth_gasPrice', [])
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
        // console.log({ gasPrice_bn })

        let gaslimit
        try {
            const gaslimit_response = await etcRPC('eth_estimateGas', [{
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
        // console.log({ gasLimit_bn })

        let balance_bn
        try {
            const balance_response = await etcRPC('eth_getBalance', [sender, 'latest'])
            if (!balance_response.data) {
                return Promise.reject({ code: 9008 })
            }
            balance_bn = new BN(balance_response.data.result)
        } catch (error) {
            return Promise.reject({ code: 9008 })
        }
        // console.log({ balance: balance_bn.toNumber() })

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

        const raw_tx = new Transaction(tx_data, {
            common: Common.forCustomChain('mainnet', { name: 'etc', networkId: 1, chainId: 61 }, 'petersburg')
        })

        raw_tx.sign(Buffer.from(privkey.substring(2), 'hex'))

        const signedTX = raw_tx.serialize().toString('hex')
        // console.log({ signedTX })

        try {
            const txid_response = await etcRPC('eth_sendRawTransaction', [`0x` + signedTX])
            if (txid_response.data.result) {
                return Promise.resolve(txid_response.data.result)
            } else {
                console.log(txid_response.data);
                return Promise.reject({ code: 9010 })
            }
        } catch (error) {
            console.log(error)
            return Promise.reject({ code: 9010 })
        }
    } catch (err) {
        console.log(err)
        return Promise.reject({ code: 9010 })
    }
}

const sendTRX = async ({ privkey, receiver, amount }) => {
    const amount_bn_trx = new BN(amount)

    if (amount_bn_trx.isNaN()) {
        return Promise.reject({ code: 9002 })
    }

    const amount_bn_sun = new BN(tronNode.toSun(amount))

    try {
        const result = await tronNode.trx.sendTransaction(receiver, amount_bn_sun.toNumber(), privkey)
        return Promise.resolve(result.transaction.txID)
    } catch (error) {
        return Promise.reject({ code: 9010 })
    }
}

const sendTX = async ({ privkey, receiver, contract, amount, fee = {}, coin }) => {
    if (!coin || !privkey || !receiver || !amount) {
        return Promise.reject({ code: 9000 })
    }
    switch (coin) {
        case 'btc':
            return sendBTC({ privkey, receiver, amount, fee })
        case 'bch':
            return sendBCH({ privkey, receiver, amount, fee })
        case 'ltc':
            return sendLTC({ privkey, receiver, amount, fee })
        case 'eth':
            return sendETH({ privkey, receiver, amount, fee })
        case 'etc':
            return sendETC({ privkey, receiver, amount, fee })
        case 'erc20':
            return sendERC20({ privkey, receiver, contract, amount, fee })
        case 'trx':
            return sendTRX({ privkey, receiver, amount })
        default:
            return Promise.reject({ code: 9001 })
    }
}

export default sendTX