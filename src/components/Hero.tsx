import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-white border-b-2 border-border relative overflow-hidden">
      {/* Decorative background pattern (optional, keeping it clean for now) */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border-2 border-border bg-primary-soft text-primary font-bold text-sm tracking-wide uppercase">
            Free & Open Source
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 tracking-tight leading-tight">
            Convert documents <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="relative z-10">without the hassle.</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -z-10 -rotate-1"></span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto font-medium">
            Transform PDFs, documents, images and text into the formats you need.
            Fast, secure, and right in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
              Choose Files to Convert
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm font-semibold text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> PDF</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> DOCX</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> JPG</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> PNG</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> WEBP</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> TXT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
