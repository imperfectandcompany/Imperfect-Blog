import { useContext, useState, useEffect } from "preact/hooks";
import { ContentContext } from "../contexts/ContentContext";
import { route } from "preact-router";

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
  const { categories } = useContext(ContentContext);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('https://api.imperfectgamers.org/blog/fetch/all/articles');
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.status === 'success' && Array.isArray(data.articles)) {
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
      setLoading(false);
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
            articles.map((post) => (
              <div
                key={post.ArticleID}
                className="bg-zinc-950 hover:bg-zinc-900 cursor-pointer shadow-md hover:shadow-lg rounded-lg p-6 transition duration-200 ease-in-out transform hover:-translate-y-1"
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