import React from 'react';
import { Link } from 'react-router-dom';
import { assets, url } from '../../assets/assets';
import { ROLE_LABELS, normalizeRole } from '../../config/rbac';
import TrueFocus from './TrueFocus/TrueFocus';

const Navbar = ({ adminUser, onLogout, isDarkMode, onToggleDarkMode }) => {
  const normalizedRole = normalizeRole(adminUser?.role);
  const roleLabel = ROLE_LABELS[normalizedRole] || normalizedRole || 'Staff';
  const displayName = (adminUser?.name || adminUser?.email || 'Staff').trim();
  const rawProfileImage = (adminUser?.profileImage || '').trim();
  const isAbsoluteProfileImage = rawProfileImage.startsWith('http://') || rawProfileImage.startsWith('https://');
  const isRelativeProfileImage = rawProfileImage.startsWith('/');
  const isImagesFolderPath = rawProfileImage.startsWith('images/');
  const isFileNameLike = rawProfileImage.includes('.') && !rawProfileImage.includes(' ');

  let resolvedProfileImage = '';
  if (rawProfileImage) {
    if (isAbsoluteProfileImage) {
      resolvedProfileImage = rawProfileImage;
    } else if (isRelativeProfileImage) {
      resolvedProfileImage = `${url}${rawProfileImage}`;
    } else if (isImagesFolderPath) {
      resolvedProfileImage = `${url}/${rawProfileImage}`;
    } else if (isFileNameLike) {
      resolvedProfileImage = `${url}/images/${rawProfileImage}`;
    }
  }

  const googleImageFromEmail = adminUser?.email
    ? `https://www.google.com/s2/photos/profile/${encodeURIComponent(adminUser.email)}?sz=120`
    : '';

  const fallbackImage = googleImageFromEmail || adminUser?.avatar || assets.profile_image;
  const displayImage = resolvedProfileImage || fallbackImage;

  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between bg-white px-[4%] shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-colors dark:bg-zinc-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
      <Link to='/' className='flex shrink-0 items-center'>
        <div className='navbar-logo'>
          <TrueFocus
            sentence='Urban Foods'
            manualMode={false}
            blurAmount={5}
            borderColor='#FDBA74'
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>
      </Link>
      <div className="flex items-center gap-3">
<button
  onClick={onToggleDarkMode}
  className={`
    relative w-16 h-8 flex items-center
    rounded-full p-1 transition-all duration-500 ease-in-out
    ${isDarkMode ? "bg-slate-800 ring-1 ring-slate-700" : "bg-orange-100 ring-1 ring-orange-200"}
  `}
>
  {/* චලනය වන සුදු රවුම */}
  <div
    className={`
      z-10 w-6 h-6 bg-white rounded-full shadow-lg
      flex items-center justify-center
      transition-all duration-500 ease-in-out
      ${isDarkMode ? "translate-x-8 rotate-[360deg]" : "translate-x-0 rotate-0"}
    `}
  >
    {isDarkMode ? (
      /* Moon Icon (SVG) */
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1e293b" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ) : (
      /* Sun Icon (SVG) */
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
      </svg>
    )}
  </div>

  {/* Background එකේ තියෙන ලස්සන පොඩි විස්තර */}
  <div className="absolute inset-0 flex justify-between items-center px-2">
    <span className="text-[10px] opacity-20 select-none">☀️</span>
    <span className="text-[10px] opacity-20 select-none">🌙</span>
  </div>
</button>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
          <img
            src={displayImage}
            alt={displayName}
            className="h-8 w-8 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="max-w-32 truncate text-xs font-bold text-zinc-700 dark:text-zinc-100">{displayName}</span>
            <span className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400">{roleLabel}</span>
          </div>
        </div>
  
        <button
          type="button"
          onClick={onLogout}
          className="cursor-pointer rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 font-bold text-orange-700 transition hover:bg-orange-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
