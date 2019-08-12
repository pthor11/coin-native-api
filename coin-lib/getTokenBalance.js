import ethRPC from './lib/ethRPC'
import abi from 'ethereumjs-abi'
import ethUtil from './lib/ethereumjs-util'
import BN from 'bignumber.js'

export default async ({ address, contract }) => {
    if (!ethUtil.isValidAddress(address)) {
        return Promise.reject({ code: 9013 })
    }

    try {
        const balanceOf_call_input_data = `0x` + abi.methodID('balanceOf', ['address']).toString('hex') + abi.rawEncode(['address'], [address]).toString('hex')        

        const decimals_call_input_data = `0x` + abi.methodID('decimals', []).toString('hex') + abi.rawEncode([], []).toString('hex')

        const response = await ethRPC.batch([
            { method: 'eth_call', params: [{ to: contract, data: balanceOf_call_input_data }, 'latest'] },
            { method: 'eth_call', params: [{ to: contract, data: decimals_call_input_data }, 'latest'] }
        ])

        const [balanceOf, decimals] = response.data.map(each => each.result)

        return Promise.resolve({
            balance: new BN(balanceOf).toNumber(),
            decimals: new BN(decimals).toNumber()
        })
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9017 })
    }
}