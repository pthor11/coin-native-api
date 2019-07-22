import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRandomPhrase, addNewAddress, sendTX, estimateFee } from './coin-lib'
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

        // const txid = await sendTX({ coin: 'btc', privkey: 'cUi8whzQVGcVEnAs5B8q39NeHr1eHg8ANrGgx5dGxw1THkZ72T8c', receiver: '2Msnku9hwYkJ3GoJeu8hJSxygQiR9YYPmHs', amount: 0.00001})

        const bytesize = await estimateFee({ coin: 'btc', sender: "mnjThbQvU3Xeh2YhiE2MqwgmrZAxq1Rmdi" , privkey: 'cUi8whzQVGcVEnAs5B8q39NeHr1eHg8ANrGgx5dGxw1THkZ72T8c', receiver: 'mnjThbQvU3Xeh2YhiE2MqwgmrZAxq1Rmdi', amount: 0.00001})

        // const gaslimit = await estimateFee({coin: 'eth',sender: '0xc918975b8591b0104eaaf7a0ddcbc892bb78a88a', receiver: '0xc918975B8591b0104eAAF7a0DDcBc892bB78A88A', amount: 0.00001})

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
            bytesize,
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
            <Text>bytesize btc tx:</Text>
            <Text>{test ? test.bytesize : null}</Text>
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
