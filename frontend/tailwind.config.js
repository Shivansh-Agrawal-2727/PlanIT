import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(35, 150, 51)", // Green primary color
					secondary: "rgb(100, 100, 100)", // Secondary gray
					"base-100": "rgb(0,0,0)", // Light green background
				},
			},
		],
	},
};
