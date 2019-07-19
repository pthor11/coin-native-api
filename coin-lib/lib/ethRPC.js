import axios from 'axios'
import {eth} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '2.0',
        id: null
    })

    return axios({
        url: `http://${eth.url}:${eth.port}`,
        data,
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post'
    })
}

export default call