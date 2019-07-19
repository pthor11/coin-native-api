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
}

const btc = {
    url: '192.168.1.250',
    port: 18332,
    username: 'silotech',
    password: 'abc123',
    
}

const ltc = {
    url: process.env.LTC_NODE_URL,
    port: process.env.LTC_NODE_PORT,
    username: process.env.LTC_NODE_USERNAME,
    password: process.env.LTC_NODE_PASSWORD
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
    tron
}