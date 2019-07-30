import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRandomPhrase, addNewAddress, sendTX, estimateFee, getTX } from './coin-lib'
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
            // const fee_btc = await estimateFee({ coin: 'btc', sender: "mmbkkktHcJQS6p9FsbEc3vrK9NYLwuVzaD", privkey: 'cRWEzk4GPB2CRmryDPm91vKiiQbrAdM3WuSpddh3kjSiJHeZQnvt', receiver: 'mxHTHCzyBFK8ZK3BXszJZQCeixtzdumht4', amount: 0.00002 })
            // console.log({ fee_btc })

            // const fee_eth = await estimateFee({ coin: 'eth', sender: '0xc918975b8591b0104eaaf7a0ddcbc892bb78a88a', receiver: '0xc918975B8591b0104eAAF7a0DDcBc892bB78A88A', amount: 0.00001 })
            // console.log({ fee_eth })

            // const send_btc_tx = await sendTX({
            //     privkey: "cRWEzk4GPB2CRmryDPm91vKiiQbrAdM3WuSpddh3kjSiJHeZQnvt",
            //     receiver: "mxHTHCzyBFK8ZK3BXszJZQCeixtzdumht4",
            //     fee: { feerate: 0.1 },
            //     amount: 0.0001,
            //     coin: 'btc'
            // })
            // console.log({ send_btc_tx })

            // const send_eth_tx = await sendTX({
            //     privkey: "0xA777E56259DDE78FAD49B90FAE938D30EBBB27AE9D9726B622DF8F6138C006C8",
            //     receiver: "0xf457aAf330a34Aba49688348d381caAaDC094023",
            //     // fee: { gasprice: 10000000000 },
            //     amount: 0.000528,
            //     coin: 'eth'
            // })
            // console.log({ send_eth_tx })
            
            const btc_txid = '9aa14e1d2e5924cda8c3e2a277e9e502914e85a61e13d4032e04534aeba3b4bf'
            const tx = await getTX({coin: 'btc', txid: btc_txid})
            console.log({tx})
            
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
