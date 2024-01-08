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

	const action = this.getNodeParameter('action', index) as string;
	const side = this.getNodeParameter('side', index) as string;
	const symbol = this.getNodeParameter('symbol', index) as string;

	if (action === 'SMART') {
		let currentPrice = await binanceClient.futuresMarkPrice();
		// get symbol price
		let symbolPrice = currentPrice.find((item) => item.symbol === symbol);
		let price = symbolPrice?.markPrice!;
		const quantity = this.getNodeParameter('quantity', index) as string;
		const reduceOnly = this.getNodeParameter('reduceOnly', index) as boolean;
		const order = await binanceClient.futuresOrder({
			symbol,
			quantity,
			price,
			side: side as OrderSide_LT,
			type: 'LIMIT',
			timeInForce: 'GTC',
			reduceOnly: `${reduceOnly}`,
		});

		const results = [order];
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
				const tmpOrder = await binanceClient.futuresOrder({
					symbol,
					quantity: newQuantity,
					price,
					side: side as OrderSide_LT,
					type: 'LIMIT',
					timeInForce: 'GTC',
					reduceOnly: `${reduceOnly}`,
				});
				results.push(tmpOrder);
			}
		}
	}
	if (side === 'POSITION_CLOSE') {
		const position = await binanceClient.futuresPositionRisk({ symbol });
		const quantity = new BigNumber(
			position.filter((item) => item.symbol === symbol)[0].positionAmt,
		);
		if (quantity.eq(0)) {
			throw new Error('No position found');
		}
		const order = await binanceClient.futuresOrder({
			symbol,
			quantity: quantity.toString(),
			side: quantity.lt(0) ? 'SELL' : 'BUY',
			type: 'MARKET',
			reduceOnly: 'true',
		});

		return this.helpers.returnJsonArray(order as any);
	}

	if (action === 'CANCEL') {
		const orderId = this.getNodeParameter('orderId', index) as number;
		const order = await binanceClient.futuresCancelOrder({ symbol, orderId });

		return this.helpers.returnJsonArray(order as any);
	}

	if (action === 'UPDATE') {
		const quantity = this.getNodeParameter('quantity', index) as string;
		const price = this.getNodeParameter('price', index) as string;
		const orders = (await binanceClient.futuresOpenOrders({ symbol })).filter(
			(order) => order.type === 'LIMIT',
		);
		if (orders.length === 0) {
			throw new Error('No open orders found');
		}
		const orderId: any = orders[0].orderId;
		await binanceClient.futuresCancelOrder({ symbol, orderId });
		const newOrder = await binanceClient.futuresOrder({
			symbol,
			quantity,
			price,
			side: side as OrderSide_LT,
			type: 'LIMIT',
			timeInForce: 'GTC',
		});

		return this.helpers.returnJsonArray(newOrder as any);
	}

	if (action === 'CLEAR') {
		const order = await binanceClient.futuresCancelAllOpenOrders({ symbol });

		return this.helpers.returnJsonArray(order as any);
	}

	if (action === 'GET') {
		const orders = await binanceClient.futuresOpenOrders({ symbol });

		return this.helpers.returnJsonArray(orders as any);
	}

	const quantity = this.getNodeParameter('quantity', index) as string;
	const price = this.getNodeParameter('price', index) as string;
	const reduceOnly = this.getNodeParameter('reduceOnly', index) as boolean;

	const order = await binanceClient.futuresOrder({
		symbol,
		quantity,
		price,
		side: side as OrderSide_LT,
		type: 'LIMIT',
		timeInForce: 'GTC',
		reduceOnly: `${reduceOnly}`,
	});

	return this.helpers.returnJsonArray(order as any);
}
