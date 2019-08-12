import axios from 'axios'
import {eth} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '2.0',
        id: 1
    })

    return axios({
        url: `https://kovan.infura.io/v3/031b93b2f6af43d9898bc9eefb11d35e`,//`http://${eth.url}:${eth.port}`,
        data,
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post'
    })
}

call.batch = (requestArray) => {
    const data = JSON.stringify(requestArray.map((request, index) => {
        return {
            method: request.method,
            params: request.params,
            jsonrpc: '2.0',
            id: index
        }
    }))
    
    return axios({
        url: `https://mainnet.infura.io/v3/031b93b2f6af43d9898bc9eefb11d35e`,//`http://${eth.url}:${eth.port}`,
        data,
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post'
    })
}

export default call