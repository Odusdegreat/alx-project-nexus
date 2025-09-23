import { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProducts, applyFiltersAndSort, setCurrentPage } from '@/store/productSlice';
import { mockProducts } from '@/data/mockProducts';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import SortingControls from '@/components/SortingControls';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import CartDrawer from '@/components/CartDrawer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, currentPage } = useAppSelector((state) => state.products);
  const { toast } = useToast();
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [infiniteScrollMode, setInfiniteScrollMode] = useState(false);

  // Initialize products on component mount
  useEffect(() => {
    dispatch(setProducts(mockProducts));
    toast({
      title: "Welcome to EcomStore! 🛍️",
      description: "Browse our amazing collection of products.",
    });
  }, [dispatch, toast]);

  const handleLoadMore = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Filters />
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setMobileFiltersOpen(true)}
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters & Sort
              </Button>
            </div>

            {/* Sorting Controls */}
            <div id="products-section">
              <SortingControls 
                onToggleView={toggleViewMode}
                viewMode={viewMode}
              />
            </div>

            {/* Toggle Pagination/Infinite Scroll */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing products 
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <Button
                    variant={!infiniteScrollMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInfiniteScrollMode(false)}
                  >
                    Pagination
                  </Button>
                  <Button
                    variant={infiniteScrollMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInfiniteScrollMode(true)}
                  >
                    Infinite Scroll
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid 
              onLoadMore={handleLoadMore}
              enableInfiniteScroll={infiniteScrollMode}
            />

            {/* Pagination (only show when not in infinite scroll mode) */}
            {!infiniteScrollMode && <Pagination />}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:w-[400px]">
          <SheetHeader className="pb-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Filters 
            isMobile 
            onClose={() => setMobileFiltersOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default Index;