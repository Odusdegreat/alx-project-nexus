import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { useAppSelector } from '@/store';

interface ProductGridProps {
  onLoadMore?: () => void;
  enableInfiniteScroll?: boolean;
}

const ProductGrid = ({ onLoadMore, enableInfiniteScroll = false }: ProductGridProps) => {
  const { filteredProducts, loading, itemsPerPage, currentPage } = useAppSelector((state) => state.products);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Calculate products to show based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = enableInfiniteScroll 
    ? startIndex + (itemsPerPage * currentPage) // Show all items up to current page for infinite scroll
    : startIndex + itemsPerPage; // Show only current page items for pagination
  
  const productsToShow = filteredProducts.slice(
    enableInfiniteScroll ? 0 : startIndex, 
    endIndex
  );

  // Infinite scroll logic
  useEffect(() => {
    if (inView && enableInfiniteScroll && onLoadMore && !loading) {
      const hasMoreProducts = endIndex < filteredProducts.length;
      if (hasMoreProducts) {
        onLoadMore();
      }
    }
  }, [inView, enableInfiniteScroll, onLoadMore, loading, endIndex, filteredProducts.length]);

  if (loading && productsToShow.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-lg aspect-square mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (productsToShow.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsToShow.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {enableInfiniteScroll && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more products...</span>
            </div>
          )}
          {!loading && endIndex >= filteredProducts.length && filteredProducts.length > 0 && (
            <p className="text-muted-foreground">You've seen all products!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;