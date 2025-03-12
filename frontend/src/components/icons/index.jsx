import React from 'react';

// Icon component that handles common props
const IconWrapper = ({ children, size = 24, color = 'currentColor', ...props }) => {
  return (
    <div className='icon-wrapper' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
    </div>
  );
};

// Example icons - you can add your own SVG paths here
export const HomeIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </IconWrapper>
);

// Back arrow icon - used for navigation
export const BackIcon = (props) => (
  <IconWrapper {...props}>
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M0.293 7.707C0.106 7.52 0 7.265 0 7C0 6.735 0.106 6.48 0.293 6.293L5.95 0.636C6.138 0.448 6.391 0.343 6.654 0.341C6.916 0.34 7.17 0.442 7.36 0.632C7.55 0.822 7.652 1.076 7.65 1.338C7.649 1.601 7.544 1.854 7.356 2.042L2.414 7L7.364 11.95C7.546 12.139 7.647 12.391 7.645 12.653C7.642 12.916 7.537 13.166 7.352 13.352C7.166 13.537 6.916 13.642 6.653 13.645C6.391 13.647 6.139 13.546 5.95 13.364L0.293 7.707Z"
      fill="currentColor"
      stroke="none"
    />
  </IconWrapper>
);

// Timer icon - used for displaying time-related information
export const TimerIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" />
    <path d="M3.965 1.136C3.28661 1.31769 2.668 1.67479 2.1714 2.1714C1.67479 2.668 1.31769 3.28661 1.136 3.965M16.035 1.136C16.7134 1.31769 17.332 1.67479 17.8286 2.1714C18.3252 2.668 18.6823 3.28661 18.864 3.965M10 6V9.75C10 9.888 10.112 10 10.25 10H13" strokeLinecap="round"/>
  </IconWrapper>
);

// Add more icons as needed... 