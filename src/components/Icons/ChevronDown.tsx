import React, { SVGProps } from 'react';

const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={26}
    fill="none"
    {...props}
  >
    <path
      fill="#212529"
      d="m5 14.241 4.155-4.134a.787.787 0 0 1 1.11 0 .778.778 0 0 1 0 1.1l-4.71 4.686a.788.788 0 0 1-1.11 0l-4.71-4.686a.778.778 0 0 1 0-1.1.788.788 0 0 1 1.11 0L5 14.241Z"
    />
  </svg>
);
export default ChevronDown;
