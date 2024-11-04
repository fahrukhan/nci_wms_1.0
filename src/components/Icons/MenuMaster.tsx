import React, { SVGProps } from 'react';

const MenuMaster = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <mask id="a" width={25} height={25} x={0} y={0} maskUnits="userSpaceOnUse">
      <path fill="#D9D9D9" d="M0 0h25v25H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#212529"
        d="M5.208 21.875a2.006 2.006 0 0 1-1.471-.612 2.006 2.006 0 0 1-.612-1.471V5.208c0-.573.204-1.063.612-1.471a2.006 2.006 0 0 1 1.471-.612h14.584c.573 0 1.063.204 1.471.612.408.408.612.898.612 1.471v14.584c0 .573-.204 1.063-.612 1.471a2.006 2.006 0 0 1-1.471.612H5.208Zm0-13.203h14.584V5.208H5.208v3.464Zm0 5.573h14.584v-3.49H5.208v3.49Zm0 5.547h14.584v-3.464H5.208v3.464ZM6.25 7.969V5.885h2.083V7.97H6.25Zm0 5.573v-2.084h2.083v2.084H6.25Zm0 5.573V17.03h2.083v2.084H6.25Z"
      />
    </g>
  </svg>
)
export default MenuMaster
