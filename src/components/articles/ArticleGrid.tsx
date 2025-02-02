import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

interface ArticleGridProps {
  articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Link 
          key={article.id} 
          to={`/articles/${article.id}`}
          className="group transition-transform duration-200 hover:scale-[1.02]"
        >
          <Card className="h-full overflow-hidden border-2 border-transparent hover:border-shop-accent1">
            {article.image_url && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image_url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              <p className="text-sm text-shop-500">
                {formatDistance(new Date(article.created_at), new Date(), { addSuffix: true })}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600 line-clamp-3">{article.content}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}