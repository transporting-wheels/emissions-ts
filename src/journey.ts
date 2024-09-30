export class Stop {
	constructor(
		readonly location: string,
		readonly loadCars: Set<string> = new Set(),
		readonly unloadCars: Set<string> = new Set()
	) {}
}

export class Journey {
	private constructor(
		private readonly _stops: Stop[],
		private readonly _distances: number[],
		private readonly _returnTrip: boolean
	) {
		this.validateJourney();
	}

	get stops(): Stop[] {
		return [...this._stops];
	}

	get distances(): number[] {
		return [...this._distances];
	}

	get returnTrip(): boolean {
		return this._returnTrip;
	}

	private validateJourney(): void {
		if (this._stops.length < 2) {
			throw new Error("A journey must have at least 2 stops");
		}
		if (this._returnTrip && this._distances.length !== this._stops.length) {
			throw new Error(
				"For a return trip, number of distances must equal number of stops"
			);
		}
		if (
			!this._returnTrip &&
			this._distances.length !== this._stops.length - 1
		) {
			throw new Error(
				"For a one-way trip, number of distances must be equal to number of stops minus 1"
			);
		}

		const loadedCars = new Set<string>();
		const unloadedCars = new Set<string>();
		const carLocations = new Map<string, number[]>();

		this._stops.forEach((stop, i) => {
			const intersection = new Set(
				[...stop.loadCars].filter((x) => stop.unloadCars.has(x))
			);
			if (intersection.size > 0) {
				throw new Error(
					`Cars cannot be loaded and unloaded at the same stop: ${stop.location}`
				);
			}

			stop.loadCars.forEach((car) => {
				loadedCars.add(car);
				if (!carLocations.has(car)) {
					carLocations.set(car, []);
				}
				carLocations.get(car)!.push(i);
			});

			stop.unloadCars.forEach((car) => {
				unloadedCars.add(car);
				if (!carLocations.has(car)) {
					carLocations.set(car, []);
				}
				carLocations.get(car)!.push(i);
			});
		});

		if (
			loadedCars.size !== unloadedCars.size ||
			![...loadedCars].every((car) => unloadedCars.has(car))
		) {
			throw new Error("All loaded cars must be unloaded");
		}

		carLocations.forEach((locations, car) => {
			if (locations.length !== 2) {
				throw new Error(
					`Car ${car} must be loaded once and unloaded once`
				);
			}
			if (locations[0] >= locations[1]) {
				throw new Error(
					`Car ${car} must be loaded before it is unloaded`
				);
			}
		});
	}

	totalDistance(): number {
		return this._distances.reduce((sum, distance) => sum + distance, 0);
	}

	emptyTripFactor(): number {
		const totalDistance = this.totalDistance();
		let emptyDistance = 0;
		const carsOnBoard = new Set<string>();

		this._stops.forEach((stop, i) => {
			if (
				carsOnBoard.size === 0 &&
				stop.loadCars.size === 0 &&
				i < this._distances.length
			) {
				emptyDistance += this._distances[i];
			}
			stop.loadCars.forEach((car) => carsOnBoard.add(car));
			stop.unloadCars.forEach((car) => carsOnBoard.delete(car));
		});

		if (this._returnTrip && carsOnBoard.size === 0) {
			emptyDistance += this._distances[this._distances.length - 1];
		}

		return emptyDistance / totalDistance;
	}

	static pointToPoint(
		start: string,
		end: string,
		cars: Set<string>,
		distance: number,
		returnTrip: boolean = false
	): Journey {
		return new Journey(
			[new Stop(start, cars), new Stop(end, new Set(), cars)],
			returnTrip ? [distance, distance] : [distance],
			returnTrip
		);
	}

	static multiStop(
		stops: Stop[],
		distances: number[],
		returnTrip: boolean = false
	): Journey {
		return new Journey(stops, distances, returnTrip);
	}
}
