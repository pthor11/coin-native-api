import axios from 'axios'
import {ltc} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '1.0',
        id: null
    })

    return axios({
        url: ltc.url,
        headers: {
            Authorization: ltc.auth,
        },
        data,
        method: 'post'
    })
}

export default call