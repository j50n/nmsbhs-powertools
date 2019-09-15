import { Hop, HOP, System, coordinates, isValidHop, ISystem } from "nmsbhs-utils";

export async function* convertToBase(bases: AsyncIterableIterator<string>): AsyncIterableIterator<ISystem> {
    for await (const line of bases) {
        if (line.trim().length > 0 && !line.trim().startsWith("#")) {
            let base;
            try {
                base = JSON.parse(line);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    throw new SyntaxError(`${e.message} '${line}'`);
                } else {
                    throw e;
                }
            }
            if (!Array.isArray(base)) {
                throw new TypeError(`data is not an array: ${line}`);
            } else if (base.length === 2) {
                yield { coords: coordinates(base[0] as string), label: base[1] as string };
            } else if (base.length === 3) {
                yield { coords: coordinates(base[0] as string), label: `${base[2]}(${base[1]})` as string };
            } else {
                throw new RangeError(`data is the wrong length; got ${base.length}, expected 2 or 3`);
            }
        }
    }
}

export async function* convertToHop(hops: AsyncIterableIterator<string>): AsyncIterableIterator<Hop> {
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

    yield* convertHOPToHop(convertStringToHOP(hops));
}
