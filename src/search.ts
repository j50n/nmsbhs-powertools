import { IArgData, IArgBases } from "./options";
import fs from "fs";
import * as Reader from "./reader";
import { inspect } from "util";
import { Coordinates, dijkstraCalculator, Route } from "nmsbhs-utils";
import * as Conv from "./conversions";
import * as Debug from "./debug";
import { start } from "repl";

export async function search(destination: Coordinates, starts: Coordinates[], args: IArgData & IArgBases): Promise<void> {
    if (!args.data) {
        throw new Error("--data <file> is not specified");
    }

    const hops = await Debug.time("Read Hops", () => {
        return Reader.toArray(Conv.convertToHop(Reader.read(fs.createReadStream(args.data!))));
    });

    console.error(`there are ${hops.length} hops`);

    let startSystems = starts.map((coords, i) => {
        return { label: `START[${i + 1}]`, coords };
    });
    if (args.bases) {
        startSystems = startSystems.concat(await Reader.toArray(Conv.convertToBase(Reader.read(fs.createReadStream(args.bases!)))));
    }

    const destSystem = { label: `DEST`, coords: destination };

    Debug.timeSync("Dijkstra", () => {
        const calc = dijkstraCalculator(hops, 2000, "time");
        calc.findRoute(startSystems, destSystem).forEach((rt: Route) => {
            console.log(`score: ${rt.score}`);
            for (const leg of rt.route) {
                console.log(`\t${leg.label}@${leg.coords.toString()}`);
            }
        });
    });
}
