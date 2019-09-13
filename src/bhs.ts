#! /usr/bin/env node

import { IArgGalaxy, IArgPlatform, parseGalaxy, IArgData, IArgBases, IArgUsername } from "./options";
import * as Downloads from "./downloads";
import * as Search from "./search";
import { inspect } from "util";

import program from "commander";
import { coordinates } from "nmsbhs-utils";

program.description("Power-tools for travelers in No Man's Sky.").version("0.0.0");

program
    .command("data")
    .option("-g|--galaxy <galaxy>", "galaxy name", parseGalaxy, "Euclid")
    .option("-s|--ps4", "platform is PS4")
    .option("-p|--pc", "platform is PC")
    .option("-x|--xbox", "platform is XBox")
    .action(async (args: IArgPlatform & IArgGalaxy) => {
        await errorTrap(async () => await Downloads.data(args));
    });

program
    .command("bases")
    .option("-g|--galaxy <galaxy>", "galaxy name", parseGalaxy, "Euclid")
    .option("-s|--ps4", "platform is PS4")
    .option("-p|--pc", "platform is PC")
    .option("-x|--xbox", "platform is XBox")
    .option("-u|--username <username>", "user name")
    .action(async (args: IArgPlatform & IArgGalaxy & IArgUsername) => {
        await errorTrap(async () => await Downloads.bases(args));
    });

program
    .command("search <destination> [start...]")
    .description("search for the best route to a destination")
    .option("-d|--data <file>", "black-hole/exit data")
    .option("-b|--bases <file>", "bases to use as alternate start locations")
    .action(async (destination, starts, args: IArgData & IArgBases) => {
        await errorTrap(async () => await Search.search(coordinates(destination), starts.map(coordinates), args));
    });

/* check command */
program.on("command:*", () => {
    console.error(`invalid command: ${program.args.join(" ")}`);
    program.help();
});

try {
    program.parse(process.argv);
} catch (e) {
    console.error(e.message);
    process.exit(1);
}

/* check for no command */
if (!program.args.length) {
    console.error("empty arguments");
    program.help();
}

/**
 * Wrap command functions to prevent them from crashing out on error.
 * @param f The wrapped function.
 */
async function errorTrap(f: () => Promise<void>): Promise<void> {
    try {
        await f();
    } catch (e) {
        console.log(`ERROR: ${inspect(e)}`);
        process.exit(1);
    }
}
