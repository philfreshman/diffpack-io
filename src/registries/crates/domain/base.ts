import type { PackageVersion, SearchResult } from "../../types.ts";

export interface CratesService {
	search(query: string): Promise<SearchResult[]>;
	getVersion(name: string, version: string): Promise<PackageVersion>;
	getTarball(name: string, version: string): Promise<ArrayBuffer>;
}
