import { IArgData, IArgBases } from "./options";
import fs from "fs";
import * as Reader from "./reader";
import { inspect } from "util";
import { Coordinates, dijkstraCalculator, Route } from "nmsbhs-utils";
import * as Conv from "./conversions";
import * as Debug from "./debug";
import { start } from "repl";

// https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=Powehi&g=Euclid&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getBasesStart?u=Powehi&g=Euclid&p=PC-XBox&s=0000:1111:2222:3333
// https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=Calypso&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getGPList
// https://us-central1-nms-bhs.cloudfunctions.net/getPOI?g=Euclid&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getOrgs?g=Euclid&p=PC-XBox

export async function suggest(
    start: Coordinates,
    destinations: Coordinates[],
    args: IArgData & IArgBases & { numberToShow: number; jumpDistance: number },
): Promise<void> {
    if (!args.data) {
        throw new Error("--data <file> is not specified");
    }

    const hops = await Debug.time("Read Hops", () => {
        return Reader.toArray(Conv.convertToHop(Reader.read(fs.createReadStream(args.data!))));
    });

    console.error(`there are ${hops.length} hops`);

    let destSystems = destinations.map((coords, i) => {
        return { label: `START[${i + 1}]`, coords };
    });
    if (args.bases) {
        destSystems = destSystems.concat(await Reader.toArray(Conv.convertToBase(Reader.read(fs.createReadStream(args.bases!)))));
    }

    const startSystem = { label: `START`, coords: start };

    const routes = Debug.timeSync("Dijkstra", () => {
        const calc = dijkstraCalculator(hops, args.jumpDistance, "time");
        return calc.findRoutes(startSystem, destSystems);
    });

    for (const route of routes.sort((a, b) => a.score + a.route.length / 1000 - (b.score + b.route.length / 1000)).slice(0, args.numberToShow)) {
        console.log(`score: ${route.score}`);
        for (const leg of route.route) {
            console.log(`\t${leg.coords} ${leg.label}`);
        }
    }
}
