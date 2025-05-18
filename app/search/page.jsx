"use client"; // Mark this as a Client Component
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

// Wrap the main component in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchResults />
    </Suspense>
  );
}

// Move the logic to a separate component
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Get the search query from the URL
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      if (query) {
        try {
          const response = await fetch(`/api/search?q=${query}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    }
    fetchSearchResults();
  }, [query]);

  return (
    <div className="bg-gradient-to-b to-black from-blue-900 min-h-screen text-white overflow-hidden">
      {/* Header Section */}
      <header className="text-center py-10">
        <h1 className="text-1xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Search Results for "{query}"
        </h1>
      </header>

      {/* Search Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {searchResults.map((product) => (
          <div
            key={product._id}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            <ProductCard
              id={product.itemId}
              title={product.name}
              price={product.price}
              imageUrl={`data:${product.contentType};base64,${product.image}`}
            />
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {searchResults.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-300">No results found for "{query}".</p>
        </div>
      )}
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}