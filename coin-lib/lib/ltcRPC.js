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
        url: `http://${ltc.url}:${ltc.port}`,
        headers: {
            Authorization: "Basic c2lsb3RlY2g6YWJjMTIz",
        },
        data,
        method: 'post'
    })
}

export default call