import tronNode from './lib/tronNode'
import BN from 'bignumber.js'

export default async ({ address, contract }) => {
    try {
        const token = await tronNode.contract().at(contract)
        const [decimals, balanceOf] = await Promise.all([
            token.decimals().call(),
            token.balanceOf(address).call()
        ])
        return {decimals, balance: new BN(balanceOf).toNumber()}
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9017 })
    }
}