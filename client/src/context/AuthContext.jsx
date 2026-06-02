import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin, verifyAdmin } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const res = await verifyAdmin()
      setAdmin(res.data.admin)
    } catch (error) {
      localStorage.removeItem('token')
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const res = await loginAdmin(credentials)

    const { token, admin } = res.data

    localStorage.setItem('token', token)
    setAdmin(admin)

    return admin
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext