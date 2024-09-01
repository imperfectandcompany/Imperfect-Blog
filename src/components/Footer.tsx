// src/components/Footer.tsx

import { FunctionalComponent } from "preact";
import { content } from "../content";
import { Link } from "preact-router";
export const Footer: FunctionalComponent = () => {
  // Define the legal and imprint links separately
  const legalAndImprintLinks = [
    {
      href: "https://imperfectgamers.org/terms-of-service",
      label: "Terms of Service",
    },
    {
      href: "https://imperfectgamers.org/privacy-policy",
      label: "Privacy Policy",
    },
    { href: "/cookies", label: "Cookie Policy" },
  ];

  return (
    <footer className="relative items-baseline justify-center bottom-0 text-sm border-t border-black/5">
      <div className="container mx-auto px-4 z-40 mt-6">
      <svg
          className="absolute blur-3xl opacity-10 right-0 lowindex"
          width="50%"
          height="100%"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_17_60)">
            <g filter="url(#filter0_f_17_60)">
              <path
                d="M128.6 0H0V322.2L332.5 211.5L128.6 0Z"
                fill="#4D07E3"
              ></path>
              <path
                d="M0 322.2V400H240H320L332.5 211.5L0 322.2Z"
                fill="#4C00FF"
              ></path>
              <path
                d="M320 400H400V78.75L332.5 211.5L320 400Z"
                fill="#7fcef3"
              ></path>
              <path
                d="M400 0H128.6L332.5 211.5L400 78.75V0Z"
                fill="#7fcef3"
              ></path>
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_17_60"
              x="-159.933"
              y="-159.933"
              width="719.867"
              height="719.867"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="79.9667"
                result="effect1_foregroundBlur_17_60"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg>
        <div className="flex flex-wrap justify-between highindex">

          {/* Branding and description */}
          <div className="w-full md:w-3/4 bottom-0 items-end flex mb-6 md:mb-0 flex-row">
            <div>
              <Link
                href="https://imperfectgamers.org"
                className="flex items-center mb-4"
              >
                <img
                  src="https://cdn.imperfectgamers.org/inc/assets/svg/text.svg"
                  alt="Imperfect Gamers Logo"
                  className="mr-3  hover:opacity-100 opacity-20  grayscale hover:grayscale-0 transition-all duration-500 h-6"
                />
              </Link>
              <p className="text-zinc-500 text-xs">
                Dive into the world of gaming with our community.
              </p>
            </div>
          </div>


          {/* Navigation links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-base font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {content.footer.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-indigo-400 hover:animate-pulse transition text-xs duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Social media links */}
        </div>

        {/* Legal and imprint links */}
        <div className="mt-8 border-t border-zinc-900 pt-4">
          {/* Imprint */}
          <div className="my-4 text-center flex text-zinc-500 justify-center !z-30">
            <Link href={"https://imperfectandcompany.com"}>
              <img
                src="https://imperfectdesignsystem.com/assets/img/imperfectandcompany/imperfectandcompany_unfilled.png"
                className={
                  "flex transition hover:animate-pulse duration-500 invert opacity-10 hover:opacity-20 mx-auto h-16"
                }
              />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center space-x-4 highindex">
            {legalAndImprintLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-zinc-400 hover:text-zinc-300 hover:animate-pulse text-xs transition duration-200"
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-4 text-center text-zinc-500 !z-30 select-none">
          <p>
            &copy; {new Date().getFullYear()} Imperfect Gamers. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
