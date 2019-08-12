import tronNode from './lib/tronNode'
import axios from 'axios'

export default async ({ id }) => {
    try {
        const contract = await tronNode.trx.getTokenFromID(id)
        return {name: contract.name, abbr: contract.abbr, precision: contract.precision || 0}
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9017 })
    }
}