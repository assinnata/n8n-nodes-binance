import { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

type IBinanceMap = {
	spot: 'exchange' | 'account' | 'candle' | 'order' | 'smartorder';
	future:
		| 'exchange'
		| 'account'
		| 'candle'
		| 'order'
		| 'smartorder'
		| 'leverage'
		| 'position'
		| 'statistics';
	margin: 'exchange' | 'account' | 'candle' | 'order';
};

export type IBinance = AllEntities<IBinanceMap>;

export type IBinanceSpot = Entity<IBinanceMap, 'spot'>;
export type IBinanceFuture = Entity<IBinanceMap, 'future'>;
export type IBinanceMargin = Entity<IBinanceMap, 'margin'>;

export type IBinanceSpotProperties = PropertiesOf<IBinanceSpot>;
export type IBinanceFutureProperties = PropertiesOf<IBinanceFuture>;
export type IBinanceMarginProperties = PropertiesOf<IBinanceMargin>;
