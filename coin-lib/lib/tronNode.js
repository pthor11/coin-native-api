import tronweb from './tronweb'
import {tron} from '../config'

const tronNode=  new tronweb({
    fullNode: tron.full_node,
    solidityNode: tron.solidity_node,
    eventServer: tron.event_server,
    privateKey: '82049202137895895ca667cbc8eeb110d98180b7a4a83c765a74869cfd60995a'
})

tronNode.newFromPrivateKey = (privateKey) => {
    return new tronweb({
        fullNode: tron.full_node,
        solidityNode: tron.solidity_node,
        eventServer: tron.event_server,
        privateKey
    })
}

export default tronNode