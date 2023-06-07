import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body {
  font-family: 'Inter', sans-serif;
  background-color: #151719;  /* equivalent to bg-gray-900 in Tailwind */
  color: #edf2f7;  /* equivalent to text-gray-200 in Tailwind */
  letter-spacing: -0.01em;  /* equivalent to tracking-tight in Tailwind */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

  .font-architects-daughter {
    font-family: 'Architects Daughter', cursive;
  }
`;
