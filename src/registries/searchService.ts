// Shared search service for fetching package data

export interface SearchResult {
	name: string;
	description?: string;
}

export function getRegistry(): string {
	const headerContainer = document.getElementById('header-container');
	return headerContainer?.dataset.registry || 'npm';
}

export async function searchPackages(query: string): Promise<SearchResult[]> {
	const registry = getRegistry();

	const url = registry === 'npm'
		? `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`
		: `https://crates.io/api/v1/crates?q=${encodeURIComponent(query)}&per_page=10`;

	const res = await fetch(url);
	const data = await res.json();

	if (registry === 'npm') {
		return data.objects.map((o: any) => ({
			name: o.package.name,
			description: o.package.description
		}));
	} else {
		return data.crates.map((c: any) => ({
			name: c.name,
			description: c.description
		}));
	}
}

export async function fetchVersions(packageName: string): Promise<string[]> {
	const registry = getRegistry();

	const url = registry === 'npm'
		? `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
		: `https://crates.io/api/v1/crates/${encodeURIComponent(packageName)}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch versions');
	const data = await res.json();

	if (registry === 'npm') {
		return Object.keys(data.versions).reverse();
	} else {
		return data.versions.map((v: any) => v.num);
	}
}