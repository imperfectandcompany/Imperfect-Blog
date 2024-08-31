// src/components/Breadcrumb.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router";
import { generateSlug } from "../utils";
import { isFeatureEnabled } from "../featureFlags";
import { useContext } from "preact/compat";
import { Article, Category, ContentContext } from "../contexts/ContentContext";

interface BreadcrumbProps {
  path: string;
  categorySlug?: string;
  categoryId?: number;
  categoryTitle?: string;
  articleId?: number;
  articleTitle?: string;
  onBreadcrumbClick?: () => void;
  onBreadcrumbClickHome?: () => void;
}

const Breadcrumb: FunctionalComponent<BreadcrumbProps> = ({
  path,
  categorySlug,
  categoryId,
  categoryTitle,
  articleId,
  articleTitle,
  onBreadcrumbClick,
  onBreadcrumbClickHome,
}) => {
  let category: Category | undefined = undefined;
  let article: Article | undefined = undefined;
  const contentContext = useContext(ContentContext);

  if (categorySlug) {
    category = contentContext?.categories.find(
      (c: { Slug: string }) => generateSlug(c.Slug) === categorySlug
    );
  }

  if (articleId) {
    article = contentContext?.articles.find((a) => a.ArticleID === articleId);
  } else if (articleTitle) {
    article = contentContext?.articles.find(
      (a) => generateSlug(a.Title) === articleTitle
    );
  }

  if (categoryId) {
    category = contentContext?.categories.find(
      (a) => a.CategoryID === categoryId
    );
  } else if (categoryTitle) {
    category = contentContext?.categories.find(
      (a) => generateSlug(a.Title) === categoryTitle
    );
  }

  const breadcrumbItems = [];

  breadcrumbItems.push(
    <li key="home" className="inline">
      <Link
        href="/"
        className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-[#ffcc47] to-[#ff6347] hover:from-red-500 hover:via-[#ffdd57] hover:to-[#ff7457] transition"
        onClick={onBreadcrumbClickHome}
      >
        Home
      </Link>
    </li>
  );

  // Replace all instances of className with the gradient and hover effect
  const linkClassName = "text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-[#ffcc47] to-[#ff6347] hover:from-red-500 hover:via-[#ffdd57] hover:to-[#ff7457] transition";

  // Update the rest of the breadcrumb items
  const breadcrumbPaths = [
    { feature: "HomeSearch", pathStartsWith: "/search", label: "Search", href: "/search?query=" },
    { feature: "SupportSystem", pathStartsWith: "/support", label: "Support", href: "/support" },
    { feature: "AdminDashboard", pathIncludes: "/admin", label: "Admin", href: "/admin/dashboard" },
    { feature: "CreateArticle", pathEquals: "/admin/create-article", label: "Create Article", href: "/admin/create/article" },
    { pathEquals: "/admin/requests", label: "Requests", href: "/admin/requests" },
    { feature: "CreateCategory", pathEquals: "/admin/create-category", label: "Create Category", href: "/admin/create/category" },
    { pathEquals: "/admin/recycle-bin", label: "Recycle Bin", href: "/admin/recycle-bin" },
    { feature: "ViewAdminLogs", pathEquals: "/admin/logs", label: "Logs", href: "/admin/logs" },
    { feature: "EditCategory", pathIncludes: "/admin/edit/category", label: "Edit Category", href: `/admin/edit/category/${categoryId}` },
    { feature: "EditArticle", pathIncludes: "/edit/article", label: "Edit Article", href: `/admin/edit/article/${articleId}` },
    { feature: "CategoriesPage", pathEquals: "/categories", label: "Categories", href: "/categories" },
    { feature: "SpecificCategoryPage", pathEquals: `/category/${categorySlug}`, label: category?.Title, href: `/category/${categorySlug}` },
  ];

  type FeatureFlags = {
    HomeSearch: boolean;
    SupportSystem: boolean;
    AdminDashboard: boolean;
    CreateArticle: boolean;
    CreateCategory: boolean;
    ViewAdminLogs: boolean;
    EditCategory: boolean;
    EditArticle: boolean;
    CategoriesPage: boolean;
    SpecificCategoryPage: boolean;
  };

  breadcrumbPaths.forEach(({ feature, pathStartsWith, pathIncludes, pathEquals, label, href }) => {
    if (!feature || isFeatureEnabled(feature as keyof FeatureFlags)) {
      if (
        (pathStartsWith && path.startsWith(pathStartsWith)) ||
        (pathIncludes && path.includes(pathIncludes)) ||
        (pathEquals && path === pathEquals)
      ) {
        breadcrumbItems.push(
          <li key={label} className="inline">
            <span className="mx-2 text-gray-500">/</span>
            <Link
              href={href}
              className={linkClassName}
              onClick={onBreadcrumbClick}
            >
              {label}
            </Link>
          </li>
        );
      }
    }
  });

  if (article) {
    breadcrumbItems.push(
      <li key={`article-${article.ArticleID}`} className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link
          href={`/post/${article.Slug}`}
          className={linkClassName}
          onClick={onBreadcrumbClick}
        >
          {article.Title}
        </Link>
      </li>
    );
  } else if (articleTitle) {
    breadcrumbItems.push(
      <li key={`article-${articleTitle}`} className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link
          href={`/post/${generateSlug(articleTitle)}`}
          className={linkClassName}
          onClick={onBreadcrumbClick}
        >
          {articleTitle.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Link>
      </li>
    );
  }

  return (
    <div className="flex flex-col">
      <nav className="py-3 px-5 md:rounded-md my-4 opacity-80 z-10">
        <ul className="flex flex-wrap ml-2 md:ml-8 text-xs sm:text-sm md:text-md lg:text-lg text-gray-600">
          {breadcrumbItems}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;