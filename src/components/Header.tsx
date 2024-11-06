import React, { useEffect, useRef, useState } from "preact/compat"

type NavItem = {
	name: string;
	href: string;
	icon?: React.ReactNode;
  };
  
  type NavConfig = {
	items: NavItem[];
	activePage?: string;
  };
  
  const defaultConfig: NavConfig = {
	items: [
	  {
		name: "HOME",
		href: "https://imperfectgamers.org",
		icon: <i className="fa fa-home"></i>,
	  },
	  { name: "BLOG", href: "https://blog.imperfectgamers.org" },
	  { name: "STATS", href: "https://stats.imperfectgamers.org/stats" },
	  { name: "INFRACTIONS", href: "https://infractions.imperfectgamers.org" },
	  { name: "SUPPORT", href: "https://support.imperfectgamers.org" },
	  { name: "STORE", href: "https://store.imperfectgamers.org" },
	],
	activePage: "BLOG",
  };
  
  function validateConfig(config: NavConfig): NavConfig {
	const activeItems = config.items.filter(
	  (item) => item.name === config.activePage
	);
	if (activeItems.length > 1) {
	  throw new Error("Only one item can be set as active");
	}
	if (activeItems.length === 0 && config.activePage) {
	  throw new Error(`Active page "${config.activePage}" not found in items`);
	}
	return config;
  }
  const Header: React.FC<{ config?: NavConfig }> = ({ config = defaultConfig }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [redirecting, setRedirecting] = useState(false);
	const [countdown, setCountdown] = useState(3);
	const redirectTimeout = useRef<number | null>(null);
  
	let validatedConfig: NavConfig;
	try {
	  validatedConfig = validateConfig(config);
	} catch (error) {
	  console.error(error);
	  validatedConfig = defaultConfig;
	}
  
	const toggleMenu = () => {
	  setIsOpen(!isOpen);
	};
  
	const handleRedirect = (url: string) => {
	  if (!redirecting) {
		setRedirecting(true);
		setCountdown(3);
		redirectTimeout.current = window.setInterval(() => {
		  setCountdown((prevCount) => {
			if (prevCount <= 1) {
			  if (redirectTimeout.current !== null) {
				clearInterval(redirectTimeout.current);
			  }
			  window.location.href = url;
			  return 0;
			}
			return prevCount - 1;
		  });
		}, 1000);
	  }
	};
  
	const cancelRedirect = (
	  e: MouseEvent | KeyboardEvent
	) => {
	  e.stopPropagation();
	  if (redirectTimeout.current !== null) {
		clearInterval(redirectTimeout.current);
	  }
	  setRedirecting(false);
	  setIsOpen(false);
	};
  
	useEffect(() => {
	  const handleEscape = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
		  cancelRedirect(event);
		}
	  };
  
	  document.addEventListener("keydown", handleEscape);
  
	  return () => {
		document.removeEventListener("keydown", handleEscape);
		if (redirectTimeout.current !== null) {
		  clearInterval(redirectTimeout.current);
		}
	  };
	}, []);
  
	return (
	  <nav aria-label="Main Navigation" className="main-nav">
		<div
		  className={`menu-toggle md:hidden ${
			isOpen || redirecting ? "open" : ""
		  } ${redirecting ? "redirecting" : ""}`}
		  onClick={redirecting ? undefined : toggleMenu}
		  onKeyUp={(event) => {
			if (event.key === "Enter" && !redirecting) {
			  toggleMenu();
			}
		  }}
		  role="button"
		  tabIndex={0}
		  aria-expanded={isOpen}
		  aria-label="Toggle menu"
		>
		  {redirecting ? (
			<svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
		  ) : (
			<div className={`hamburger ${isOpen ? "open" : ""}`}>
			  <span></span>
			  <span></span>
			  <span></span>
			  <span></span>
			</div>
		  )}
		</div>
		<div
		  className={`mobile-separator md:hidden ${
			isOpen || !redirecting ? "" : "hidden"
		  }`}
		></div>
		{redirecting ? (
		  <div
			className="nav__list active redirecting"
			onClick={(e) => e.stopPropagation()}
			role="alert"
			aria-live="assertive"
		  >
			<div className="redirect-message flex w-full items-center justify-between">
			  <span>Redirecting in {countdown} seconds...</span>
			  <div className="px-4 py-1 md:visible">
				<button
				  className="cursor-pointer select-none text-white transition-colors duration-200 ease-in-out hover:text-zinc-300 focus:text-zinc-400"
				  onClick={cancelRedirect}
				  onKeyUp={(event) => {
					if (event.key === "Enter") {
					  cancelRedirect(event);
					}
				  }}
				  tabIndex={0}
				>
				  Cancel
				</button>
			  </div>
			</div>
		  </div>
		) : (
		  <ul
			className={`nav__list select-none ${isOpen ? "active" : ""}`}
			role="list"
		  >
			{validatedConfig.items.map((item, index) => (
			  <React.Fragment key={index}>
				<button
				  className={`list__item ${
					validatedConfig.activePage === item.name ? "active" : ""
				  }`}
				  onClick={() => item.href !== "#" && handleRedirect(item.href)}
				  onKeyUp={(event) => {
					if (event.key === "Enter" && item.href !== "#")
					  handleRedirect(item.href);
				  }}
				  tabIndex={validatedConfig.activePage === item.name ? -1 : 0}
				  disabled={validatedConfig.activePage === item.name}
				  aria-current={
					validatedConfig.activePage === item.name ? "page" : undefined
				  }
				>
				  {item.icon || item.name}
				</button>
			  </React.Fragment>
			))}
		  </ul>
		)}
	  </nav>
	);
  }

export default Header