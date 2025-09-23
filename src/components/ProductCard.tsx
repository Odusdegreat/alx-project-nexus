import { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] bg-gradient-card border-0",
      className
    )}>
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs bg-sale">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
              "bg-white/80 hover:bg-white shadow-sm",
              isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand and Category */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">{product.brand}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-price">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <Badge variant="outline" className="text-success border-success text-xs">
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;