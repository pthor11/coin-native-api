import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import btcRPC from './lib/btcRPC'
import ethRPC from './lib/ethRPC'
import axios from 'axios'
import BN from 'bignumber.js'
import CoinSelect from 'coinselect'
import coinlist from './lib/coinlist'
import { eth } from './config'

const sendBTC = async ({ privkey, receiver, amount, fee }) => {
    const amount_bn_sat = new BN(amount).multipliedBy(100000000)
    console.log({ amount: amount_bn_sat.toNumber() })

    const keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
    const sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.btc.network }).address
    console.log({ sender })

    try {
        // Get unspent txs
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        let utxos = utxos_response.data.data.txs
        // console.log({ utxos })
        
        // Check amount
        // console.log({ amount })

        const balance_bn_sat = utxos.reduce((balance, utxo) => balance.plus(utxo.value), new BN(0)).multipliedBy(100000000)
        console.log({ balance_bn_sat })

        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })
        console.log({inputs})


        const createRawTX = (vinputs, voutputs, fee) => {
            // console.log({feerate, bytesize})
            
            const txb = new bitcoinjs.TransactionBuilder(coinlist.btc.network)
            txb.setVersion(1)
            voutputs.forEach(output => {
                if (!output.address) {
                    output.address = sender
                }
                txb.addOutput(output.address, output.value)
            })
            // txb.addOutput(receiver, amount_bn_sat.toNumber())
            // txb.addOutput(sender, balance_bn_sat.minus(amount_bn_sat).minus(fee).toNumber())
            vinputs.forEach(input => {
                txb.addInput(input.txId, input.vout)
            })
            for (let i = 0; i < inputs.length; i++) {
                txb.sign(i, keyPair)
            }

            return txb.build().toHex()
        }

        // let raw_tx
        // let bytesize
        // let estimate_raw_tx
        

        if (!fee.feerate) {
            try {
                const feerate_response = await btcRPC('estimatesmartfee', [2])
                console.log(feerate_response.data)
                
                fee.feerate = new BN(feerate_response.data.result.feerate).multipliedBy(100000).toNumber()    
            } catch (error) {
                console.log(error.response.data)
                
            }
            
        }
        console.log({ feerate: fee.feerate })


        utxos = utxos.map(utxo => {return {txId: utxo.txid, vout: utxo.output_no, value: new BN(utxo.value).multipliedBy(100000000).toNumber()}})
        const targets = [
            {
                address: receiver,
                value: amount_bn_sat.toNumber()
            }
        ]

        console.log({utxos})
        console.log({targets})
        
        const aa = CoinSelect(utxos, targets, 1)
        console.log({fee: aa.fee});
        console.log({inputs: aa.inputs});
        console.log({outputs: aa.outputs});
        // process.exit(0)

        raw_tx = createRawTX(aa.inputs, aa.outputs, aa.fee)
        console.log({ raw_tx })

        console.log((await btcRPC('getnetworkinfo', [])).data)
        

        const result_response = await btcRPC('sendrawtransaction', [raw_tx])

        const result = result_response.data

        if (!result.err || result.result) {
            return result.result
        } else {
            throw new Error(err)
        }

    } catch (err) {
        console.log(err.response.data)
        throw new Error(err)
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
                return Promise.reject({code: 9007})
            } 
            gaslimit = gaslimit_response.data.result
            console.log({gaslimit})
            
        } catch (error) {
            return Promise.reject({code: 9007})
        }
        const gasLimit_bn = new BN(gaslimit)
        // console.log({ gaslimit: parseInt(gaslimit) })

        let balance_bn
        try {
            const balance_response = await ethRPC('eth_getBalance', [sender, 'latest'])
            if (!balance_response.data) {
                return Promise.reject({code: 9008})
            }
            balance_bn = new BN(balance_response.data.result)
        } catch (error) {
            return Promise.reject({code: 9008})
        }
        console.log({balance: balance_bn.toNumber()})

        if (amount_bn_wei.plus(gasPrice_bn).isGreaterThanOrEqualTo(balance_bn)) {
            return Promise.reject({code: 9009})
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
                return Promise.reject({code: 9010})
            }
        } catch (error) {
            return Promise.reject({code: 9010})
        }
    } catch (err) {
        return Promise.reject({code: 9010})
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