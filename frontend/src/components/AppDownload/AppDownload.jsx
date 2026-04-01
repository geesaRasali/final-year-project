import React from "react";

const DownloadApp = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fff8f3] via-[#fffaf7] to-[#ffe7d4] py-24">
      {/* background blur */}
      <div className="absolute left-[-80px] top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"></div>
      <div className="absolute right-[-60px] bottom-[-80px] h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"></div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Download the{" "}
          <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
            Urban Foods App
          </span>
        </h2>

        <p className="mt-6 text-lg text-slate-600">
          Order your favorite meals faster, track deliveries in real-time, and
          enjoy a smooth restaurant experience anytime.
        </p>

        {/* buttons */}
        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="rounded-2xl bg-black px-8 py-4 text-white shadow-lg transition hover:-translate-y-1"
          >
            App Store
          </a>

          <a
            href="#"
            className="rounded-2xl bg-black px-8 py-4 text-white shadow-lg transition hover:-translate-y-1"
          >
            Google Play
          </a>
        </div>

        {/* trust text */}
        <p className="mt-8 text-sm text-slate-500">
          Trusted by <span className="font-bold text-slate-900">10K+</span> food lovers
        </p>
      </div>
    </section>
  );
};

export default DownloadApp;