import { FunctionalComponent } from "preact";
import { Article } from "../contexts/ContentContext";
import { parseContent } from "./EditorModule/Content/contentParser";
import { renderContent } from "./EditorModule/Renderers";
import { useEffect, useRef, useState } from "preact/hooks";
import { useToast } from "../contexts/ToastContext";

interface DetailViewProps {
  item: Article;
  onBack: () => void;
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ArticleView: FunctionalComponent<DetailViewProps> = ({
  item,
  onBack,
}) => {
  const contentElements = parseContent(item.DetailedDescription);
  const { addToast } = useToast();

  const ShareButtons: FunctionalComponent<ShareButtonsProps> = ({
    url,
    title,
  }) => {
    const [showMore, setShowMore] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const canShare = navigator.share !== undefined;
    const isDesktop = window.innerWidth > 1024;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowMore(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setShowMore(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(url).then(() => {
        addToast("Link copied to clipboard!", "success");
      });
    };

    const nativeShare = () => {
      if (navigator.share) {
        navigator
          .share({
            title: title,
            url: url,
          })
          .catch(console.error);
      } else {
        alert("Native sharing is not supported on this device.");
      }
    };

    return (
      <div className="mt-4 !z-50 relative">
        <div className="flex space-x-4">
          <a
            href={`https://discord.com/channels/@me?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-indigo-300"
          >
            <i className="fab fa-discord"></i>
          </a>
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-envelope"></i>
          </a>
          <button
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-link"></i>
          </button>
          {canShare && (
            <button
              onClick={nativeShare}
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          )}
          {isDesktop && (
            <button
              onClick={() => window.print()}
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-print"></i>
            </button>
          )}
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
        {showMore && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 p-4 bg-zinc-900 rounded-lg shadow-lg z-10"
          >
            <div className="flex space-x-4 items-center">
              <a
                href={`https://steamcommunity.com/sharedfiles/edititem/767/3/?url=${encodedUrl}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-indigo-300"
              >
                <i className="fab fa-steam"></i>
              </a>
              <a
                href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-300"
              >
                <i className="fab fa-reddit-alien"></i>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-300"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <article className="container mx-auto px-4 py-8  text-white">
      <div className="max-w-6xl min-h-full mx-auto">

        <div className="flex flex-row mb-8 items-baseline justify-between">
                  <div className="flex justify-between items-center">
          <button
            className="group w-10 h-10 rounded-full border border-zinc-800 text-zinc-600 text-lg flex items-center justify-center transition duration-300 hover:bg-zinc-800 cursor-pointer"
            onClick={onBack}
          >
            <i className="fas fa-arrow-up transform -rotate-45 transition-transform duration-300 group-hover:-rotate-90"></i>
          </button>

        </div>
        <div>      <ShareButtons url={window.location.href} title={item.Title} /></div>
        </div>
<div className="mb-6 border-b !border-spacing-y-72 border-b-zinc-800 ">
<div className="flex flex-col justify-between  mb-6">
<div>
       <h1 className="text-4xl font-bold text-white">{item.Title}</h1>
</div>
<div className="text-gray-400">
          <span>{new Date(item.CreatedAt).toLocaleDateString()}</span>
        </div>
</div>

</div>

 
        {/* {item.ImgSrc && (
          <img src={item.ImgSrc} alt={item.Title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )} */}
        <div className="prose prose-lg prose-invert p-8 bg-stone-950/25 rounded-lg max-w-none text-gray-300">
          {renderContent(contentElements, true)}
        </div>
      </div>
    </article>
  );
};
