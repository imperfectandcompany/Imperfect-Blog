// src/components/Footer.tsx

import { FunctionalComponent } from "preact";
import { content } from "../content";


export const Footer: FunctionalComponent = () => {
  return (
    <footer className="text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Imperfect Gamers Blog</h3>
            <p className="text-gray-400">Bringing you the latest in gaming news, reviews, and community highlights.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-blue-400 transition duration-200">Home</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-blue-400 transition duration-200">Categories</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-blue-400 transition duration-200">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-blue-400 transition duration-200">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>&copy; 2024 Imperfect Gamers Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};