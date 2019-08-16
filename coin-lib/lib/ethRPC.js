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
        url: eth.url,
        data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': eth.auth,
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
        url: eth.url,
        data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': eth.auth,
        },
        method: 'post'
    })
}

export default call