'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, User, Package, LogOut, Home, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserEmail(localStorage.getItem('useremail'))
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('useremail')
    router.push('/users/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              E-<span className="text-orange-600">Shop</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/users/products/all">
              <Button
                variant={isActive('/users/products/all') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Store className="h-4 w-4" />
                All Products
              </Button>
            </Link>
            {userEmail && (
              <>
                <Link href="/users/products/userall">
                  <Button
                    variant={isActive('/users/products/userall') ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Package className="h-4 w-4" />
                    My Products
                  </Button>
                </Link>
                <Link href="/users/products/new">
                  <Button
                    variant={isActive('/users/products/new') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Add Product
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {userEmail ? (
              <>
                <Link href="/users/profile">
                  <Button
                    variant={isActive('/users/profile') ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/users/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/users/signup">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex items-center gap-1 overflow-x-auto">
          <Link href="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/users/products/all">
            <Button
              variant={isActive('/users/products/all') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Store className="h-4 w-4" />
              Products
            </Button>
          </Link>
          {userEmail && (
            <>
              <Link href="/users/products/userall">
                <Button
                  variant={isActive('/users/products/userall') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  My Products
                </Button>
              </Link>
              <Link href="/users/products/new">
                <Button
                  variant={isActive('/users/products/new') ? 'default' : 'ghost'}
                  size="sm"
                >
                  Add
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
