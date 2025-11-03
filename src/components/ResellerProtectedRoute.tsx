import { Navigate } from 'react-router-dom';
import { useResellerAuth } from '@/contexts/ResellerAuthContext';

interface ResellerProtectedRouteProps {
    children: React.ReactNode;
}

export const ResellerProtectedRoute: React.FC<ResellerProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useResellerAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/reseller/auth" replace />;
    }

    return <>{children}</>;
};