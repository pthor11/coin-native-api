import axios from 'axios'
import {etc} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '2.0',
        id: null
    })

    return axios({
        url: etc.url,
        data,
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post'
    })
}

export default call