import React, { SVGProps } from 'react';

const MenuDashboard = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <mask id="a" width={48} height={48} x={0} y={0} maskUnits="userSpaceOnUse">
        <path fill="#D9D9D9" d="M0 0h48v48H0z" />
      </mask>
      <g mask="url(#a)">
        <path
          fill="#fff"
          d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21H5Zm0-2h6V5H5v14Zm8 0h6v-7h-6v7Zm0-9h6V5h-6v5Z"
        />
      </g>
    </svg>
  )
  export default MenuDashboard
  