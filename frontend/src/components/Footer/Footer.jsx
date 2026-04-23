import { assets } from "../../assets/assets.js";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaHome,
  FaUtensils,
  FaConciergeBell,
  FaInfoCircle,
  FaCommentDots,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-amber-200/70 bg-linear-to-b from-[#fff7ef] via-[#fffaf5] to-[#fffdfb] text-slate-700">
      <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_1fr]">
        
        <div className="flex flex-col items-start justify-start text-left lg:pl-0">
          <img
            src={assets.tomato}
            alt="Urban Foods"
            className="mb-4 h-30 w-30 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)]"
          />

          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
            Urban <span className="text-orange-500">Foods</span>
          </h1>

          <p className="max-w-sm text-base leading-7 text-slate-600">
            Delicious meals delivered fast to your doorstep. Fresh ingredients,
            great taste, and quality service every time.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[22px] text-slate-600 shadow-[0_6px_14px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:text-orange-500"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[22px] text-slate-600 shadow-[0_6px_14px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:text-orange-500"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[22px] text-slate-600 shadow-[0_6px_14px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:text-orange-500"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="relative mb-6 inline-block pb-3 text-2xl font-bold tracking-tight text-slate-900">
            Quick Links
            <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-orange-500"></span>
          </h3>

          <ul className="space-y-4 text-slate-600">
            <li>
              <a
                href="/"
                className="grid grid-cols-[18px_1fr] items-center gap-3 transition-colors hover:text-orange-500"
              >
                <FaHome className="text-orange-500" />
                <span>Home</span>
              </a>
            </li>

            <li>
              <a
                href="/menu"
                className="grid grid-cols-[18px_1fr] items-center gap-3 transition-colors hover:text-orange-500"
              >
                <FaUtensils className="text-orange-500" />
                <span>Menu</span>
              </a>
            </li>

            <li>
              <a
                href="/services"
                className="grid grid-cols-[18px_1fr] items-center gap-3 transition-colors hover:text-orange-500"
              >
                <FaConciergeBell className="text-orange-500" />
                <span>Our Services</span>
              </a>
            </li>

            <li>
              <a
                href="/about"
                className="grid grid-cols-[18px_1fr] items-center gap-3 transition-colors hover:text-orange-500">
                <FaInfoCircle className="text-orange-500" />
                <span>About</span>
              </a>
            </li>

            <li>
              <a
                href="/contact"
                className="grid grid-cols-[18px_1fr] items-center gap-3 transition-colors hover:text-orange-500"
              >
                <FaCommentDots className="text-orange-500" />
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="relative mb-6 inline-block pb-3 text-2xl font-bold tracking-tight text-slate-900">
            Contact
            <span className="absolute bottom-0 left-0 h-0.5 w-14 bg-orange-500"></span>
          </h3>

          <ul className="space-y-4 text-slate-600">
            <li className="grid grid-cols-[18px_1fr] items-center gap-3">
              <FaEnvelope className="text-orange-500" />
              <span>support@urbanfoods.com</span>
            </li>

            <li className="grid grid-cols-[18px_1fr] items-center gap-3">
              <FaPhoneAlt className="text-orange-500" />
              <span>+94 71 234 5678</span>
            </li>

            <li className="grid grid-cols-[18px_1fr] items-center gap-3">
              <FaMapMarkerAlt className="text-orange-500" />
              <span>Colombo, Sri Lanka</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="relative mb-6 inline-block pb-3 text-2xl font-bold tracking-tight text-slate-900">
            Subscribe
            <span className="absolute bottom-0 left-0 h-0.5 w-16 bg-orange-500"></span>
          </h3>

          <p className="mb-4 max-w-xs leading-8 text-slate-600">
            Get updates on new dishes and offers.
          </p>

          <div className="flex max-w-sm overflow-hidden rounded-xl border border-orange-200 bg-white">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button className="bg-orange-500 px-6 text-base font-semibold text-white transition hover:bg-orange-600">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative border-t border-amber-200/80 py-5 text-center text-lg font-bold text-slate-900">
        © 2026 Urban Foods. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
