const mongo = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    url: process.env.MONGO_URL,
    port: process.env.MONGO_PORT,
    db_auth: process.env.MONGO_DB_AUTH,
    db_full_txs: process.env.MONGO_DB_FULL_TXS,
    db_short_txs: process.env.MONGO_DB_SHORT_TXS,
}

const eth = {
    url: '192.168.1.250',
    port: 8545,
    chain: 'kovan'
}


const btc = {
    url: '192.168.1.250',
    port: 18332,
    username: 'silotech',
    password: 'abc123',
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz'
}

const ltc = {
    url: '192.168.1.250',
    port: 19332,
    username: 'silotech',
    password: 'abc123',
    auth: 'Basic c2lsb3RlY2g6YWJjMTIz'
}

const etc = {
    url: 'https://etc-parity.0xinfra.com/'
}

const tron = {
    full_node: process.env.TRON_FULL_NODE,
    solidity_node: process.env.TRON_SOLIDITY_NODE,
    event_server: process.env.TRON_EVENT_SERVER
}

export  {
    mongo,
    eth,
    btc,
    ltc,
    etc,
    tron
}