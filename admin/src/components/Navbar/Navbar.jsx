import React from 'react';
import { Link } from 'react-router-dom';
import { assets, url } from '../../assets/assets';
import { ROLE_LABELS, normalizeRole } from '../../config/rbac';
import TrueFocus from './TrueFocus/TrueFocus';

const Navbar = ({ adminUser, onLogout, isDarkMode, onToggleDarkMode }) => {
  const normalizedRole = normalizeRole(adminUser?.role);
  const roleLabel = ROLE_LABELS[normalizedRole] || normalizedRole || 'Staff';
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
    <div className="flex items-center justify-between bg-white px-[4%] py-2 shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-colors dark:bg-zinc-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
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
          type="button"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg border border-zinc-300 bg-zinc-50 p-2 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <img
            src={isDarkMode ? assets.theme_sun : assets.theme_moon}
            alt={isDarkMode ? 'Light mode icon' : 'Dark mode icon'}
            className="h-5 w-5"
          />
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400">{roleLabel}</span>
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
