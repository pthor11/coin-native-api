import tronweb from './tronweb'
import {tron} from '../config'

export default new tronweb({
    fullNode: tron.full_node,
    solidityNode: tron.solidity_node,
    eventServer: tron.event_server
})