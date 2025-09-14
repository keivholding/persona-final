type IconProps = { className?: string };

export const HomeIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.5" />
  </svg>
);

export const UserIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    <path strokeWidth="1.8" d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

export const SearchIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="11" cy="11" r="8" strokeWidth="1.8" />
    <path strokeWidth="1.8" d="M21 21l-4.35-4.35" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7-7-7 7-7" />
  </svg>
);

export const LayersIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path strokeWidth="1.8" d="m3 12 9 5 9-5" />
  </svg>
);

export const ShieldIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M12 3 5 6v6c0 4.97 3.58 7.79 7 9 3.42-1.21 7-4.03 7-9V6l-7-3Z" />
  </svg>
);

export const EyeIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
  </svg>
);

export const EyeSlashIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M3 3l18 18" />
    <path strokeWidth="1.8" d="M2 12s3.5-6 10-6c2.2 0 4.1.6 5.7 1.4M22 12s-3.5 6-10 6c-2.2 0-4.1-.6-5.7-1.4" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
  </svg>
);

export const BellIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
    <path strokeWidth="1.8" d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const CogIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
    <path strokeWidth="1.8" d="m19 12 2-1-1-3-2 1a7 7 0 0 0-2-1l-1-2h-4l-1 2a7 7 0 0 0-2 1L4 8l-1 3 2 1a7 7 0 0 0 0 2l-2 1 1 3 2-1a7 7 0 0 0 2 1l1 2h4l1-2a7 7 0 0 0 2-1l2 1 1-3-2-1a7 7 0 0 0 0-2Z" />
  </svg>
);

export const LogoutIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" d="M15 12H3" />
    <path strokeWidth="1.8" d="M7 8 3 12l4 4" />
    <path strokeWidth="1.8" d="M21 4h-8a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8" />
  </svg>
);

export const CardIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.8" />
    <path strokeWidth="1.8" d="M3 10h18" />
  </svg>
);

export const CheckIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
  </svg>
);

export const DotsIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);


