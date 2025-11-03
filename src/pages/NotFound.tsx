import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="text-center p-8 rounded-lg border shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-destructive">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary-hover underline font-medium">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
