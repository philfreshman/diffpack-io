import { cratesRegistry } from "./crates/application/crates.ts";
import { npmRegistry } from "./npm/application/npm.ts";
import type { PackageRegistry } from "./types.ts";

const registries: Record<string, PackageRegistry> = {
	npm: npmRegistry,
	crates: cratesRegistry,
};

export { registries };
