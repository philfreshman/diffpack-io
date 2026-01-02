import type { PackageVersion, SearchResult } from "../../types.ts";
import type { NPMService } from "../domain/base.ts";

export class NPMRegistryService implements NPMService {
	async search(query: string): Promise<SearchResult[]> {
		const res = await fetch(
			`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`,
		);
		const data = await res.json();

		interface NpmSearchItem {
			package: {
				name: string;
				version: string;
				description: string;
			};
		}

		return data.objects.map((item: NpmSearchItem) => ({
			name: item.package.name,
			version: item.package.version,
			description: item.package.description,
		}));
	}

	async getVersion(name: string, version: string): Promise<PackageVersion> {
		const res = await fetch(`https://registry.npmjs.org/${name}/${version}`);
		return res.json();
	}

	async getTarball(name: string, version: string): Promise<ArrayBuffer> {
		// npm tarballs are at https://registry.npmjs.org/pkg/-/pkg-version.tgz
		// For scoped packages: @scope/pkg -> https://registry.npmjs.org/@scope/pkg/-/pkg-version.tgz
		const unscopedName = name.includes("/") ? name.split("/")[1] : name;
		const url = `https://registry.npmjs.org/${name}/-/${unscopedName}-${version}.tgz`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch tarball from ${url}`);
		return res.arrayBuffer();
	}
}

export const npmService = new NPMRegistryService();
