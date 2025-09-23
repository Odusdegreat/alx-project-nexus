import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery, applyFiltersAndSort } from '@/store/productSlice';
import { toggleCart } from '@/store/cartSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.products);
  const { items } = useAppSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(applyFiltersAndSort());
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-bold text-white">EcomStore</h1>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10 bg-white/90 border-white/20 focus:bg-white"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({totalItems})
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="pl-10 bg-white/90 border-white/20 focus:bg-white"
                />
              </div>
            </form>
            
            {/* Mobile Cart */}
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={() => {
                dispatch(toggleCart());
                setMobileMenuOpen(false);
              }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({totalItems})
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;