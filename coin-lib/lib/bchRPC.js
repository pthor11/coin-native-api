import axios from 'axios'
import {bch} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '1.0',
        id: null
    })

    return axios({
        url: `http://${bch.url}:${bch.port}`,
        headers: {
            Authorization: bch.auth,
        },
        data,
        method: 'post'
    })
}

export default call