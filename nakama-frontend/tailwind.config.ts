import type { Config } from "tailwindcss";
import daisyui from 'daisyui'

export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		colors: {
			blue: "#1fb6ff",
			purple: "#7e5bef",
			pink: "#ff49db",
			orange: "#ff7849",
			green: "#13ce66",
			yellow: "#ffc82c",
			"gray-dark": "#273444",
			gray: "#8492a6",
			"gray-light": "#d3dce6",
		},
		fontFamily: {
			sans: ["Graphik", "sans-serif"],
			serif: ["Merriweather", "serif"],
			londrina: ["Londrina Solid", "serif"],
			opensans: ["Open Sans", "serif"],
			oswald: ["Oswald", "serif"]
		},
		extend: {},
	},
	plugins: [daisyui],
} satisfies Config;
