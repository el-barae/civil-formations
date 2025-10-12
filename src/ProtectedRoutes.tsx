import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

interface DecodedToken {
  id: string;
  role: string;
  exp?: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'ADMIN' }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem('token');

      // Vérifier si le token existe
      if (!token) {
        Swal.fire({
          title: 'Non connecté',
          text: 'Vous devez vous connecter pour accéder à cette page.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-confirm-custom'
          }
        });
        setIsAuthorized(false);
        return;
      }

      try {
        // Décoder le token
        const decoded = jwtDecode<DecodedToken>(token);
        const { role, exp } = decoded;

        // Vérifier si le token est expiré
        if (exp && exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          Swal.fire({
            title: 'Session expirée',
            text: 'Votre session a expiré. Veuillez vous reconnecter.',
            icon: 'warning',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'swal2-confirm-custom'
            }
          });
          setIsAuthorized(false);
          return;
        }

        // Vérifier le rôle
        if (role !== requiredRole) {
          Swal.fire({
            title: 'Accès refusé',
            text: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'swal2-confirm-custom'
            }
          });
          setIsAuthorized(false);
          return;
        }

        // Tout est OK
        setIsAuthorized(true);

      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        Swal.fire({
          title: 'Erreur',
          text: 'Token invalide. Veuillez vous reconnecter.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-confirm-custom'
          }
        });
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [requiredRole]);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default ProtectedRoute;