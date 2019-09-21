import { IArgPlatform, IArgGalaxy, getPlatformName, IArgUsername } from "./options";
import axios from "axios";
import { toIterator, read } from "./reader";
import { Readable } from "stream";
import csv from "fast-csv";

// https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=Bad%20Wolf&g=Calypso&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=Euclid&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getGPList
// https://us-central1-nms-bhs.cloudfunctions.net/getPOI

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
