import * as CSVToJson from 'convert-csv-to-json';
import { Transaction, TokenBalance } from './types/types';
import axios from 'axios';

const transactions: Transaction[] = CSVToJson.fieldDelimiter(',')
    .getJsonFromCsv("./data/transactions.csv");

const tokens: { [key: string]: number; } = {};
transactions.map(transaction => {
    if (transaction.transaction_type == "DEPOSIT") {
        if (!tokens[transaction.token]) tokens[transaction.token] = 0;
        tokens[transaction.token] += Number(transaction.amount);
    } else {
        if (tokens[transaction.token]) tokens[transaction.token] -= Number(transaction.amount);
        else tokens[transaction.token] = 0;
    }
})

Promise.all(Object.keys(tokens).map(async token => {
    const tokenBalance: TokenBalance = {
        token: token,
        amount: tokens[token],
        price: 0,
        totalPrice: 0,
    }
    try {
        const { data } = await axios.get('https://min-api.cryptocompare.com/data/price',
            {
                params: {
                    fsym: token,
                    tsyms: 'USD',
                    // Service is not free.
                    api_key: '970c8101d0fb0a15d9df839fa504f1070f56f0ffa4c55d6314a74f5f5715ae2e'
                }
            })
        data && data.USD && (tokenBalance.price = data.USD);
        tokenBalance.totalPrice = tokenBalance.price * tokenBalance.amount;
    } catch (error) {
        console.error(error);
    }
    return tokenBalance;
})).then((result) => {
    console.log(result)
})
