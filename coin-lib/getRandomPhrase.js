import * as Random from 'expo-random'
import wordlist from './lib/wordlist_eng'

export default async () => {
    let randoms = []
    const quantity = 24
    while (randoms.length < quantity) {
        let randomBytes = await Random.getRandomBytesAsync(100)
        let number = (randomBytes["0"] * 16 + randomBytes["1"]) % 2048
        if (!randoms.includes(number)) {
            randoms.push(number)
        }
    }
    const words = randoms.map(random => wordlist[random])
    return words
}