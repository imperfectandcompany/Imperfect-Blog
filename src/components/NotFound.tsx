// src/components/NotFound.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";

export const NotFound: FunctionalComponent = () => {
  return (
    <div className="container mx-auto relative px-8 py-16 max-w-7xl md:px-12 lg:px-18 lg:py-22">
      <h1 className="text-3xl font-normal tracking-tighter text-zinc-300 sm:text-4xl lg:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="text-yellow-500 hover:underline mt-8 inline-block"
      >
        Go to Home
      </Link>
    </div>
  );
};
