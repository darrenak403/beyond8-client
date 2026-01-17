import {useAppSelector} from '@/lib/redux/hooks'
import {selectAuth, selectUser, selectIsAuthenticated} from '@/lib/redux/slices/authSlice'
import {Roles} from '@/lib/types/roles'

export function useAuth() {
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return {
    ...auth,
    user,
    isAuthenticated,
    role: user?.role,
    isAdmin: user?.role === Roles.Admin,
    isInstructor: user?.role === Roles.Instructor,
    isStudent: user?.role === Roles.Student,
  }
}
