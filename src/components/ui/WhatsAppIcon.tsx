import React from "react";

interface WhatsAppIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export default function WhatsAppIcon({
  className = "w-4 h-4 fill-current",
  size,
  ...props
}: WhatsAppIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 69 69"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M29 0h11v1h-11z M24 1h21v1h-21z M22 2h25v1h-25z M20 3h9v1h-9z M40 3h9v1h-9z M18 4h7v1h-7z M44 4h7v1h-7z M16 5h6v1h-6z M47 5h6v1h-6z M14 6h6v1h-6z M49 6h6v1h-6z M13 7h5v1h-5z M51 7h5v1h-5z M12 8h5v1h-5z M52 8h5v1h-5z M11 9h4v1h-4z M54 9h4v1h-4z M10 10h4v1h-4z M55 10h4v1h-4z M9 11h4v1h-4z M56 11h4v1h-4z M8 12h4v1h-4z M57 12h4v1h-4z M7 13h4v1h-4z M58 13h4v1h-4z M6 14h4v1h-4z M59 14h4v1h-4z M6 15h3v1h-3z M60 15h3v1h-3z M5 16h4v1h-4z M22 16h1v1h-1z M60 16h4v1h-4z M5 17h3v1h-3z M19 17h7v1h-7z M61 17h3v1h-3z M4 18h3v1h-3z M18 18h9v1h-9z M62 18h3v1h-3z M4 19h3v1h-3z M17 19h10v1h-10z M62 19h3v1h-3z M3 20h3v1h-3z M17 20h3v1h-3z M24 20h4v1h-4z M63 20h3v1h-3z M3 21h3v1h-3z M16 21h4v1h-4z M25 21h3v1h-3z M63 21h3v1h-3z M2 22h3v1h-3z M16 22h3v1h-3z M25 22h4v1h-4z M64 22h3v1h-3z M2 23h3v1h-3z M15 23h3v1h-3z M26 23h3v1h-3z M64 23h3v1h-3z M1 24h4v1h-4z M15 24h3v1h-3z M26 24h3v1h-3z M64 24h4v1h-4z M1 25h3v1h-3z M15 25h3v1h-3z M26 25h4v1h-4z M65 25h3v1h-3z M1 26h3v1h-3z M15 26h3v1h-3z M27 26h3v1h-3z M65 26h3v1h-3z M1 27h3v1h-3z M15 27h3v1h-3z M27 27h3v1h-3z M65 27h3v1h-3z M1 28h3v1h-3z M15 28h3v1h-3z M26 28h4v1h-4z M65 28h3v1h-3z M0 29h3v1h-3z M15 29h4v1h-4z M25 29h4v1h-4z M66 29h3v1h-3z M0 30h3v1h-3z M16 30h3v1h-3z M24 30h4v1h-4z M66 30h3v1h-3z M0 31h3v1h-3z M16 31h3v1h-3z M24 31h4v1h-4z M66 31h3v1h-3z M0 32h3v1h-3z M17 32h3v1h-3z M24 32h4v1h-4z M66 32h3v1h-3z M0 33h3v1h-3z M17 33h4v1h-4z M25 33h3v1h-3z M66 33h3v1h-3z M0 34h3v1h-3z M18 34h3v1h-3z M25 34h4v1h-4z M66 34h3v1h-3z M0 35h3v1h-3z M18 35h4v1h-4z M26 35h4v1h-4z M66 35h3v1h-3z M0 36h3v1h-3z M19 36h4v1h-4z M27 36h4v1h-4z M66 36h3v1h-3z M0 37h3v1h-3z M20 37h4v1h-4z M28 37h4v1h-4z M42 37h4v1h-4z M66 37h3v1h-3z M0 38h3v1h-3z M21 38h4v1h-4z M29 38h4v1h-4z M41 38h7v1h-7z M66 38h3v1h-3z M0 39h3v1h-3z M21 39h4v1h-4z M30 39h5v1h-5z M40 39h10v1h-10z M66 39h3v1h-3z M1 40h3v1h-3z M22 40h4v1h-4z M31 40h6v1h-6z M40 40h3v1h-3z M45 40h7v1h-7z M65 40h3v1h-3z M1 41h3v1h-3z M23 41h4v1h-4z M32 41h11v1h-11z M47 41h6v1h-6z M65 41h3v1h-3z M1 42h3v1h-3z M24 42h4v1h-4z M34 42h8v1h-8z M49 42h5v1h-5z M65 42h3v1h-3z M1 43h3v1h-3z M25 43h5v1h-5z M36 43h5v1h-5z M51 43h3v1h-3z M65 43h3v1h-3z M2 44h3v1h-3z M26 44h5v1h-5z M51 44h3v1h-3z M64 44h4v1h-4z M2 45h3v1h-3z M27 45h5v1h-5z M51 45h3v1h-3z M64 45h3v1h-3z M2 46h3v1h-3z M29 46h5v1h-5z M50 46h3v1h-3z M64 46h3v1h-3z M3 47h3v1h-3z M30 47h7v1h-7z M49 47h4v1h-4z M63 47h3v1h-3z M3 48h3v1h-3z M32 48h7v1h-7z M48 48h5v1h-5z M63 48h3v1h-3z M4 49h3v1h-3z M34 49h18v1h-18z M62 49h3v1h-3z M4 50h3v1h-3z M36 50h14v1h-14z M62 50h3v1h-3z M4 51h3v1h-3z M38 51h11v1h-11z M61 51h3v1h-3z M4 52h3v1h-3z M60 52h4v1h-4z M4 53h3v1h-3z M60 53h3v1h-3z M4 54h3v1h-3z M59 54h4v1h-4z M3 55h3v1h-3z M58 55h4v1h-4z M3 56h3v1h-3z M57 56h4v1h-4z M3 57h3v1h-3z M56 57h4v1h-4z M2 58h4v1h-4z M55 58h4v1h-4z M2 59h3v1h-3z M54 59h4v1h-4z M2 60h3v1h-3z M52 60h5v1h-5z M2 61h3v1h-3z M51 61h5v1h-5z M1 62h3v1h-3z M15 62h5v1h-5z M49 62h6v1h-6z M1 63h3v1h-3z M12 63h10v1h-10z M47 63h6v1h-6z M1 64h3v1h-3z M7 64h18v1h-18z M44 64h7v1h-7z M1 65h15v1h-15z M20 65h9v1h-9z M40 65h9v1h-9z M0 66h12v1h-12z M22 66h25v1h-25z M0 67h8v1h-8z M25 67h20v1h-20z M1 68h2v1h-2z M29 68h11v1h-11z" />
    </svg>
  );
}
