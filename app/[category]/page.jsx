"use client";







import React, { useState, useEffect } from "react";
import { motion, useScroll,AnimatePresence, useTransform } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  Search, 
  ArrowRight, 
  Star, 
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getCategoryDisplayName, getTypeDisplayName, formatPrice } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category;
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Fetch products for this category
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?category=${category}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(product => product.type === selectedType);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => 
          selectedSizes.includes(size.size)
        )
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedType, sortBy, priceRange, selectedSizes]);

  // Get unique types and sizes for filters
  const types = ["all", ...Array.from(new Set(products.map(p => p.type)))];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const maxPrice = Math.max(...products.map(p => p.price), 10000);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  // Handle size selection
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10"
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {getCategoryDisplayName(category)}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover our curated collection of premium {getCategoryDisplayName(category).toLowerCase()}. 
              From streetwear essentials to statement pieces, find your perfect style.
            </p>
            
            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder={`Search ${getCategoryDisplayName(category).toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-32 py-4 text-lg bg-background/80 backdrop-blur-md border-2 border-primary/20 focus:border-primary transition-all duration-300 rounded-full"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-primary">{filteredProducts.length}</div>
                <div className="text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{types.length - 1}</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{sizes.length}</div>
                <div className="text-muted-foreground">Sizes</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Side - Filters Toggle and Type Selection */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : getTypeDisplayName(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Side - Sort and View Mode */}
            <div className="flex items-center gap-4">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="w-full"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Range: ₹{priceRange.min} - ₹{priceRange.max}
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <Button
                          key={size}
                          variant={selectedSizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSize(size)}
                          className="min-w-[40px]"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("all");
                        setPriceRange({ min: 0, max: maxPrice });
                        setSelectedSizes([]);
                      }}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setPriceRange({ min: 0, max: maxPrice });
                  setSelectedSizes([]);
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                </p>
                <p className="text-muted-foreground">
                  {searchQuery && `for "${searchQuery}"`}
                </p>
              </motion.div>

              {/* Products Grid */}
              <div className={cn(
                "gap-6",
                viewMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "space-y-4"
              )}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={cn(
                      viewMode === "list" && "col-span-full"
                    )}
                  >
                    <ProductCard
                      product={product}
                      showActions={true}
                      showRating={true}
                      showQuickView={true}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our team is here to help you find the perfect {getCategoryDisplayName(category).toLowerCase()} for your style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/contact")}
                className="px-8 py-4 text-lg rounded-full"
              >
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/")}
                className="px-8 py-4 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}