import { useContext, useState, useEffect } from "preact/hooks";
import { Article, ContentContext } from "../contexts/ContentContext";
import { route } from "preact-router";
import { ComponentChild, VNode } from "preact";

interface BlogPost {
  ArticleID: number;
  Slug: string;
  Title: string;
  Description: string;
  CreatedAt: string;
  CategoryID: number;
}

interface Category {
  CategoryID: number;
  Title: string;
}

const Home = () => {
  const { articles, saveArticle, setArticles, categories } = useContext(ContentContext);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (articles.length === 0 || categories.length === 0) {
      fetchBlogPosts();
    } else {
      setLoading(false); // Set loading to false if articles and categories are already available
    }
  }, [articles, categories]);

  useEffect(() => {
    // Only fetch articles if the articles array is empty
    if (articles.length === 0) {
      fetchBlogPosts();
    } else {
      setLoading(false); // Set loading to false if articles are already available
    }
  }, [articles]); // Dependency array includes articles to ensure effect runs when articles change

  const fetchBlogPosts = async () => {
    setLoading(true); // Ensure loading state is true when starting to fetch
    try {
      const response = await fetch('https://api.imperfectgamers.org/blog/fetch/all/articles');
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.status === 'success' && Array.isArray(data.articles)) {
          data.articles.forEach((article: Article) => {
            saveArticle(article); // Save each fetched article to the context
          });
          // Assuming setArticles is a method provided by the context to update articles
          // This method should handle adding these articles to the context
          setArticles(data.articles);
        } else {
          console.error('Unexpected data structure:', data);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        console.log('Raw response:', text);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false); // Ensure loading state is false after fetching
    }
  };


  const navigateToBlogPost = (postSlug: string) => {
    route(`/post/${postSlug}`);
  };

  const handleClick = (postSlug: string) => {
    if (!fadeOut) {
      setFadeOut(true);
      setTimeout(() => {
        navigateToBlogPost(postSlug);
      }, 500);
    }
  };

  const getCategoryTitle = (categoryId: number): string => {
    const category = categories.find((cat: { CategoryID: number; }) => cat.CategoryID === categoryId);
    return category ? category.Title : 'Uncategorized';
  };

  return (
    <div className={`${fadeOut ? "fade-out" : "animate-fade-in"}  text-white`}>
      <div className="container mx-auto relative px-8 py-16 max-w-7xl md:px-12 lg:px-18 lg:py-22">
          <span className="text-xs font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-red-400 via-[#ffcc47] to-[#ff6347]">
          Imperfect Gamers Blog
        </span>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The Latest
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 animate-fade-in">
          {loading ? (
            Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="bg-zinc-950 rounded-lg p-6 shadow-lg">
                <div className="animate-pulse">
                <div className="h-4 bg-zinc-900 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((post: { ArticleID: any; Slug: string; CategoryID: number; Title: string | number | bigint | boolean | object | ComponentChild[] | VNode<any> | null | undefined; Description: string | number | bigint | boolean | object | ComponentChild[] | VNode<any> | null | undefined; CreatedAt: string | number | Date; }) => (
              <div
                key={post.ArticleID}
                className="bg-zinc-950 hover:bg-zinc-900 cursor-pointer select-none shadow-md hover:shadow-lg rounded-lg p-6 transition duration-200 ease-in-out transform hover:-translate-y-1"
                onClick={() => handleClick(post.Slug)}
              >
                <div className="text-xs uppercase text-transparent bg-clip-text bg-gradient-to-br from-[#ff6347] to-[#ffcc47] mb-2">{getCategoryTitle(post.CategoryID)}</div>
                <h3 className="text-xl font-bold text-white mb-2">{post.Title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{post.Description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{new Date(post.CreatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400">No articles found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;