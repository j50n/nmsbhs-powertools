import { galaxies } from "nmsbhs-utils";

export interface IArgUsername {
    username: string | undefined;
}

export interface IArgPlatform {
    readonly pc: boolean | undefined;
    readonly xbox: boolean | undefined;
    readonly ps4: boolean | undefined;
}

export function isPC(args: IArgPlatform): boolean {
    return !!args.pc || !!args.xbox;
}

export function isPS4(args: IArgPlatform): boolean {
    return !!args.ps4;
}

export function checkPlatformValid(args: IArgPlatform): void {
    if (!isPS4(args) && !isPC(args)) {
        throw new Error("one of --pc, --xbox, or --ps4 must be specified");
    } else if (isPS4(args) && isPC(args)) {
        throw new Error("only one of --pc, --xbox, or --ps4 may be specified");
    }
}

export function getPlatformName(args: IArgPlatform): string {
    checkPlatformValid(args);
    if (isPC(args)) {
        return "PC-XBox";
    } else if (isPS4(args)) {
        return "PS4";
    } else {
        throw new Error("invalid platform");
    }
}

export type Galaxy = string;

export interface IArgGalaxy {
    readonly galaxy: Galaxy;
}

export function parseGalaxy(value: string): Galaxy {
    const matches = galaxies.filter(g => g.toLowerCase().startsWith(value.toLowerCase()));
    if (matches.length === 0) {
        throw new Error(`galaxy not found: "${value}"`);
    } else if (matches.length >= 2) {
        throw new Error(`multiple galaxy matches found: "${matches.join('", "')}"`);
    } else {
        return matches[0];
    }
}
