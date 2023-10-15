export interface DataStartArea {
	id: string,
	calloutName: string,
	map: string,
	position: { x: number, y: number }[]
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
	id: string,
	calloutName: string,
	map: string,
	position: { x: number, y: number },
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