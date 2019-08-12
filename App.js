import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRandomPhrase, addNewAddress, sendTX, estimateFee, getTX, getTokenInfo, getTokenBalance } from './coin-lib'
const testPhrase = [
    'lounge',
    'devote',
    'ten',
    'tennis',
    'title',
    'medal',
    'similar',
    'badge',
    'steel',
    'boy',
    'cotton',
    'fringe',
    'gesture',
    'sock',
    'club',
    'slide',
    'tornado',
    'easy',
    'weird',
    'want',
    'face',
    'victory',
    'father',
    'sleep'
]



export default function App() {
    const [test, setTest] = useState()

    const run = async () => {

        try {

            // console.log(addNewAddress(testPhrase, 'bch', 0))
            // console.log(addNewAddress(testPhrase, 'bch', 1))


            // const fee_btc = await estimateFee({ coin: 'btc', sender: "mmbkkktHcJQS6p9FsbEc3vrK9NYLwuVzaD", privkey: 'cRWEzk4GPB2CRmryDPm91vKiiQbrAdM3WuSpddh3kjSiJHeZQnvt', receiver: 'mxHTHCzyBFK8ZK3BXszJZQCeixtzdumht4', amount: 0.00002 })
            // console.log({ fee_btc })

            // const fee_ltc = await estimateFee({ coin: 'ltc', sender: "mrgShXLLUJ955jspwh7gbtY8iBigY3eCaQ", receiver: 'n1BQw7FBKJfyt7EXDEvB2LjeWwxxHfFxuK', amount: 0.00002 })
            // console.log({ fee_ltc })

            // const fee_bch = await estimateFee({ coin: 'bch', sender: "1NyFVXB6XBF8woipZtgW3jYBbkVQFPdFA5", receiver: '1MDyWzZjhtM8h1vpDzoyi3Pe2KALsyE7FM', amount: 0.00004 })
            // console.log({ fee_bch })

            // const fee_eth = await estimateFee({ coin: 'eth', sender: '0xc918975b8591b0104eaaf7a0ddcbc892bb78a88a', receiver: '0x959FD7Ef9089B7142B6B908Dc3A8af7Aa8ff0FA1', amount: 0.00001 })
            // console.log({ fee_eth })

            // const fee_erc20 = await estimateFee({ coin: 'erc20', sender: '0x68fa7cC45D3B45bd58E1b05Dc5a377312641caa8', receiver: '0xf457aAf330a34Aba49688348d381caAaDC094023', contract: '0x904c3dea0531faf6326bacfb2a64bce23b210bf9', amount: 10 })
            // console.log({ fee_erc20 })

            // const fee_etc = await estimateFee({ coin: 'etc', sender: '0x34edb9229cC14ac39874070658bF3e8ad0069976', receiver: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', amount: 0.01 })
            // console.log({ fee_etc })


            // const send_erc20_tx = await sendTX({
            //     privkey: "0x0976D1A55FDE0E6A22B92A21E7AE3D9D43F151B087EC2AAA29F5085B3678DECC",
            //     receiver: "0xf457aAf330a34Aba49688348d381caAaDC094023",
            //     contract: "0x904C3dEA0531Faf6326bACFB2a64Bce23b210Bf9",
            //     // fee: { gasprice: 10000000000 },
            //     amount: 10,
            //     coin: 'erc20'
            // })
            // console.log({ send_erc20_tx })


            // const send_btc_tx = await sendTX({
            //     privkey: "cRWEzk4GPB2CRmryDPm91vKiiQbrAdM3WuSpddh3kjSiJHeZQnvt",
            //     receiver: "mxHTHCzyBFK8ZK3BXszJZQCeixtzdumht4",
            //     fee: { feerate: 0.1 },
            //     amount: 0.0001,
            //     coin: 'btc'
            // })
            // console.log({ send_btc_tx })

            // const send_bch_tx = await sendTX({
            //     privkey: "KxMKp9W38evnGn217ufWXP6go8HNUexNGhA2MdSezpxqk1NPG91x",
            //     receiver: "1MDyWzZjhtM8h1vpDzoyi3Pe2KALsyE7FM",
            //     // fee: { feerate: 0.1 },
            //     amount: 0.00004,
            //     coin: 'bch'
            // })
            // console.log({ send_bch_tx })

            // const send_ltc_tx = await sendTX({
            //     privkey: "cW28z1Qm1pHgVGxmzcHCFZ5cuGM2CvT3uNNNUapTpNoxnVLH2JQq",
            //     receiver: "n1BQw7FBKJfyt7EXDEvB2LjeWwxxHfFxuK",
            //     fee: { feerate: 0.1 },
            //     amount: 0.0001,
            //     coin: 'ltc'
            // })
            // console.log({ send_ltc_tx })

            // const send_eth_tx = await sendTX({
            //     privkey: "0xA777E56259DDE78FAD49B90FAE938D30EBBB27AE9D9726B622DF8F6138C006C8",
            //     receiver: "0xf457aAf330a34Aba49688348d381caAaDC094023",
            //     // fee: { gasprice: 10000000000 },
            //     amount: 0.000528,
            //     coin: 'eth'
            // })
            // console.log({ send_eth_tx })

            // const send_etc_tx = await sendTX({
            //     privkey: "0x08b3038ce98d48d544730cc67228a26c884a645c4f09c094df67775730d8ebc6",
            //     receiver: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
            //     // fee: { gasprice: 30000000000 },
            //     amount: 0.01,
            //     coin: 'etc'
            // })
            // console.log({ send_etc_tx })

            // const btc_txid = 'c93da679bd46c93669c62b040f22b46469d7bbbb88af78860d506dbebebe4a8f'
            // const tx = await getTX({coin: 'btc', txid: btc_txid})
            // const eth_txid = '0x94d9bed68e8743be4c2545d77418f75100e16f6cab3e2c45e7db6ac10a94b4fd'
            // const tx = await getTX({coin: 'eth', txid: eth_txid})
            // console.log({tx})

            // const tx = await sendTX({
            //     coin: 'trx',
            //     receiver: 'TH1TKfZb3zmkF3K7Mg9jQw3skhRT8oEbHG',
            //     privkey: '7886ee3ed3d1627840d91842368fbdb6d12eaef7af422b7e268a461c6aeafeea',
            //     amount: 0.0001
            // })

            // console.log({tx})

            // const usdt = await getTokenInfo({address: "0xdac17f958d2ee523a2206206994597c13d831ec7"})
            // const akc = await getTokenInfo({address: "0x904C3dEA0531Faf6326bACFB2a64Bce23b210Bf9"})
            // console.log({usdt})
            
            const balanceOf = await getTokenBalance({address: '0x0A98fB70939162725aE66E626Fe4b52cFF62c2e5', contract: '0xdac17f958d2ee523a2206206994597c13d831ec7'})

            console.log({balanceOf})
            

        } catch (error) {
            console.log(error);
        }


        const randomPhrase = await getRandomPhrase()

        // const btc = await addNewAddress(testPhrase, 'btc', 0)
        // console.log({btc})

        // const eth = await addNewAddress(testPhrase, 'eth', 0)
        // console.log({eth})

        // const etc = await addNewAddress(testPhrase, 'etc', 0)
        // console.log({etc})

        // // const trx = await addNewAddress(testPhrase, 'trx', 0)
        // // console.log({trx})

        // const bch = await addNewAddress(testPhrase, 'bch', 0)
        // console.log({bch})

        // const ltc = await addNewAddress(testPhrase, 'ltc', 0)
        // console.log({ltc})

        // recoveryAddresses()

        setTest({
            randomPhrase,
            testPhrase,
            // bytesize,
            // gaslimit,
            // txid
        })



    }

    useEffect(() => {
        run()
    }, [])

    return (
        <View style={styles.container}>
            <Text>new phrase:</Text>
            <Text>{test ? test.randomPhrase.join(' ') : null}</Text>
            <Text> === </Text>
            <Text>test phrase:</Text>
            <Text>{test ? test.testPhrase.join(' ') : null}</Text>
            <Text> === </Text>
            {/* <Text>bytesize btc tx:</Text>
            <Text>{test ? test.bytesize : null}</Text> */}
            {/* <Text> === </Text>
            <Text>gaslimit eth tx:</Text>
            <Text>{test ? test.gaslimit : null}</Text> */}
            {/* <Text>new tx:</Text>
            <Text>{test ? test.txid : null}</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
