import type {PackageRegistry} from "./types.ts";
import {npmRegistry} from "./npm/application/npm.ts";
import {cratesRegistry} from "./crates/application/crates.ts";

const registries: Record<string, PackageRegistry> = {
	npm: npmRegistry,
	crates: cratesRegistry,
};

export { registries };
