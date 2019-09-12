import { Readable } from "stream";

/**
 * Concat buffers and then split on line-feed. Compatible with utf-8 or ascii text.
 * @param bin Input buffers.
 * @return Output buffers, split on line-feed.
 */
async function* buffersSplitOnLineFeed(bin: AsyncIterableIterator<Buffer>): AsyncIterableIterator<Buffer> {
    function splitALine(b: Buffer): Buffer[] {
        const bs: Buffer[] = [];
        let p = 0;
        while (true) {
            const q = b.indexOf(0x0a, p);
            if (q === -1) {
                bs.push(b.slice(p));
                return bs;
            } else {
                bs.push(b.slice(p, q));
                p = q + 1;
            }
        }
    }

    let a: Buffer[] = [];
    for await (const b of bin) {
        const bs = splitALine(b);
        a.push(bs[0]);
        if (bs.length > 1) {
            yield Buffer.concat(a);
            for (let x = 1; x < bs.length - 1; x++) {
                yield bs[x];
            }
            a = [bs[bs.length - 1]];
        }
    }
    const f = Buffer.concat(a);
    if (f.length > 0) {
        yield f;
    }
}

/**
 * Read a [Readable] to an iterator of [string] lines.
 * @param r The readable.
 * @return Iterator of lines.
 */
export async function* read(r: Readable): AsyncIterableIterator<string> {
    async function* buffersToStrings(bin: AsyncIterableIterator<Buffer>): AsyncIterableIterator<string> {
        for await (const b of buffersSplitOnLineFeed(bin)) {
            if (b.length === 0) {
                yield "";
            } else if (b[b.length - 1] === 0x0d) {
                yield b.toString("utf-8", 0, b.length - 1);
            } else {
                yield b.toString("utf-8");
            }
        }
    }

    async function* convertReadableToBuffers(r: Readable): AsyncIterableIterator<Buffer> {
        for await (const b of r) {
            yield b;
        }
    }

    yield* buffersToStrings(convertReadableToBuffers(r));
}

export async function toArray<T>(items: AsyncIterableIterator<T>): Promise<T[]>{
    const results: T[] = [];
    for await(const item of items){
        results.push(item);
    }
    return results;
}
