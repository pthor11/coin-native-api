
const signBTC = async () => {

}

const signTX = (privkey, receiver, value, fee, coin) => {
    switch (coin) {
        case 'btc':
            return signBTC(privkey, receiver, value, fee)
        default:
            break;
    }
}

export default signTX