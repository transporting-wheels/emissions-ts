import { describe, test, expect } from "@jest/globals";
import {
	Cars,
	EmissionsCalculator,
	Journey,
	Stop,
	Truck,
	Trucks,
} from "../src";

describe("Emissions Calculator", () => {
	test("point to point heavy diesel", () => {
		const truck = Trucks.heavyDutyTruckDiesel("T001");

		const journey = Journey.pointToPoint(
			"Hub LSP",
			"Unloading Point VW",
			new Set(["vw-golf", "vw-passat-tdi", "vw-passat-gte"]),
			40
		);

		const cars = [
			new Cars("vw-golf", 1.8, 10, 3),
			new Cars("vw-passat-tdi", 1.98, 11, 2),
			new Cars("vw-passat-gte", 2.16, 12, 2),
		];

		const emissions = new EmissionsCalculator().calculateEmissions(
			truck,
			journey,
			cars
		);

		expect(Math.round(emissions.totalEmissionsWtw)).toBe(49);
	});

	test("multi stop car carrier bio fuel", () => {
		const truck = new Truck(
			"T001",
			"Car Carrier",
			"Diesel, B100 (100 % Bio-Diesel-share)",
			100,
			0,
			40,
			26,
			"DEFRA (2023), EEA (2022)"
		);

		const journey = Journey.multiStop(
			[
				new Stop("Hub LSP", new Set(["vw", "ford", "audi"]), new Set()),
				new Stop("Unloading Point VW", new Set(), new Set(["vw"])),
				new Stop("Unloading Point Ford", new Set(), new Set(["ford"])),
				new Stop("Unloading Point Audi", new Set(), new Set(["audi"])),
			],
			[50, 15, 30],
			false
		);

		const cars = [
			new Cars("vw", 1.8, 10, 2),
			new Cars("ford", 6.3, 35, 1),
			new Cars("audi", 2.34, 13, 2),
		];

		const emissions = new EmissionsCalculator().calculateEmissions(
			truck,
			journey,
			cars
		);

		expect(Math.round(emissions.totalEmissionsWtw)).toBe(103);
	});
});
