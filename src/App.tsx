import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { useAuth } from "@/contexts/auth-context"

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5efe6] dark:bg-[#1a120b]">
        <div className="text-muted-foreground font-bold tracking-widest animate-pulse">CARREGANDO...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-[#f5efe6] px-3 py-4 transition-all duration-500 md:px-6 md:py-8 dark:bg-[#1a120b]">
      <Home />
    </div>
  )
}
