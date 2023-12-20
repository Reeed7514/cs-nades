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

export interface StartAreaExt extends StartArea {
	nadeCount: number
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

export interface LandSpotExt extends LandSpot{
	nadeCount: number
}

export interface Nade{
	map: string,
  nadeType: string,
  team: string,
  movement: string,
  throwType: string,
  spcmd: string,
  description: string,
  startAreaId: string,
  landSpotId: string,
  videoUrl: string,
	videoPublicId: string,
	lineupImagePublicId: string,
	resultImagePublicId: string,
  lineupImageUrl: string,
  resultImageUrl: string,
	createdAt: string,
	updatedAt: string
}

export type CreateNadeState = 'pending' | 'success' | 'error'