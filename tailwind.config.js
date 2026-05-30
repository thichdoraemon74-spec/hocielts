/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-blob-1': 'floatBlob1 24s infinite ease-in-out',
        'float-blob-2': 'floatBlob2 28s infinite ease-in-out',
        'float-blob-3': 'floatBlob3 20s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
