// Shared search service for fetching package data

import type { SearchResult } from "./types.ts";

export function getRegistry(): string {
	const headerContainer = document.getElementById("header-container");
	return headerContainer?.dataset.registry || "npm";
}

export async function searchPackages(query: string): Promise<SearchResult[]> {
	const registry = getRegistry();

	const url =
		registry === "npm"
			? `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`
			: `https://crates.io/api/v1/crates?q=${encodeURIComponent(query)}&per_page=10`;

	const res = await fetch(url);
	const data = await res.json();

	if (registry === "npm") {
		interface NpmSearchObject {
			package: {
				name: string;
				description: string;
				version: string;
			};
		}
		return data.objects.map((o: NpmSearchObject) => ({
			name: o.package.name,
			description: o.package.description,
			version: o.package.version,
		}));
	} else {
		interface CrateSearchObject {
			name: string;
			description: string;
			max_version: string;
		}
		return data.crates.map((c: CrateSearchObject) => ({
			name: c.name,
			description: c.description,
			version: c.max_version,
		}));
	}
}

export async function fetchVersions(packageName: string): Promise<string[]> {
	const registry = getRegistry();

	const url =
		registry === "npm"
			? `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
			: `https://crates.io/api/v1/crates/${encodeURIComponent(packageName)}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch versions");
	const data = await res.json();

	if (registry === "npm") {
		return Object.keys(data.versions).reverse();
	} else {
		interface CrateVersion {
			num: string;
		}
		return data.versions.map((v: CrateVersion) => v.num);
	}
}
