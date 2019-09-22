import { IArgData, IArgBases } from "./options";
import fs from "fs";
import * as Reader from "./reader";
import { inspect } from "util";
import { Coordinates, dijkstraCalculator, Route } from "nmsbhs-utils";
import * as Conv from "./conversions";
import * as Debug from "./debug";
import { start } from "repl";
import csv from "fast-csv";
import { Readable } from "stream";

async function blah(): Promise<void> {
    try {
        const r = Readable.from(fs.createReadStream("./data-euclid-ps4.csv").pipe(csv.parse({ headers: true })));
        for await (const a of r) {
            console.log(a);
        }
    } catch (e) {
        console.log(e);
    }
}

blah();
