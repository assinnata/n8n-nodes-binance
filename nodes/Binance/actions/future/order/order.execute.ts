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

	if (side === 'CANCEL') {
		const orderId = this.getNodeParameter('orderId', index) as number;
		const order = await binanceClient.futuresCancelOrder({ symbol, orderId });

		return this.helpers.returnJsonArray(order as any);
	}

	if (side === 'UPDATE') {
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

	if (side === 'CLEAR') {
		const order = await binanceClient.futuresCancelAllOpenOrders({ symbol });

		return this.helpers.returnJsonArray(order as any);
	}

	if (side === 'GET') {
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
