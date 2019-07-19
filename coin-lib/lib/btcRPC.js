import axios from 'axios'
import {btc} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '1.0',
        id: null
    })

    return axios({
        url: 'http://192.168.1.250:18332',//`http://${btc.url}:${btc.port}`,
        headers: {
            Authorization: "Basic c2lsb3RlY2g6YWJjMTIz",
        },
        // auth: {
        //     username: 'silotech',//btc.username,
        //     password: 'abc123', //btc.password,
        // },
        data,
        method: 'post'
    })
}

export default call