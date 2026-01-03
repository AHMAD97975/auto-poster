import React from 'react';

export const Footer: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/ahmad_el_mohammad?igsh=a21pdXRnbWF5eTMy&utm_source=qr";
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Rights Section */}
          <div className="text-center md:text-right">
             <p className="text-gray-800 font-bold text-lg mb-1">
               تم تصميم وتطوير هذا الموقع من قبل <span className="text-indigo-600">أحمد المحمد</span>
             </p>
             <p className="text-gray-500 text-sm">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          </div>

          {/* Social & QR Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex flex-col items-center sm:items-end gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">تواصل معي</span>
                <a 
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.664-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span>@Ahmad_El_Mohammad</span>
                </a>
             </div>
             
             <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-inner">
                {/* Dynamically generated QR Code for the specific URL to ensure it works cleanly */}
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(instagramUrl)}`}
                    alt="Scan for Instagram"
                    className="w-20 h-20 object-contain"
                />
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};