#!/usr/bin/env node

import { IArgGalaxy, IArgPlatform, parseGalaxy, checkPlatformValid, IArgUsername } from "./options";
import * as Downloads from "./downloads";

import program from "commander";

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
        console.log(`ERROR: ${e.message}`);
        process.exit(1);
    }
}
