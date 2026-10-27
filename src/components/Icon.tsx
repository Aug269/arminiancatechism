import type { SVGProps } from 'react';

export type IconName =
  | 'cross'
  | 'sun'
  | 'moon'
  | 'book'
  | 'calendar'
  | 'clock'
  | 'chevron-left'
  | 'chevron-right'
  | 'download'
  | 'plus'
  | 'minus'
  | 'bell'
  | 'play'
  | 'pause'
  | 'reset'
  | 'close'
  | 'library'
  | 'home'
  | 'search';

const PATHS: Record<IconName, JSX.Element> = {
  cross: (
    <path
      d="M10 3h4v5h5v4h-5v9h-4v-9H5V8h5V3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  ),
  moon: (
    <path
      d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  book: (
    <>
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M19 18v3H6.5A2.5 2.5 0 0 1 4 18.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.4V12l3.2 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  'chevron-left': <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-right': <path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  download: (
    <path
      d="M12 3.5v10m0 0 3.6-3.6M12 13.5 8.4 9.9M4.5 16.5v2.2a1.8 1.8 0 0 0 1.8 1.8h11.4a1.8 1.8 0 0 0 1.8-1.8v-2.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  minus: <path d="M5.5 12h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  bell: (
    <>
      <path
        d="M6.5 10a5.5 5.5 0 0 1 11 0c0 3.2.8 4.6 1.6 5.5H4.9c.8-.9 1.6-2.3 1.6-5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10 18.4a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  play: <path d="M8 5.2 18 12 8 18.8V5.2Z" fill="currentColor" />,
  pause: <path d="M8 5.5h3v13H8zm5 0h3v13h-3z" fill="currentColor" />,
  reset: (
    <path
      d="M4.8 8.2A8 8 0 1 1 4 12M4.8 8.2V4m0 4.2H9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  library: (
    <>
      <path d="M4 4.5h4.6v15H4zM9.6 4.5H14v15H9.6z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M15.4 5.2 19 4.2l2.4 14.4-3.6 1z" fill="none" stroke="currentColor" strokeWidth="1.3" transform="translate(-1 0)" />
    </>
  ),
  home: (
    <path
      d="M4.5 10.5 12 4l7.5 6.5V20a.8.8 0 0 1-.8.8h-4.3v-6h-4.8v6H5.3a.8.8 0 0 1-.8-.8v-9.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.6 15.6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
