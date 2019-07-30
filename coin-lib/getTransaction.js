import btcRPC from './lib/btcRPC'
import ethRPC from './lib/ethRPC'
import BN from 'bignumber.js'


const txBTC = async ({ txid }) => {
    try {

        const raw_tx = await btcRPC('getrawtransaction', [txid, true])
        const tx = raw_tx.data.result

        const outputs = tx.vout.map(each => {
            return {
                addresses: each.scriptPubKey.addresses,
                value: each.value
            }
        })

        let inputs = []

        for (const each of tx.vin) {
            try {
                const each_input = await btcRPC('getrawtransaction', [each.txid, true])
                const input = each_input.data.result.vout[each.vout]
                inputs.push({ addresses: input.scriptPubKey.addresses, value: input.value })
            } catch (error) {
                return Promise.reject({ code: 9016 })
            }
        }

        const sum_value_input_bn_btc = inputs.reduce((sum, input) => sum.plus(input.value), new BN(0))
        const sum_value_output_bn_btc = outputs.reduce((sum, output) => sum.plus(output.value), new BN(0))

        const fee_bn_btc = sum_value_input_bn_btc.minus(sum_value_output_bn_btc)

        const sent_address = inputs[0].addresses[0]

        let amount_bn_btc = new BN(outputs.find(output => !output.addresses.includes(sent_address)).value)

        return Promise.resolve({
            hash: raw_tx.data.result.hash,
            block: raw_tx.data.result.blockhash,
            timestamp: raw_tx.data.result.time,
            amount: amount_bn_btc.toNumber(),
            fee: fee_bn_btc.toNumber(),
            inputs,
            outputs,
        })
    } catch (error) {
        Promise.reject({ code: 9015 })
    }
    return txid
}

const txETH = async ({ txid }) => {
    let transaction_tx
    let receipt_tx
    let block
    try {
        transaction_tx = await ethRPC('eth_getTransactionByHash', [txid])
        receipt_tx = await ethRPC('eth_getTransactionReceipt', [txid])
    } catch (error) {
        console.log(error)
        return Promise.reject({ code: 9015 })
    }
    const blockNumber = transaction_tx.data.result.blockNumber || null
    console.log({blockNumber})
    
    block = blockNumber ? await ethRPC('eth_getBlockByNumber', [blockNumber, true]) : null
    
    // console.log('transaction_tx', transaction_tx.data.result)
    // console.log('receipt_tx', receipt_tx.data.result)
    // console.log('block', block.data.result)    

    return Promise.resolve({
        hash: transaction_tx.data.result.hash,
        block: transaction_tx.data.result.blockNumber ? new BN(transaction_tx.data.result.blockNumber).toNumber() : undefined,
        timestamp: block ? new BN(block.data.result.timestamp).toNumber() : undefined,
        amount: new BN(transaction_tx.data.result.value).toNumber(),
        fee: receipt_tx.data ? new BN(receipt_tx.data.result.gasUsed).multipliedBy(transaction_tx.data.result.gasPrice).dividedBy(1000000000000000000).toNumber() : undefined,
        from: transaction_tx.data.result.from,
        to: transaction_tx.data.result.to,
    })
}


const getTX = async ({ coin, txid }) => {
    if (!coin || !txid) {
        return Promise.reject({ code: 9000 })
    }
    switch (coin) {
        case 'btc':
            return txBTC({ txid })
        case 'eth':
            return txETH({ txid })
        default:
            return Promise.reject({ code: 9001 })
    }
}

export default getTX