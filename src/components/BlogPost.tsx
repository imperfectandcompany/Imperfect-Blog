import { useContext, useEffect, useState } from "preact/hooks";
import { ContentContext } from "../contexts/ContentContext";
import { ArticleView } from "./ArticleView";
import Breadcrumb from "./Breadcrumb";
import { Link, route } from "preact-router";
import ProgressBar from "../app";
import { updateMetaTags } from "../utils";

interface BlogPostProps {
  title?: string;  // Assuming this is the slug
  path: string;
  lastRoute: string;
  onBreadcrumbClick: () => void;
}

const BlogPost = ({ title, path, onBreadcrumbClick }: BlogPostProps) => {
  const { articles, content, categories, fetchArticleBySlugDirectly, error, currentArticle, setCurrentArticle, loading } = useContext(ContentContext);
  const [article, setArticle] = useState(currentArticle);
  const [category, setCategory] = useState(content?.categories.find(
    (c: { CategoryID: any; }) => c.CategoryID === article?.CategoryID
  ));
  const [fadeOut, setFadeOut] = useState(false);
  const [showLoading, setShowLoading] = useState(loading);
    const [articleNotFound, setArticleNotFound] = useState(false);


  useEffect(() => {
    if (title && !articleNotFound) { // Only proceed if the article has not been marked as not found
        if (currentArticle && currentArticle.Slug === title) {
                    // If the currentArticle is already the one we need, use it directly
        setArticle(currentArticle);
        const foundCategory = categories.find((c: { CategoryID: any; }) => c.CategoryID === currentArticle.CategoryID);
        setCategory(foundCategory);
        setShowLoading(false);
        }
      // First, try to find the article in the already loaded articles
      const foundArticle = articles.find((a: { Slug: string; }) => a.Slug === title);
      if (foundArticle) {
        setArticle(foundArticle);
        const foundCategory = categories.find((c: { CategoryID: any; }) => c.CategoryID === foundArticle.CategoryID);
        setCategory(foundCategory);
        setShowLoading(false);
      } else if (!currentArticle || currentArticle.Slug !== title) {
        // If not found in the loaded articles and not currently set, fetch it
        setShowLoading(true);
        fetchArticleBySlugDirectly(title).then((fetchedArticle: { CategoryID: any; }) => {
          if (fetchedArticle) {
            setArticle(fetchedArticle);
            const foundCategory = categories.find((c: { CategoryID: any; }) => c.CategoryID === fetchedArticle.CategoryID);
            setCategory(foundCategory);
          }
          if(error==="Article not found"){
            setArticleNotFound(true);
          }
          setShowLoading(false);

        }).catch(() => {
            // Handle errors such as network issues, or set article not found
            setShowLoading(false);
          });
      }
    }
  }, [title, articles, categories, currentArticle, fetchArticleBySlugDirectly]);

  // Updated function to handle different types of clicks
  const customHistoryStack: string[] = [];

  function handleBackAction() {
    const currentUrl = window.location.href;
    const articleUrlPattern = new RegExp(
      `^${window.location.origin}/post/${title}$`
    );
  
    // Update the custom history stack if it's not the same as the last entry
    if (!customHistoryStack.length || customHistoryStack[customHistoryStack.length - 1] !== currentUrl) {
      customHistoryStack.push(currentUrl);
    }
    if (!articleUrlPattern.test(currentUrl)) {
      history.back();
    } else {
      // Check the previous URL in the custom history stack
      const previousUrl = customHistoryStack[customHistoryStack.length - 2];
  
      if (previousUrl && previousUrl !== currentUrl) {
        // Remove the current URL from the stack
        customHistoryStack.pop();
        // Route to the previous URL in the stack
        route(previousUrl);
      } else {
        // If the previous URL is the same or undefined, redirect to a safe route
        route(`/`);
      }
    }
  }

// Inside your BlogPost component, after you have the article data:
useEffect(() => {
    if (article) {
        updateMetaTags({
          title: `${article.Title} - Blog | Imperfect Gamers`,
          description: article.Description || "Immerse in the latest updates, guides, and stories from Imperfect Gamers.",
          imageUrl: article.ImgSrc || "https://cdn.imperfectgamers.org/inc/assets/img/altlogo.png",
          url: window.location.href,
          keywords: article.Keywords || "Imperfect Gamers, CS:GO, surfing, gaming, community, blog"
        });
      }
    }, [article]);

// Custom history stack to track visited URLs

const handleClick = (clickType: "back" | "breadcrumb") => {
    // Add the current URL to the custom history stack if it's not the same as the last entry
    const currentUrl = window.location.href;
    if (!customHistoryStack.length || customHistoryStack[customHistoryStack.length - 1] !== currentUrl) {
      customHistoryStack.push(currentUrl);
    }
  
    if (!fadeOut) {
      setFadeOut(true);
      setTimeout(() => {
        if (clickType === "back") {
          handleBackAction();
        } else {
          onBreadcrumbClick();
        }
      }, 500); // Wait for the animation to complete
    }
  };

  return (
    <div className={`${fadeOut ? "fade-out" : "animate-fade-in"}`}>
      {showLoading || loading ? (
        <div className=" inset-0 !z-50 space-x-8 mx-auto minhalf text-center mr-0 flex items-center w-full justify-center text-3xl font-bold">
          <div className="flex flex-col mr-8 space-y-8">
            <div className="flex items-center mx-auto text-sm font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-red-400 via-[#ffcc47] to-[#ff6347] select-none bg">Loading Blog Post</div>
            <ProgressBar duration={250} color="yellow"/>
          </div>
        </div>
      ) : (!article && !category) ? (
        <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
          <h1 className="mt-8 text-4xl font-normal tracking-tighter text-zinc-100/90 sm:text-5xl">
            Article not available
          </h1>
          <p className="mt-2 text-gray-500">
            We're working hard to add more content. Please check back later!
          </p>
          <Link href="/">
          <button className="mt-2 px-6 py-2 bg-zinc-950 border  hover:bg-zinc-900 border-zinc-900 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20">
            Return to Home
          </button>
        </Link>
        </div>
      ) : (
        <div>
          <Breadcrumb
            path={path}
            categorySlug={category?.Slug}
            articleTitle={article.Title}
            articleId={article.ArticleID}
            onBreadcrumbClick={onBreadcrumbClick}
            onBreadcrumbClickHome={() => handleClick("breadcrumb")}
          />
<ArticleView item={article} onBack={() => handleClick("back")} />

</div>
      )}
    </div>
  );
};

export default BlogPost;