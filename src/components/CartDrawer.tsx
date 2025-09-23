import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCartOpen, removeFromCart, updateQuantity } from '@/store/cartSlice';

const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const { items, total, isOpen } = useAppSelector((state) => state.cart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium text-foreground">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add some products to get started</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex space-x-3 bg-card p-3 rounded-lg border">
                  {/* Product Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md bg-muted"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.product.brand}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-price">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => dispatch(setCartOpen(false))}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;