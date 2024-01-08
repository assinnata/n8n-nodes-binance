import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData } from 'n8n-workflow';
import createBinance, { OrderSide_LT } from 'binance-api-node';
import BigNumber from 'bignumber.js';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('binanceApi', index);
	const binanceClient = createBinance(credentials);

	const side = this.getNodeParameter('side', index) as string;
	const symbol = this.getNodeParameter('symbol', index) as string;

	const quantity = this.getNodeParameter('quantity', index) as string;
	const reduceOnly = this.getNodeParameter('reduceOnly', index) as boolean;

	let currentPrice = await binanceClient.futuresMarkPrice();
	// get symbol price
	let symbolPrice = currentPrice.find((item) => item.symbol === symbol);
	let price = symbolPrice?.markPrice!;

	const order = await binanceClient.futuresOrder({
		symbol,
		quantity,
		price,
		side: side as OrderSide_LT,
		type: 'LIMIT',
		timeInForce: 'GTC',
		reduceOnly: `${reduceOnly}`,
	});

	while (order.executedQty < order.origQty) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		currentPrice = await binanceClient.futuresMarkPrice();
		// get symbol price
		symbolPrice = currentPrice.find((item) => item.symbol === symbol);
		price = symbolPrice?.markPrice!;

		// update the order price limit
		const orderStatus = await binanceClient.futuresGetOrder({ symbol, orderId: order.orderId });
		await binanceClient.futuresCancelOrder({ symbol, orderId: order.orderId });
		if (orderStatus.status === 'FILLED') {
			break;
		} else {
			const newQuantity = new BigNumber(orderStatus.origQty)
				.minus(orderStatus.executedQty)
				.toString();
			await binanceClient.futuresOrder({
				symbol,
				quantity: newQuantity,
				price,
				side: side as OrderSide_LT,
				type: 'LIMIT',
				timeInForce: 'GTC',
				reduceOnly: `${reduceOnly}`,
			});
		}
	}

	return this.helpers.returnJsonArray(order as any);
}
