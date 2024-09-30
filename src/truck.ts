export class Truck {
	constructor(
		readonly id: string,
		readonly vehicleType: string,
		readonly fuelType: string,
		readonly wttFactor: number,
		readonly ttwFactor: number,
		readonly grossVehicleWeight: number,
		readonly payloadCapacity: number,
		readonly infoSource: string
	) {}

	get emptyWeight(): number {
		return this.grossVehicleWeight - this.payloadCapacity;
	}

	get wtwFactor(): number {
		return this.wttFactor + this.ttwFactor;
	}
}

export class Trucks {
	static lightDutyVanDiesel(id: string): Truck {
		return new Truck(
			id,
			"Light-duty van (<3.5t)",
			"Diesel",
			50,
			180,
			3.5,
			2,
			"DEFRA (2023), EEA (2022)"
		);
	}

	static mediumDutyTruckDiesel(id: string): Truck {
		return new Truck(
			id,
			"Medium-duty truck (7.5–16t)",
			"Diesel",
			25,
			85,
			16,
			8,
			"DEFRA (2023)"
		);
	}

	static heavyDutyTruckDiesel(id: string): Truck {
		return new Truck(
			id,
			"Heavy-duty truck (>16t)",
			"Diesel",
			15,
			75,
			18,
			10,
			"DEFRA (2023), EEA (2022)"
		);
	}

	static heavyDutyTruckLng(id: string): Truck {
		return new Truck(
			id,
			"Heavy-duty truck (>16t)",
			"LNG",
			35,
			45,
			18,
			10,
			"EcoTransIT World"
		);
	}

	static articulatedTruckDiesel(id: string): Truck {
		return new Truck(
			id,
			"Articulated truck (40t)",
			"Diesel",
			20,
			55,
			40,
			25,
			"DEFRA (2023), EcoTransIT World"
		);
	}

	static electricVan(id: string): Truck {
		return new Truck(
			id,
			"Light-duty van (<3.5t)",
			"Electric",
			80, // Assuming high grid emissions
			0,
			3.5,
			2,
			"DEFRA (2023), EEA (2022)"
		);
	}

	static electricHeavyTruck(id: string): Truck {
		return new Truck(
			id,
			"Heavy-duty truck (>16t)",
			"Electric",
			50, // Assuming moderate grid mix
			0,
			18,
			10,
			"DEFRA (2023), EEA (2022)"
		);
	}
}
