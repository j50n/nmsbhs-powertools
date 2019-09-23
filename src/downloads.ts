import { IArgPlatform, IArgGalaxy, getPlatformName, IArgUsername } from "./options";
import axios from "axios";
import { toIterator, read } from "./reader";
import { Readable } from "stream";
import csv from "fast-csv";
import { Hop, System, coordinates, isValidHop, ISystem } from "nmsbhs-utils";
import { convertToHop } from "./conversions";

// https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=Bad%20Wolf&g=Calypso&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=Euclid&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getGPList
// https://us-central1-nms-bhs.cloudfunctions.net/getPOI

interface IHopRow {
    "bh-coords": string;
    "bh-region": string;
    "bh-system": string;
    "ex-coords": string;
    "ex-region": string;
    "ex-system": string;
}

interface IBaseRow {
    coords: string;
    name: string;
}

export async function data(args: IArgPlatform & IArgGalaxy): Promise<void> {
    const g = encodeURIComponent(args.galaxy);
    const p = encodeURIComponent(getPlatformName(args));
    const response = await axios.get(`https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=${g}&p=${p}`);

    const lines = (response.data as string)
        .split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => JSON.parse(line) as string[]);

    const csvLines = Readable.from(toIterator(lines)).pipe(
        csv.format({ headers: ["bh-coords", "bh-region", "bh-system", "ex-coords", "ex-region", "ex-system"] }),
    );

    for await (const line of read(csvLines)) {
        console.log(line);
    }
}

/**
 * Companion function to [data] that reads black-hole/exit data in from CSV and spits
 * out [Hop] instances.
 * @param reader The input reader.
 */
export async function* readData(reader: Readable): AsyncIterableIterator<Hop> {
    for await (const hopRow of reader.pipe(csv.parse({ headers: true }))) {
        const h = hopRow as IHopRow;
        const hop = new Hop(
            new System(h["bh-region"], h["bh-system"], coordinates(h["bh-coords"])),
            new System(h["ex-region"], h["ex-system"], coordinates(h["ex-coords"])),
        );
        if (isValidHop(hop)) {
            yield hop;
        }
    }
}

export async function* readBases(reader: Readable): AsyncIterableIterator<ISystem> {
    for await (const baseRow of reader.pipe(csv.parse({ headers: true }))) {
        const b = baseRow as IBaseRow;
        yield {
            label: b.name,
            coords: coordinates(b.coords),
        };
    }
}

export async function bases(args: IArgPlatform & IArgGalaxy & IArgUsername): Promise<void> {
    const g = encodeURIComponent(args.galaxy);
    const p = encodeURIComponent(getPlatformName(args));

    const response = await (async () => {
        if (args.username) {
            const u = encodeURIComponent(args.username);
            return await axios.get(`https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=${u}&g=${g}&p=${p}`);
        } else {
            return await axios.get(`https://us-central1-nms-bhs.cloudfunctions.net/getAllBases?g=${g}&p=${p}`);
        }
    })();

    for (const line of (response.data as string).split("\n").filter(line => line.trim().length > 0)) {
        console.log(line);
    }
}
