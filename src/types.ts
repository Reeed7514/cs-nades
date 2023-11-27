export interface DataStartArea {
	_id: string,
	callout: string,
	map: string,
	coordinates: string
}

export interface ConfigStartArea {
	points: number[],
	fill: string,
	stroke: string,
	closed: boolean
}

export interface StartArea extends DataStartArea {
	config: ConfigStartArea
}

export interface DataLandSpot {
	_id: string,
	callout: string,
	map: string,
	coordinates: string,
	type: string
}

export interface ConfigLandSpot {
	x: number,
	y: number,
	radius: number,
	fill: string,
	stroke: string
}

export interface LandSpot extends DataLandSpot {
	config: ConfigLandSpot
}

export type CreateNadeState = 'pending' | 'success' | 'error'