import tronweb from './tronweb'
import {tron} from '../config'

export default new tronweb({
    fullNode: tron.full_node,
    solidityNode: tron.solidity_node,
    eventServer: tron.event_server,
    privateKey: '7886ee3ed3d1627840d91842368fbdb6d12eaef7af422b7e268a461c6aeafeea'
})