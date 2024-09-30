// cars.ts
export type CarAttributes = {
	mass: number;
	height: number;
	length: number;
};

export class Cars {
	readonly id: string;
	readonly adjustedMass: number;
	readonly totalCeuRoad: number;
	readonly count: number;

	public constructor(
		id: string,
		adjustedMass: number,
		totalCeuRoad: number,
		count: number
	) {
		this.id = id;
		this.adjustedMass = adjustedMass;
		this.totalCeuRoad = totalCeuRoad;
		this.count = count;
	}

	static builder(id: string, carAttributes: CarAttributes[]): Cars {
		let totalCeuRoad = 0;

		for (const car of carAttributes) {
			const baseMass = 1400;
			const baseHeight = 1500;
			const baseLength = 4000;

			const extraMass = Math.max(0, car.mass - baseMass);
			const extraHeight = Math.max(0, car.height - baseHeight);
			const extraLength = Math.max(0, car.length - baseLength);

			let ceuRoad = 10;
			ceuRoad += extraMass / 250;
			ceuRoad += (extraLength / 500) * (extraHeight / 300);

			totalCeuRoad += Math.round(ceuRoad);
		}

		const adjustedMass = totalCeuRoad * 0.18;

		return new Cars(id, adjustedMass, totalCeuRoad, carAttributes.length);
	}
}
