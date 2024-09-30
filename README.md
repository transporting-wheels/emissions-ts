# Emissions Calculator (TypeScript)

This is a TypeScript package designed to calculate the emissions for a fleet of trucks transporting various cars. The package includes an emissions calculator that works with different fuel types and supports multi-stop journeys.

## Purpose

The **Emissions Calculator** package calculates the Well-to-Wheel (WTW) emissions for transporting cars. The package considers factors like fuel type, journey distance, and the types of cars being transported. It is ideal for estimating transport-related emissions for logistics companies or environmental studies.

## Setup

### Prerequisites

Make sure you have Node.js and npm installed.

1. Clone the repository:

    ```bash
    git clone https://github.com/transporting-wheels/emissions-ts.git
    cd emissions-calculator
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. To run tests, use a testing framework like Jest:

    ```bash
    npm install jest ts-jest @types/jest --save-dev
    ```

4. Run the tests:

    ```bash
    npm test
    ```

## Example

Here is an example usage of the emissions calculator in TypeScript:

```typescript
import { Cars, EmissionsCalculator, Journey, Truck } from "emissions-ts";

const truck = new Truck({
	id: "T001",
	wttFactor: 0.5,
	ttwFactor: 0.8,
	wtwFactor: 1.3,
});

const journey = Journey.pointToPoint(
	"Hub LSP",
	"Unloading Point VW",
	new Set(["vw-golf", "vw-passat-tdi", "vw-passat-gte"]),
	40
);

const cars = [
	Cars.builder("vw-golf", [{ mass: 1800, height: 1600, length: 4200 }]),
	Cars.builder("vw-passat-tdi", [{ mass: 1980, height: 1500, length: 4500 }]),
	Cars.builder("vw-passat-gte", [{ mass: 2160, height: 1600, length: 4700 }]),
];

const emissions = new EmissionsCalculator().calculateEmissions(
	truck,
	journey,
	cars
);
console.log(emissions);
```
