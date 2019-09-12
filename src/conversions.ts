import { Hop, HOP, System, coordinates, isValidHop } from "nmsbhs-utils";

async function* convertHOPToHop(hops: AsyncIterableIterator<HOP>): AsyncIterableIterator<Hop> {
    for await (const hop of hops) {
        const h = new Hop(new System(hop[1], hop[2], coordinates(hop[0])), new System(hop[4], hop[5], coordinates(hop[3])));
        if (isValidHop(h)) {
            yield h;
        }
    }
}

async function* convertStringToHOP(lines: AsyncIterableIterator<string>): AsyncIterableIterator<HOP> {
    for await (const line of lines) {
        if (line.trim().length > 0) {
            const h = JSON.parse(line);
            if (!Array.isArray(h)) {
                throw new TypeError(`hop data is not an array: ${line}`);
            } else if (h.length !== 6) {
                throw new RangeError(`hop data is the wrong length; got ${h.length}, expected 6`);
            } else {
                yield h as HOP;
            }
        }
    }
}

export async function* convertToHop(hops: AsyncIterableIterator<string>): AsyncIterableIterator<Hop> {
    yield* convertHOPToHop(convertStringToHOP(hops));
}
