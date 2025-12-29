import type { CratesService } from "../domain/base.ts";
import type { SearchResult, PackageVersion } from "../../types.ts";

export class CratesRegistryService implements CratesService {
	async search(query: string): Promise<SearchResult[]> {
		const res = await fetch(
			`https://crates.io/api/v1/crates?q=${encodeURIComponent(query)}&per_page=10`
		);
		const data = await res.json();

		return data.crates.map((item: any) => ({
			name: item.name,
			version: item.max_version,
			description: item.description,
		}));
	}

	async getVersion(name: string, version: string): Promise<PackageVersion> {
		const res = await fetch(`https://crates.io/api/v1/crates/${encodeURIComponent(name)}/${version}`);
		const data = await res.json();
		return {
            name,
            version: data.version.num
        };
	}

	async getTarball(name: string, version: string): Promise<ArrayBuffer> {
        // Crates tarballs are at https://static.crates.io/crates/pkg/pkg-version.crate
		const url = `https://static.crates.io/crates/${name}/${name}-${version}.crate`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch tarball from ${url}`);
		return res.arrayBuffer();
	}
}

export const cratesService = new CratesRegistryService();
