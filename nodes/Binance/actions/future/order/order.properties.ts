import { IBinanceFutureProperties } from '../../../interface';

export const properties: IBinanceFutureProperties = [
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
		},
		options: [
			{ name: 'BUY', value: 'BUY' },
			{ name: 'CANCEL', value: 'CANCEL' },
			{ name: 'Clear Orders', value: 'CLEAR' },
			{ name: 'Open Orders', value: 'GET' },
			{ name: 'Position Close', value: 'POSITION_CLOSE' },
			{ name: 'SELL', value: 'SELL' },
			{ name: 'UPDATE', value: 'UPDATE' },
		],
		default: 'BUY',
	},
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['BUY', 'SELL', 'CLEAR', 'GET', 'UPDATE', 'POSITION_CLOSE'] },
		},
		default: 0,
	},
	{
		displayName: 'Symbol Name or ID',
		name: 'symbol',
		type: 'options',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
		},
		typeOptions: {
			loadOptionsMethod: 'getSymbols',
		},
		options: [],
		default: '',
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['CLEAR', 'GET', 'CANCEL', 'POSITION_CLOSE'] },
		},
		default: 0,
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['CLEAR', 'GET', 'CANCEL', 'POSITION_CLOSE'] },
		},
		default: 0,
	},
	{
		displayName: 'Reduce Only',
		name: 'reduceOnly',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['CLEAR', 'GET', 'CANCEL', 'POSITION_CLOSE'] },
		},
		default: false,
	},
];
