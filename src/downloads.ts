import { IArgPlatform, IArgGalaxy, getPlatformName, IArgUsername } from "./options";
import axios from "axios";

// https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=Bad%20Wolf&g=Calypso&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=Euclid&p=PC-XBox
// https://us-central1-nms-bhs.cloudfunctions.net/getGPList
// https://us-central1-nms-bhs.cloudfunctions.net/getPOI

export async function data(args: IArgPlatform & IArgGalaxy): Promise<void> {
    const g = encodeURIComponent(args.galaxy);
    const p = encodeURIComponent(getPlatformName(args));
    const response = await axios.get(`https://us-central1-nms-bhs.cloudfunctions.net/getDARC?g=${g}&p=${p}`);

    for (const line of (response.data as string).split("\n").filter(line => line.trim().length > 0)) {
        console.log(line);
    }
}

export async function bases(args: IArgPlatform & IArgGalaxy & IArgUsername): Promise<void> {
    if (!args.username) {
        throw new Error("missing argument --username");
    }

    const g = encodeURIComponent(args.galaxy);
    const p = encodeURIComponent(getPlatformName(args));
    const u = encodeURIComponent(args.username);
    const response = await axios.get(`https://us-central1-nms-bhs.cloudfunctions.net/getBases?u=${u}&g=${g}&p=${p}`);

    for (const line of (response.data as string).split("\n").filter(line => line.trim().length > 0)) {
        console.log(line);
    }
}