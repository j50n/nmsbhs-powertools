export function timeSync<T>(label: string, f: () => T): T {
    const t0 = Date.now();
    let result = f();
    const t1 = Date.now();
    console.log(`[DEBUG] ${label}: ${t1 - t0} ms`);
    return result;
}

export async function time<T>(label: string, f: () => Promise<T>): Promise<T> {
    const t0 = Date.now();
    let result = await f();
    const t1 = Date.now();
    console.log(`[DEBUG] ${label}: ${t1 - t0} ms`);
    return result;
}
