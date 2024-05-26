import { JSX } from 'solid-js/jsx-runtime';

export const AddImageIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#464646"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M16 1v14a5 5 0 0 1-10 0V7a4 4 0 0 1 8 0v8a3 3 0 0 1-6 0V9" />
  </svg>
);

