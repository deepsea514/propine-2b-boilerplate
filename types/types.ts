export type Transaction = {
    timestamp: number;
    transaction_type: string;
    token: string;
    amount: number;
}

export type TokenBalance = {
    token: string,
    amount: number,
    price: number,
    totalPrice: number,
}