/// <reference types="node" />
import { Readable } from "stream";
/**
 * Read a [Readable] to an iterator of [string] lines.
 * @param r The readable.
 * @return Iterator of lines.
 */
export declare function read(r: Readable): AsyncIterableIterator<string>;
//# sourceMappingURL=reader.d.ts.map