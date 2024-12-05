/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: {
  				DEFAULT: '#7C3AED', // Vibrant purple
  				foreground: '#FFFFFF',
  			},
  			secondary: {
  				DEFAULT: '#22D3EE', // Cyan
  				foreground: '#1E293B',
  			},
  			accent: {
  				DEFAULT: '#F471B5', // Pink
  				foreground: '#FFFFFF',
  			},
  			background: '#F8FAFC',
  			card: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#1E293B',
  			},
  		},
  		animation: {
  			'gradient-xy': 'gradient-xy 3s ease infinite',
  		},
  		keyframes: {
  			'gradient-xy': {
  				'0%, 100%': {
  					'background-size': '400% 400%',
  					'background-position': 'left center'
  				},
  				'50%': {
  					'background-size': '200% 200%',
  					'background-position': 'right center'
  				}
  			}
  		},
  		boxShadow: {
  			'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					color: 'inherit',
  					a: {
  						color: 'inherit',
  						textDecoration: 'none',
  						fontWeight: '500',
  					},
  					'[class~="lead"]': {
  						color: 'inherit',
  					},
  					strong: {
  						color: 'inherit',
  					},
  					'ul > li::before': {
  						backgroundColor: 'currentColor',
  					},
  					hr: {
  						borderColor: 'currentColor',
  						opacity: 0.3,
  					},
  					blockquote: {
  						color: 'inherit',
  						borderLeftColor: 'currentColor',
  					},
  					h1: {
  						color: 'inherit',
  					},
  					h2: {
  						color: 'inherit',
  					},
  					h3: {
  						color: 'inherit',
  					},
  					h4: {
  						color: 'inherit',
  					},
  					'figure figcaption': {
  						color: 'inherit',
  					},
  					code: {
  						color: 'inherit',
  					},
  					'a code': {
  						color: 'inherit',
  					},
  					pre: {
  						color: 'inherit',
  						backgroundColor: 'transparent',
  					},
  					thead: {
  						color: 'inherit',
  						borderBottomColor: 'currentColor',
  					},
  					'tbody tr': {
  						borderBottomColor: 'currentColor',
  						opacity: 0.3,
  					},
  				},
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}

