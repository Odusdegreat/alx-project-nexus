import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilters, applyFiltersAndSort } from '@/store/productSlice';

interface FiltersProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

const Filters = ({ className, onClose, isMobile = false }: FiltersProps) => {
  const dispatch = useAppDispatch();
  const { products, filters } = useAppSelector((state) => state.products);
  
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  // Get unique categories and brands
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  // Update filters when they change
  useEffect(() => {
    dispatch(applyFiltersAndSort());
  }, [filters, dispatch]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    dispatch(setFilters({ categories: newCategories }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    
    dispatch(setFilters({ brands: newBrands }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeCommit = () => {
    dispatch(setFilters({ priceRange: [priceRange[0], priceRange[1]] }));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setFilters({ rating: filters.rating === rating ? 0 : rating }));
  };

  const handleInStockToggle = () => {
    dispatch(setFilters({ inStockOnly: !filters.inStockOnly }));
  };

  const clearAllFilters = () => {
    dispatch(setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
      inStockOnly: false,
    }));
    setPriceRange([0, 1000]);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.inStockOnly ? 1 : 0) + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-7 px-2"
              >
                Clear All
              </Button>
            )}
            {isMobile && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories */}
        <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Categories</span>
              {categoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Brands */}
        <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Brands</span>
              {brandOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand, checked as boolean)
                  }
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Price Range</span>
              {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating */}
        <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Rating</span>
              {ratingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm h-8"
                onClick={() => handleRatingChange(rating)}
              >
                <div className="flex items-center space-x-1">
                  <span>{rating}</span>
                  <span className="text-yellow-400">★</span>
                  <span>& up</span>
                </div>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* In Stock Only */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="inStock"
            checked={filters.inStockOnly}
            onCheckedChange={handleInStockToggle}
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            In Stock Only
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;