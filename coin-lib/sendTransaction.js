import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import btcRPC from './lib/btcRPC'
import axios from 'axios'
const network = bitcoinjs.networks.testnet

const sendBTC = async ({privkey, receiver, amount, fee}) => {
    amount = parseInt(100000000 * amount)

    const keyPair = bitcoinjs.ECPair.fromWIF(privkey, network)
    const sender = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network }).address
    //console.log({ sender })

    try {
        // Get unspent txs
        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        const utxos = utxos_response.data.data.txs
        //console.log({ utxos })

        // Check amount
        //console.log({ amount })

        const balance = parseInt(100000000 * utxos.reduce((balance, utxo) => balance + utxo.value, 0))
        //console.log({ balance })

        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })

        const createRawTX = (feerate = 0, bytesize = 1) => {
            const txb = new bitcoinjs.TransactionBuilder(network)
            txb.setVersion(1)
            inputs.forEach(input => {
                txb.addInput(input.txid, input.vout)
            })
            txb.addOutput(receiver, amount)
            txb.addOutput(sender, balance - amount - feerate * bytesize)
            txb.sign(0, keyPair)

            return txb.build().toHex()
        }

        let raw_tx

        if (!fee.feerate) {
            const feerate_response = await btcRPC('estimatesmartfee', [2])
            const feerate = parseInt(feerate_response.data.result.feerate * 100000)
            //console.log({ feerate })

            const estimate_raw_tx = createRawTX(feerate, 223)
            //console.log({estimate_raw_tx})
            
            const bytesize = Buffer.byteLength(estimate_raw_tx, 'hex') 
            //console.log({bytesize})

            raw_tx = createRawTX(feerate, bytesize)
            //console.log({raw_tx})
            
        }

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

const sendTX = ({ privkey, receiver, amount, fee = {}, coin}) => {
    switch (coin) {
        case 'btc':
            return sendBTC({ privkey, receiver, amount, fee })
        default:
            break;
    }
}

export default sendTX