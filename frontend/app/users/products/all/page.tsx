'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, Loader2, AlertCircle, ChevronDown, ChevronRight, SlidersHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {

  const [allProducts, setAllProducts] = useState<Products[] | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Products[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    ApprovedProducts()
  }, [])
  
  useEffect(() => {
    filterProducts()
  }, [selectedCategory, priceRange, sortBy, allProducts, searchQuery])

  const ApprovedProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.post(API_ENDPOINTS.APPROVED_PRODUCTS)
      const products = response.data.Approvedproducts
      setAllProducts(products)
      
      // Extract unique categories
      const uniqueCategories: string[] = ['All', ...Array.from(new Set(products.map((p: Products) => p.category))) as string[]]
      setCategories(uniqueCategories)
      
      setError(null)
    } catch (err) {
      setError('Failed to load products. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    if (!allProducts) return

    let filtered = [...allProducts]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.p_name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by price range
    if (priceRange !== 'All') {
      const ranges: { [key: string]: [number, number] } = {
        'Under $25': [0, 25],
        '$25 to $50': [25, 50],
        '$50 to $100': [50, 100],
        '$100 to $200': [100, 200],
        '$200 & Above': [200, Infinity]
      }
      const [min, max] = ranges[priceRange]
      filtered = filtered.filter(p => p.price >= min && p.price < max)
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.p_name.localeCompare(b.p_name))
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Amazon-Style Search Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border-2 border-orange-400 rounded-md focus:outline-none focus:border-orange-500 text-sm"
              />
              <button className="absolute right-0 top-0 bottom-0 px-4 bg-orange-400 hover:bg-orange-500 rounded-r-md transition-colors">
                <Search className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
          {searchQuery && (
            <p className="text-xs text-gray-600 mt-2">
              Searching for: <span className="font-medium text-gray-900">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Breadcrumb & Sort */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="hover:text-orange-600 cursor-pointer">Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-gray-900">{selectedCategory}</span>
            {filteredProducts && (
              <span className="text-gray-500">({filteredProducts.length} results)</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <select 
              className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Loading products...</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <div className="bg-white border border-gray-200 rounded p-4 sticky top-4">
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Department</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left text-sm py-1 hover:text-orange-600 transition-colors ${
                          selectedCategory === category 
                            ? 'text-orange-600 font-medium' 
                            : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2">
                    {['All', 'Under $25', '$25 to $50', '$50 to $100', '$100 to $200', '$200 & Above'].map((range) => (
                      <label key={range} className="flex items-center text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                          className="mr-2 accent-orange-500"
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== 'All' || priceRange !== 'All' || searchQuery) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('All')
                      setPriceRange('All')
                      setSearchQuery('')
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <a
                      href={`/users/products/${product.id}`}
                      key={product.id}
                      className="group block bg-white border border-gray-200 rounded hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-white p-4 flex items-center justify-center">
                        <img 
                          src={product.image_url} 
                          alt={product.p_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-3 border-t border-gray-200">
                        <h2 className="text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-orange-600">
                          {product.p_name}
                        </h2>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-xs text-gray-600">$</span>
                          <span className="text-2xl font-medium text-gray-900">{product.price}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-blue-600 hover:text-orange-600">1,234</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-base font-medium">No products found</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>    
    </div>
  )
}

export default page