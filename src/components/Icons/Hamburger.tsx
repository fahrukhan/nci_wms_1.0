import React, { SVGProps } from 'react';

const Hamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    {...props}
  >
    <path stroke="#212529" d="M8 11h18M8 17h18M8 23h18" />
  </svg>
)
export default Hamburger

