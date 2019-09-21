/**
 * Find the item by minimum of a function.
 * @param items The items to test.
 * @param f Test function.
 */
export function minBy<T>(items: T[], f: (item: T) => number): T | null {
    let result: T | null = null;
    let score = Number.MAX_VALUE;

    for (const item of items) {
        const s = f(item);
        if (s < score) {
            result = item;
            score = s;
        }
    }
    return result;
}

export function sortByNumber<T>(items: T[], f: (item: T) => number): T[] {
    return items.sort((a, b) => f(a) - f(b));
}


