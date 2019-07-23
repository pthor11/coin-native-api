import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import btcRPC from './lib/btcRPC'
import axios from 'axios'
import coinlist from './lib/coinlist'

const sendBTC = async ({privkey, receiver, amount, fee}) => {
    amount = parseInt(100000000 * amount)

    const keyPair = bitcoinjs.ECPair.fromWIF(privkey, coinlist.btc.network)
    const sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: coinlist.btc.network }).address
    //console.log({ sender })

    try {
        // Get unspent txs
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        const utxos = utxos_response.data.data.txs
        //console.log({ utxos })

        // Check amount
        //console.log({ amount })

        const balance = parseInt(100000000 * utxos.reduce((balance, utxo) => balance + parseFloat(utxo.value), 0))
        //console.log({ balance })

        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })
        //console.log({inputs})
        

        const createRawTX = (feerate = 0, bytesize = 1) => {
            const txb = new bitcoinjs.TransactionBuilder(coinlist.btc.network)
            txb.setVersion(1)
            txb.addOutput(receiver, amount)
            txb.addOutput(sender, balance - amount - feerate * bytesize)
            for (let i = 0; i < inputs.length; i++) {
                txb.addInput(inputs[i].txid, inputs[i].vout)
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

const sendETH = async ({privkey, receiver, amount, fee}) => {

}

const sendTX = ({ privkey, receiver, amount, fee = {}, coin}) => {
    switch (coin) {
        case 'btc':
            return sendBTC({ privkey, receiver, amount, fee })
        case 'eth':
            return sendETH({privkey, receiver, amount, fee})
        default:
            return null
    }
}

export default sendTX