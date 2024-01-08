import { IBinanceFutureProperties } from '../../../interface';

export const properties: IBinanceFutureProperties = [
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
		},
		options: [
			{ name: 'CANCEL', value: 'CANCEL', action: 'Cancel a future' },
			{ name: 'Clear Orders', value: 'CLEAR', action: 'Clear orders a future' },
			{ name: 'List Orders', value: 'GET', action: 'List orders a future' },
			{ name: 'Place Orders', value: 'PUT', action: 'Place orders a future' },
			{ name: 'Place Smart Orders', value: 'SMART', action: 'Place smart orders a future' },
			{ name: 'Position Close', value: 'POSITION_CLOSE', action: 'Position close a future' },
			{ name: 'UPDATE', value: 'UPDATE', action: 'Update a future' },
		],
		default: 'CANCEL',
	},
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { action: ['CANCEL', 'CLEAR', 'GET', 'POSITION_CLOSE'] },
		},
		options: [
			{ name: 'BUY', value: 'BUY' },
			{ name: 'SELL', value: 'SELL' },
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
			hide: { action: ['CANCEL', 'CLEAR', 'GET', 'POSITION_CLOSE'] },
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
