import tronNode from './lib/tronNode'
import axios from 'axios'

export default async ({ address }) => {
    try {
        const { balance, assetV2 } = (await axios.post('https://api.trongrid.io/wallet/getaccount', { address: tronNode.address.toHex(address) })).data

        return {balance, trc10: assetV2}
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9008 })
    }
}