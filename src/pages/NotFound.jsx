import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white border border-gray-300 w-80 py-8 flex flex-col items-center mb-3">
        
        <p className='mb-4'>Burada görüntülenecek bir şey yok</p>
          <Link to="/" className="text-sm w-[90%] text-center bg-blue-500 text-white py-1 rounded font-medium">
            Anasayfaya dön
          </Link>
       
      </div>
    </div>
  );
}

export default NotFound;
