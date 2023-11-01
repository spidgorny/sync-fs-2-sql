import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import { nextui } from "@nextui-org/react";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"node_modules/daisyui/dist/**/*.js",
		"node_modules/react-daisyui/dist/**/*.js",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	darkMode: "class",
	plugins: [daisyui, nextui()],
};
export default config;
