/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            scale: {
                '102':'1.02'
            },
            margin: {
                '5rem':'1rem'
            }
        },
    },
    variants: {
        extend: {
            opacity: ['disabled']
        }
    },
    plugins: [],
}

// THE BELOW CODE IS NOT USED BECAUSE OF BG WHITENING ISSUE
// /** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/react/utils/withMT");
// module.exports = withMT({
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       scale: {
//         102: "1.02",
//       },
//       margin: {
//         "5rem": "1rem",
//       },
//     },
//   },
//   variants: {
//     extend: {
//       opacity: ["disabled"],
//     },
//   },
//   plugins: [require("@tailwindcss/aspect-ratio")],
// });