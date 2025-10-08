import { lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies, useCookies } from 'react-cookie'; // Replace with your actual cookie handling library

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import { DASHBOARD_PATH } from 'config';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login3')));

// ==============================|| AUTH ROUTING ||============================== //
const AuthLoginWithRedirect = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'userId']);

    useEffect(() => {
        // Check if accessToken exists in cookies
        if (cookies.accessToken) {
            navigate(DASHBOARD_PATH);
        }
    }, [cookies]);

    return <AuthLogin />;
};
const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <MinimalLayout />
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <AuthLoginWithRedirect />
        },
        {
            path: '/login',
            element: <AuthLoginWithRedirect />
        },

    ]
};

// Inside the AuthLogin component or route component

export default LoginRoutes;
