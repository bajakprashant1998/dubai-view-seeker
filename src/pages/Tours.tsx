import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActivityCard } from "@/components/ActivityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { activities, categories } from "@/data/activities";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-100", label: "Under AED 100" },
  { value: "100-250", label: "AED 100 - 250" },
  { value: "250-500", label: "AED 250 - 500" },
  { value: "500+", label: "AED 500+" },
];

const Tours = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const selectedCategory = searchParams.get("category") || "All";
  const selectedSort = searchParams.get("sort") || "popular";
  const selectedPrice = searchParams.get("price") || "all";

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(a => a.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (selectedPrice !== "all") {
      const [min, max] = selectedPrice.split("-").map(Number);
      result = result.filter(a => {
        if (selectedPrice === "500+") return a.price >= 500;
        return a.price >= min && a.price <= max;
      });
    }

    // Sorting
    switch (selectedSort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [selectedCategory, selectedSort, selectedPrice, searchQuery]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "All" || value === "all" || value === "popular") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-ocean to-ocean-dark py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Explore Dubai <span className="text-gold">Experiences</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Discover {activities.length}+ handpicked tours and attractions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tours and activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="appearance-none h-12 px-4 pr-10 rounded-lg border border-input bg-background text-foreground cursor-pointer min-w-[180px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside
                className={`lg:w-64 shrink-0 space-y-6 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Categories */}
                <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                  <h3 className="font-serif font-bold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => updateFilter("category", category)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                  <h3 className="font-serif font-bold text-lg mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => updateFilter("price", range.value)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                          selectedPrice === range.value
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Results Grid */}
              <div className="flex-1">
                {/* Active Filters */}
                {(selectedCategory !== "All" || selectedPrice !== "all" || searchQuery) && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedCategory !== "All" && (
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 cursor-pointer hover:bg-destructive/10"
                        onClick={() => updateFilter("category", "All")}
                      >
                        {selectedCategory}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {selectedPrice !== "all" && (
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 cursor-pointer hover:bg-destructive/10"
                        onClick={() => updateFilter("price", "all")}
                      >
                        {priceRanges.find(p => p.value === selectedPrice)?.label}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 cursor-pointer hover:bg-destructive/10"
                        onClick={() => setSearchQuery("")}
                      >
                        "{searchQuery}"
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <p className="text-muted-foreground mb-6">
                  Showing <span className="font-semibold text-foreground">{filteredActivities.length}</span> experiences
                </p>

                {/* Grid */}
                {filteredActivities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ActivityCard activity={activity} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      No activities found matching your criteria.
                    </p>
                    <Button
                      variant="gold"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchParams(new URLSearchParams());
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tours;