'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Zap, Heart, Truck, RotateCcw, Award, ChevronRight, Star, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/api"

interface Product {
  id: number
  p_name: string
  price: number
  image_url: string
  isApproved: boolean
}

export default function Home() {
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect admin to admin dashboard
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isadmin') === 'true'
      if (isAdmin) {
        router.push('/admin/products')
        return
      }
    }
    fetchFeaturedProducts()
  }, [router])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.APPROVED_PRODUCTS)
      setFeaturedProducts(response.data.Approvedproducts.slice(0, 4))
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Welcome to Our Store
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Discover Amazing <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Products</span>
              </h2>
              <p className="text-xl text-gray-600">
                Find the best deals on quality products. Shop with confidence and enjoy fast delivery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/users/products/all" className="w-full sm:w-auto">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg h-12 rounded-lg">
                  <ShoppingCart className="mr-2" size={20} />
                  Shop Now
                </Button>
              </Link>
              <Link href="/users/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 text-lg h-12 rounded-lg">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 border border-orange-200 shadow-xl">
              <div className="text-center space-y-4">
                <ShoppingCart size={64} className="mx-auto text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">Premium Shopping</h3>
                <p className="text-gray-600\">Experience quality products at great prices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable shipping" },
            { icon: Award, title: "Quality Guaranteed", desc: "Best products available" },
            { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free returns" },
            { icon: Zap, title: "Best Deals", desc: "Unbeatable prices" },
          ].map((feature, idx) => (
            <Card key={idx} className="border-orange-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-block p-3 bg-orange-100 rounded-full">
                  <feature.icon size={24} className="text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600">Check out our latest amazing products</p>
            </div>
            <Link href="/users/products/all">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                View All <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <Card key={idx} className="border-orange-100 bg-gray-100 animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/users/products/${product.id}`}>
                  <Card className="border-orange-100 bg-white hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer overflow-hidden">
                    <CardContent className="p-4 space-y-4">
                      <div className="relative bg-gradient-to-br from-orange-50 to-white rounded-lg overflow-hidden h-48 flex items-center justify-center">
                        <img
                          src={product.image_url || "/placeholder.png"}
                          alt={product.p_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <Badge className="absolute top-2 right-2 bg-orange-600 text-white">
                          <Tag size={12} className="mr-1" />
                          Sale
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {product.p_name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < 4 ? "fill-orange-400 text-orange-400" : "text-gray-300"}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-2">(120)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${typeof product.price === 'string' ? parseFloat(product.price) : product.price}
                          </span>
                          <Heart size={20} className="text-gray-400 hover:text-red-500 transition-colors" />
                        </div>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-center text-white space-y-6">
          <h2 className="text-4xl font-bold">Ready to Start Shopping?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products at unbeatable prices.
          </p>
          <Link href="/users/products/all">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 text-lg h-12 px-8">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-400">E-Commerce Store</h3>
              <p className="text-gray-400">Your one-stop shop for quality products.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/users/products/all" className="hover:text-orange-400">Browse</Link></li>
                <li><Link href="/users/login" className="hover:text-orange-400">Login</Link></li>
                <li><Link href="/users/signup" className="hover:text-orange-400">Sign Up</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400">Shipping Info</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-400">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 E-Commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
