import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#4A90E2', // Soft Blue
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#50C878', // Emerald Green
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#E74C3C', // Soft Red
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F7FA', // Light Gray
					foreground: '#666666' // Medium Gray
				},
				accent: {
					DEFAULT: '#E8F1FC', // Light version of primary
					foreground: '#4A90E2'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#333333' // Dark Gray
				},
				text: {
					primary: '#333333', // Dark Gray
					secondary: '#666666' // Medium Gray
				}
			},
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"scale-up": {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(1.1)" },
				},
				"shine": {
					"0%": {
						backgroundPosition: "200% 0",
					},
					"100%": {
						backgroundPosition: "-200% 0",
					},
				},
				"shimmer": {
					"100%": {
						transform: "translateX(100%)",
					},
				},
				"float": {
					"0%": {
						transform: "translateY(0px)",
					},
					"50%": {
						transform: "translateY(-5px)",
					},
					"100%": {
						transform: "translateY(0px)",
					},
				},
				"spin-slow": {
					"100%": {
						transform: "rotate(360deg)"
					}
				},
				"bounce-once": {
					"0%, 100%": { 
						transform: "translateY(0)"
					},
					"50%": {
						transform: "translateY(-25%)"
					}
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"scale-up": "scale-up 0.2s ease-out",
				"shine": "shine 3s ease-in-out infinite",
				"shimmer": "shimmer 2s infinite",
				"float": "float 3s ease-in-out infinite",
				"spin-slow": "spin-slow 3s linear infinite",
				"bounce-once": "bounce-once 0.5s ease-in-out",
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
