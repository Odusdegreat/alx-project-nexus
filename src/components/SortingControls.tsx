import { ArrowUpDown, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSortBy, applyFiltersAndSort } from '@/store/productSlice';
import { SortBy } from '@/types/product';

interface SortingControlsProps {
  onToggleView?: () => void;
  viewMode?: 'grid' | 'list';
}

const SortingControls = ({ onToggleView, viewMode = 'grid' }: SortingControlsProps) => {
  const dispatch = useAppDispatch();
  const { sortBy, filteredProducts, searchQuery } = useAppSelector((state) => state.products);

  const handleSortChange = (value: SortBy) => {
    dispatch(setSortBy(value));
    dispatch(applyFiltersAndSort());
  };

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      {/* Results Info */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {filteredProducts.length}
          </span>{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'} found
          {searchQuery && (
            <span>
              {' '}for "<span className="font-medium text-foreground">{searchQuery}</span>"
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        {onToggleView && (
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none h-9 px-3"
              onClick={() => viewMode !== 'grid' && onToggleView()}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none h-9 px-3"
              onClick={() => viewMode !== 'list' && onToggleView()}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingControls;