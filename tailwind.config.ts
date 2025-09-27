/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  theme: {
      screens: {
          xs: "540px",
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
      },
      container: {
          center: true,
          padding: {
              DEFAULT: '12px',
              sm: '1rem',
              lg: '45px',
              xl: '5rem',
              '2xl': '13rem',
          },
      },

      fontFamily: {
          'heading': ['"Poppins", sans-serif'],
          'body': ['"Inter", sans-serif'],
      },


      extend: {
          screens: {
              lg_992: '992px',
          },
          colors: {
              'dark': '#3c4858',
              'black': '#161c2d',
              'dark-footer': '#161c28',
              border: "hsl(var(--border))",
              input: "hsl(var(--input))",
              ring: "hsl(var(--ring))",
              background: "hsl(var(--background))",
              foreground: "hsl(var(--foreground))",
              primary: {
                DEFAULT: "#7C3AED",
                foreground: "#FFFFFF",
              },
              secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
              },
              destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
              },
              muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
              },
              accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
              },
              popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
              },
              card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
              },
          },

          boxShadow: {
              sm: '0 2px 4px 0 rgb(60 72 88 / 0.15)',
              DEFAULT: '0 0 3px rgb(60 72 88 / 0.15)',
              md: '0 5px 13px rgb(60 72 88 / 0.20)',
              lg: '0 10px 25px -3px rgb(60 72 88 / 0.15)',
              xl: '0 20px 25px -5px rgb(60 72 88 / 0.1), 0 8px 10px -6px rgb(60 72 88 / 0.1)',
              '2xl': '0 25px 50px -12px rgb(60 72 88 / 0.25)',
              inner: 'inset 0 2px 4px 0 rgb(60 72 88 / 0.05)',
              testi: '2px 2px 2px -1px rgb(60 72 88 / 0.15)',
          },

          fontSize: {
              base: ['16px', '24px'],
              menu: ['14px', '24px'],
          },

          spacing: {
              0.75: '0.1875rem',
              3.25: '0.8125rem'
          },

          height: ({
              theme
          }:{theme:any}) => ({
              '10.5': '2.625rem',
              '85': '21.25rem',
          }),
          width: ({
              theme
          }:{theme:any}) => ({
              '10.5': '2.625rem',
          }),

          maxWidth: ({
              theme,
              breakpoints
          }:{theme:any,breakpoints:any}) => ({
              '1200': '71.25rem',
              '992': '60rem',
              '768': '45rem',
          }),

          zIndex: {
              1: '1',
              2: '2',
              3: '3',
              999: '999',
          },
          borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
          },
          keyframes: {
            "accordion-down": {
              from: { height: 0 },
              to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
              from: { height: "var(--radix-accordion-content-height)" },
              to: { height: 0 },
            },
          },
          animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
          },
      },
  },

  plugins: [
      require("@tailwindcss/forms")({
        strategy: 'class', // only generate classes
      }),
      require("tailwindcss-animate")
  ],
}

