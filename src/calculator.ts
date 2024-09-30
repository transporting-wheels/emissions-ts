import { Cars } from "./cars";
import { Journey } from "./journey";
import { Truck } from "./truck";

type EmissionResult = {
	totalEmissionsWtt: number;
	totalEmissionsTtw: number;
	totalEmissionsWtw: number;
	emissionsPerLeg: LegEmissions[];
	emissionsPerCar: { [carId: string]: CarEmissions };
};

type LegEmissions = {
	cars: string[];
	distance: number;
	legMass: number;
	utilizationRate: number;
	transportActivity: number;
	totalEmissionsWtt: number;
	totalEmissionsTtw: number;
	totalEmissionsWtw: number;
	assignment: { [carId: string]: CarAssignment };
};

type CarAssignment = {
	assignment: number;
	wttEmissions: number;
	ttwEmissions: number;
	wtwEmissions: number;
	wttEmissionsPerCar: number;
	ttwEmissionsPerCar: number;
	wtwEmissionsPerCar: number;
};

type CarEmissions = {
	wttEmissions: number;
	ttwEmissions: number;
	wtwEmissions: number;
};

export class EmissionsCalculator {
	calculateEmissions(
		truck: Truck,
		journey: Journey,
		cars: Cars[]
	): EmissionResult {
		const legs: LegEmissions[] = [];
		let carsOnBoard = new Set<string>();

		const calculateLeg = (
			distance: number,
			currentCarsOnBoard: Set<string>
		): LegEmissions => {
			const legMass = cars
				.filter((car) => currentCarsOnBoard.has(car.id))
				.reduce((sum, car) => sum + car.adjustedMass * car.count, 0);

			const legCeu = cars
				.filter((car) => currentCarsOnBoard.has(car.id))
				.reduce((sum, car) => sum + car.totalCeuRoad, 0);

			const transportActivity = (legMass * distance) / 1000; // Convert to kg

			const totalEmissionsWtt = truck.wttFactor * transportActivity;
			const totalEmissionsTtw = truck.ttwFactor * transportActivity;
			const totalEmissionsWtw = truck.wtwFactor * transportActivity;

			const carAssignment: { [carId: string]: CarAssignment } = {};
			cars.forEach((car) => {
				if (currentCarsOnBoard.has(car.id)) {
					const assignment = car.totalCeuRoad / legCeu;
					carAssignment[car.id] = {
						assignment,
						wttEmissions: assignment * totalEmissionsWtt,
						ttwEmissions: assignment * totalEmissionsTtw,
						wtwEmissions: assignment * totalEmissionsWtw,
						wttEmissionsPerCar:
							(assignment / car.count) * totalEmissionsWtt,
						ttwEmissionsPerCar:
							(assignment / car.count) * totalEmissionsTtw,
						wtwEmissionsPerCar:
							(assignment / car.count) * totalEmissionsWtw,
					};
				} else {
					carAssignment[car.id] = {
						assignment: 0,
						wttEmissions: 0,
						ttwEmissions: 0,
						wtwEmissions: 0,
						wttEmissionsPerCar: 0,
						ttwEmissionsPerCar: 0,
						wtwEmissionsPerCar: 0,
					};
				}
			});

			return {
				cars: Array.from(currentCarsOnBoard),
				distance,
				legMass,
				utilizationRate: legMass / truck.payloadCapacity,
				transportActivity,
				totalEmissionsWtt,
				totalEmissionsTtw,
				totalEmissionsWtw,
				assignment: carAssignment,
			};
		};

		// Forward journey
		for (let i = 0; i < journey.stops.length - 1; i++) {
			journey.stops[i].loadCars.forEach((car) => carsOnBoard.add(car));
			journey.stops[i].unloadCars.forEach((car) =>
				carsOnBoard.delete(car)
			);
			legs.push(calculateLeg(journey.distances[i], carsOnBoard));
		}

		// Return journey if specified
		if (journey.returnTrip) {
			carsOnBoard.clear(); // Empty the truck for the return trip
			legs.push(
				calculateLeg(
					journey.distances[journey.distances.length - 1],
					carsOnBoard
				)
			);
		}

		const totalEmissionsWtt = legs.reduce(
			(sum, leg) => sum + leg.totalEmissionsWtt,
			0
		);
		const totalEmissionsTtw = legs.reduce(
			(sum, leg) => sum + leg.totalEmissionsTtw,
			0
		);
		const totalEmissionsWtw = legs.reduce(
			(sum, leg) => sum + leg.totalEmissionsWtw,
			0
		);

		const emissionsPerCar: { [carId: string]: CarEmissions } = {};
		cars.forEach((car) => {
			emissionsPerCar[car.id] = {
				wttEmissions: legs.reduce(
					(sum, leg) => sum + leg.assignment[car.id].wttEmissions,
					0
				),
				ttwEmissions: legs.reduce(
					(sum, leg) => sum + leg.assignment[car.id].ttwEmissions,
					0
				),
				wtwEmissions: legs.reduce(
					(sum, leg) => sum + leg.assignment[car.id].wtwEmissions,
					0
				),
			};
		});

		return {
			totalEmissionsWtt,
			totalEmissionsTtw,
			totalEmissionsWtw,
			emissionsPerLeg: legs,
			emissionsPerCar,
		};
	}
}
