import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthComponent'

const ProtectedRoutes = () => {
    const { isAuth } = useAuth();
    return(
        isAuth ? <Outlet /> : <Navigate to='/login' />
    )
}

export default ProtectedRoutes