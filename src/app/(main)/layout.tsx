import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-16 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}