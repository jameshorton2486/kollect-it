import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-shop-50">
      <div className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-6xl font-bold text-shop-800">404</h1>
        <p className="text-xl text-shop-600">
          Oops! We couldn't find that page
        </p>
        <Button asChild className="mt-4">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;