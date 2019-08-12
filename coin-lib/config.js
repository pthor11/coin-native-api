const eth = {
    url: '192.168.1.250',
    port: 8545,
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz',
    chain: 'kovan'
}


const btc = {
    url: '192.168.1.250',
    port: 8332,
    username: 'silotech',
    password: 'abc123',
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz'
}

const bch = {
    url: '192.168.1.240',
    port: 18332,
    username: 'silotech',
    password: 'abc123',
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz'
}

const ltc = {
    url: '192.168.1.250',
    port: 9332,
    username: 'silotech',
    password: 'abc123',
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz'
}

const etc = {
    url: 'https://etc-parity.0xinfra.com/'
}

const tron = {
    full_node: 'https://api.trongrid.io', //'https://api.shasta.trongrid.io',
    solidity_node: 'https://api.trongrid.io', //'https://api.shasta.trongrid.io',
    event_server: 'https://api.trongrid.io' //'https://api.shasta.trongrid.io'
}

export  {
    eth,
    btc,
    bch,
    ltc,
    etc,
    tron
}