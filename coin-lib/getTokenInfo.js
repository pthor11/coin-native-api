import ethRPC from './lib/ethRPC'
import abi from 'ethereumjs-abi'
import ethUtil from './lib/ethereumjs-util'
import BN from 'bignumber.js'

export default async ({ address }) => {
    if (!ethUtil.isValidAddress(address)) {
        return Promise.reject({ code: 9013 })
    }

    try {
        const name_call_input_data = `0x` + abi.methodID('name', []).toString('hex') + abi.rawEncode([], []).toString('hex')

        const symbol_call_input_data = `0x` + abi.methodID('symbol', []).toString('hex') + abi.rawEncode([], []).toString('hex')

        const decimals_call_input_data = `0x` + abi.methodID('decimals', []).toString('hex') + abi.rawEncode([], []).toString('hex')

        const response = await ethRPC.batch([
            { method: 'eth_call', params: [{ to: address, data: name_call_input_data }, 'latest'] },
            { method: 'eth_call', params: [{ to: address, data: symbol_call_input_data }, 'latest'] },
            { method: 'eth_call', params: [{ to: address, data: decimals_call_input_data }, 'latest'] }
        ])

        const [name, symbol, decimals] = response.data.map(each => each.result)

        return Promise.resolve({
            name: ethUtil.toBuffer(name).toString(),
            symbol: ethUtil.toBuffer(symbol).toString(),
            decimals: new BN(decimals).toNumber()
        })
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9017 })
    }
}