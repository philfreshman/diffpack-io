export function applyTheme() {
	const localStorageTheme = localStorage.getItem("theme") || "system";
	const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
	const theme =
		localStorageTheme !== "system" ? localStorageTheme : systemTheme;

	document.documentElement.setAttribute("data-theme", theme);
	document.documentElement.setAttribute(
		"data-theme-selection",
		localStorageTheme,
	);
}

export function toggleTheme() {
	const themes = ["light", "dark", "system"];
	const currentTheme = localStorage.getItem("theme") || "system";
	const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
	localStorage.setItem("theme", nextTheme);
	applyTheme();
}

applyTheme();

// Handle View Transitions
document.addEventListener("astro:after-swap", applyTheme);

// Listen for system changes
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", (e) => {
		const localStorageTheme = localStorage.getItem("theme") || "system";
		if (localStorageTheme === "system") {
			document.documentElement.setAttribute(
				"data-theme",
				e.matches ? "dark" : "light",
			);
		}
	});
