const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const icons = {
  // --- Social ---
  instagram: (
    <svg {...s}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  ),
  tiktok: (
    <svg {...s}>
      <path d="M9 12a4 4 0 1 0 4-4" />
      <path d="M13 4v12" />
      <path d="M13 4c0 2.5 2 4 4 4" />
    </svg>
  ),
  facebook: (
    <svg {...s}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  ),
  youtube: (
    <svg {...s}>
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <path d="M10 9l5 3-5 3V9z" />
    </svg>
  ),
  twitter: (
    <svg {...s}>
      <path d="M4 4l6.5 8L4 20h2l5.25-6.4L15 20h5l-6.8-8.4L19.5 4h-2l-4.95 6L8.5 4H4z" />
    </svg>
  ),
  x: (
    <svg {...s}>
      <path d="M4 4l6.5 8L4 20h2l5.25-6.4L15 20h5l-6.8-8.4L19.5 4h-2l-4.95 6L8.5 4H4z" />
    </svg>
  ),
  pinterest: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 19c.3-1.8.8-3.5 1.5-5 .7-1.5 1-2.5 1-3.5a2 2 0 1 1 4 0c0 1.5-1 3-2 4" />
    </svg>
  ),
  linkedin: (
    <svg {...s}>
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5c0-1 1-2 2-2s2 1 2 2v5" />
    </svg>
  ),
  threads: (
    <svg {...s}>
      <path d="M12 22c-4.5 0-7-3-7-7.5V10c0-3.5 2.5-6 6-6 2 0 3.5.8 4.5 2" />
      <path d="M15.5 6c1 .8 2.5 2.5 2.5 5 0 3-1.5 5-4 5s-4-2-4-4.5c0-2 1.5-3.5 3.5-3.5s3 1.5 3 3.5c0 1.5-1 2.5-2 2.5s-1.5-.5-1.5-1.5" />
    </svg>
  ),
  snapchat: (
    <svg {...s}>
      <path d="M12 3c-2.5 0-4 2-4 4.5v2c-1 .2-2 .5-2 1.3 0 .6.5 1 1.2 1.2-.3 1-1 2-2.2 2.8 0 0 2 1.2 5 1.2s5-1.2 5-1.2c-1.2-.8-1.9-1.8-2.2-2.8.7-.2 1.2-.6 1.2-1.2 0-.8-1-.9-2-1.1v-2.2C16 5 14.5 3 12 3z" />
    </svg>
  ),
  telegram: (
    <svg {...s}>
      <path d="M21 3L1 11l7 2.5" />
      <path d="M8 13.5L19 5" />
      <path d="M8 13.5v5l3.5-3" />
      <path d="M11.5 15.5L19 21l2-18" />
    </svg>
  ),

  // --- Contact ---
  whatsapp: (
    <svg {...s}>
      <path d="M3 21l1.5-5.5A9 9 0 1 1 9.5 20L3 21z" />
      <path d="M9 10c.5-1 1-1.5 1.5-1.5s1 .5 1 1-.5 1.5-1 2c.5 1 1.5 2 2.5 2.5.5-.5 1.5-1 2-1s1 .5 1 1-.5 1.5-1.5 1.5C12 16 9 13 9 10z" />
    </svg>
  ),
  email: (
    <svg {...s}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  phone: (
    <svg {...s}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  sms: (
    <svg {...s}>
      <path d="M21 12a9 9 0 0 1-9 9c-2 0-3.8-.6-5.3-1.7L3 21l1.7-3.7A9 9 0 1 1 21 12z" />
    </svg>
  ),

  // --- General ---
  globe: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
    </svg>
  ),
  sparkles: (
    <svg {...s}>
      <path d="M12 3l1.5 5a2 2 0 0 0 1.5 1.5L20 12l-5 1.5a2 2 0 0 0-1.5 1.5L12 20l-1.5-5A2 2 0 0 0 9 13.5L4 12l5-1.5A2 2 0 0 0 10.5 9L12 3z" />
    </svg>
  ),
  catalog: (
    <svg {...s}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  link: (
    <svg {...s}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  ),
  shop: (
    <svg {...s}>
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M9 21V14h6v7" />
    </svg>
  ),
  heart: (
    <svg {...s}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  star: (
    <svg {...s}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
    </svg>
  ),
  map: (
    <svg {...s}>
      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  calendar: (
    <svg {...s}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  gift: (
    <svg {...s}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8c-1.5 0-4-1-4-3.5S9 2 10 2c1.5 0 2 1.5 2 3" />
      <path d="M12 8c1.5 0 4-1 4-3.5S15 2 14 2c-1.5 0-2 1.5-2 3" />
    </svg>
  ),
  camera: (
    <svg {...s}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  music: (
    <svg {...s}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  play: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  ),
  download: (
    <svg {...s}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  ),
  file: (
    <svg {...s}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  tag: (
    <svg {...s}>
      <path d="M20.6 11.4L12 20l-8.6-8.6A2 2 0 0 1 3 10V4a1 1 0 0 1 1-1h6a2 2 0 0 1 1.4.6l9.2 9.2a1 1 0 0 1 0 1.6z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  ),
  coffee: (
    <svg {...s}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3" />
      <path d="M10 1v3" />
      <path d="M14 1v3" />
    </svg>
  ),
  info: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  menu: (
    <svg {...s}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  cart: (
    <svg {...s}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  user: (
    <svg {...s}>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  clock: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};
