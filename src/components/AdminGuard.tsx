import { Navigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAdminStore(s => s.isLoggedIn)

  /* rehydration sırasında flash'ı önlemek için boş değilse true, storage henüz
     rehydrate olmamışsa null yani false döndürür → giriş ekranına yönlendirilir */
  return isLoggedIn ? <>{children}</> : <Navigate to="/admin" replace />
}
