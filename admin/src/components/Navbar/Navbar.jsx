import React from 'react';
import { assets, url } from '../../assets/assets';

const Navbar = ({ adminUser, onLogout }) => {
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
    <div className="flex items-center justify-between bg-white px-[4%] py-2 shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="Admin logo" />
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-bold uppercase text-zinc-500">Admin</span>
          <span className="text-sm font-bold text-zinc-900">{adminUser?.username || 'admin'}</span>
        </div>
        <img
          className="h-10 w-10 rounded-full bg-orange-500 object-cover"
          src={displayImage}
          alt="Admin profile"
          onError={(event) => {
            if (event.currentTarget.src !== fallbackImage) {
              event.currentTarget.src = fallbackImage;
              return;
            }
            event.currentTarget.src = assets.profile_image;
          }}
        />
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
