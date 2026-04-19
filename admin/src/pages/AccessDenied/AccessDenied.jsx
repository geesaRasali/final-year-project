import React from 'react';

const AccessDenied = () => {
  return (
    <div className='w-full p-6'>
      <div className='mx-auto mt-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center'>
        <h2 className='text-2xl font-bold text-red-700'>Access Denied</h2>
        <p className='mt-2 text-red-600'>Your role does not have permission to open this page.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
