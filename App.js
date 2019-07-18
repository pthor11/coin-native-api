import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {getRandomPhrase, addNewAddress, signTX} from './coin-lib'
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
     
    const run = async() => {        
        const randomPhrase = await getRandomPhrase()

        const btc = await addNewAddress(testPhrase, 'btc', 0)
        console.log({btc})
        
        const eth = await addNewAddress(testPhrase, 'eth', 0)
        console.log({eth})

        const etc = await addNewAddress(testPhrase, 'etc', 0)
        console.log({etc})
        
        const trx = await addNewAddress(testPhrase, 'trx', 0)
        console.log({trx})

        const bch = await addNewAddress(testPhrase, 'bch', 0)
        console.log({bch})

        const ltc = await addNewAddress(testPhrase, 'ltc', 0)
        console.log({ltc})

        // recoveryAddresses()

        setTest({
            randomPhrase,
            testPhrase,
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
