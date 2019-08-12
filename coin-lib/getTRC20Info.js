import tronNode from './lib/tronNode'

export default async ({ address }) => {
    try {
        const contract = await tronNode.contract().at(address)
        const [name, symbol, decimals] = await Promise.all([
            contract.name().call(),
            contract.symbol().call(),
            contract.decimals().call()
        ])
        return {name, symbol, decimals}
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 9017 })
    }
}