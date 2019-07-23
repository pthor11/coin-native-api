import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import ethUtil from './lib/ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import btcRPC from './lib/btcRPC'
import ethRPC from './lib/ethRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'

const sendBTC = async ({ privkey, receiver, amount, fee }) => {
    amount = parseInt(100000000 * amount)

    const keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
    const sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.btc.network }).address
    // console.log({ sender })

    try {
        // Get unspent txs
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        const utxos = utxos_response.data.data.txs
        //console.log({ utxos })

        // Check amount
        // console.log({ amount })

        const balance = parseInt(100000000 * utxos.reduce((balance, utxo) => balance + parseFloat(utxo.value), 0))
        // console.log({ balance })

        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })
        //console.log({inputs})


        const createRawTX = (feerate = 0, bytesize = 1) => {
            const txb = new bitcoinjs.TransactionBuilder(coinlist.btc.network)
            txb.setVersion(1)
            txb.addOutput(receiver, amount)
            txb.addOutput(sender, balance - amount - feerate * bytesize)
            for (let i = 0; i < inputs.length; i++) {
                txb.addInput(inputs[i].txid, inputs[i].vout)
            }
            for (let i = 0; i < inputs.length; i++) {
                txb.sign(i, keyPair)
            }
    
            return txb.build().toHex()
        }

        let raw_tx
        let bytesize
        let estimate_raw_tx
        if (!fee.feerate) {
            const feerate_response = await btcRPC('estimatesmartfee', [2])
            fee.feerate = parseInt(feerate_response.data.result.feerate * 100000)
        }
        //console.log({ feerate: fee.feerate })
        estimate_raw_tx = createRawTX(fee.feerate, 223)
        //console.log({estimate_raw_tx})
        bytesize = Buffer.byteLength(estimate_raw_tx, 'hex')
        //console.log({bytesize})

        raw_tx = createRawTX(fee.feerate, bytesize)
        //console.log({raw_tx})


        const result_response = await btcRPC('sendrawtransaction', [raw_tx])
        const result = result_response.data

        if (!result.err || result.result) {
            return result.result
        } else {
            throw new Error(err)
        }

    } catch (err) {
        //console.log(err)
        throw new Error(err)
    }

}

const sendETH = async ({ privkey, receiver, amount, fee }) => {
    try {
        amount = amount * 1000000000000000000
        const sender = `0x` + ethUtil.privateToAddress(privkey).toString('hex')
        console.log({ sender })

        const transactionCount_response = await ethRPC('eth_getTransactionCount', [sender, 'pending'])
        const nonce = transactionCount_response.data.result
        console.log({ nonce })

        if (!fee.gasprice) {
            const gasprice_response = await ethRPC('eth_gasPrice', [])
            fee.gasprice = gasprice_response.data.result
        }
        console.log({ gasprice: parseInt(fee.gasprice) })

        const gaslimit_response = await ethRPC('eth_estimateGas', [{
            from: sender,
            to: receiver,
            value: `0x` + amount.toString(16)
        }])
        const gaslimit = gaslimit_response.data.result
        console.log({ gaslimit: parseInt(gaslimit) })

        const tx_data = {
            nonce,
            gasPrice: fee.gasprice,
            gasLimit: gaslimit,
            to: receiver,
            value: '0x' + amount.toString(16)
        }

        const raw_tx = new Transaction(tx_data)
        raw_tx.sign(Buffer.from(privkey.substring(2), 'hex'))

        const signedTX = raw_tx.serialize().toString('hex')
        console.log({ signedTX })

        const tx_response = await ethRPC('eth_sendRawTransaction', [`0x` + signedTX])
        
        return tx_response.data.result ? tx_response.data.result : tx_response.data.error.message
    } catch (err) {
        throw new Error(err.response.data)
    }
}

const sendTX = ({ privkey, receiver, amount, fee = {}, coin }) => {
    switch (coin) {
        case 'btc':
            return sendBTC({ privkey, receiver, amount, fee })
        case 'eth':
            return sendETH({ privkey, receiver, amount, fee })
        default:
            return null
    }
}

export default sendTX