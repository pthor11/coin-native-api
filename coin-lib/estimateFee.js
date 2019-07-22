import '../shim'
import { Buffer } from 'buffer'
import * as  bitcoinjs from 'bitcoinjs-lib'
import rpc from './lib/ethRPC'
import axios from 'axios'
const network = bitcoinjs.networks.testnet

const estimateByteSize = async ({sender, privkey, receiver, amount}) => {
    try {        
        amount = parseInt(100000000 * amount)

        const keyPair = bitcoinjs.ECPair.fromWIF(privkey, network)
        // console.log({keyPair})
        

        const utxos_response = await axios.get(`https://chain.so/api/v2/get_tx_unspent/btctest/${sender}`)
        const utxos = utxos_response.data.data.txs
        const balance = parseInt(100000000 * utxos.reduce((balance, utxo) => balance + utxo.value, 0))

        if (balance === 0 || utxos.length === 0) {
            return 223
        } 

        const inputs = utxos.map(utxo => { return { txid: utxo.txid, vout: utxo.output_no } })
        console.log({inputs})
        
        const txb = new bitcoinjs.TransactionBuilder(network)
        txb.setVersion(1)
        inputs.forEach(input => {
            txb.addInput(input.txid, input.vout)
        })
        txb.addOutput(receiver, amount)
        txb.addOutput(sender, balance - amount - 223)
        txb.sign(0, keyPair)
        
        const estimate_raw_tx =  txb.build().toHex()
        console.log({estimate_raw_tx})
        
        return Buffer.byteLength(estimate_raw_tx, 'hex')
    } catch (err) {
        throw new Error(err)
    }
}

const estimateGasLimit = async ({sender, receiver, amount, data}) => {
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

export default async ({coin, sender, privkey, receiver, amount, data}) => {
    switch (coin) {
        case 'btc':
            return estimateByteSize({sender, privkey, receiver, amount})
        case 'eth':
            return estimateGasLimit({sender, receiver, amount, data})
        default:
            break;
    }
}