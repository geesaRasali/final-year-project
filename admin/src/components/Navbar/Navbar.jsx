import React from 'react';
import {assets} from '../../assets/assets';

const Navbar = ({ adminUser, onLogout }) => {
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
          src={assets.profile_image}
          alt="Admin profile"
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
