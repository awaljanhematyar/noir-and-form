/** Shared shopping state persists only validated cart lines and wishlist product IDs. */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { capFor, cleanCart, cleanWishlist, getProduct, readStored } from '../utils/shop';

const StoreContext = createContext(null);
const CART_KEY = 'noir-form:cart:v1';
const WISH_KEY = 'noir-form:wishlist:v1';

// ========================================
// SAFE STORAGE ADAPTER
// ========================================
function read(key, clean) {
  try {
    return readStored(key, clean, window.localStorage);
  } catch {
    return { items: [], notice: 'Browser storage is unavailable. Shopping will work in this tab.' };
  }
}
function usePersistedItems(key, clean) {
  const [initial] = useState(() => read(key, clean));
  const [items, setItems] = useState(initial.items);
  const [warning, setWarning] = useState(initial.notice);
  const external = useRef(false);
  useEffect(() => {
    if (external.current) {
      external.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify({ version: 1, items }));
    } catch {
      setWarning('Browser storage is unavailable. Changes are saved only in this tab.');
    }
  }, [items, key]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key !== key && event.key !== null) return;
      const result = read(key, clean);
      external.current = true;
      setItems(result.items);
      if (result.notice) setWarning(result.notice);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key, clean]);
  return [items, setItems, warning];
}

// ========================================
// SHOPPING ACTIONS AND EPHEMERAL CONFIRMATION
// ========================================
export function StoreProvider({ children }) {
  const [cart, setCart, cartWarning] = usePersistedItems(CART_KEY, cleanCart);
  const [wishlist, setWishlist, wishWarning] = usePersistedItems(WISH_KEY, cleanWishlist);
  const [notice, setNotice] = useState('');
  const [order, setOrder] = useState(null);
  function toggleWishlist(id) {
    setWishlist((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
    setNotice(
      `${getProduct(id)?.name || 'Product'} ${wishlist.includes(id) ? 'removed from' : 'saved to'} your wishlist.`,
    );
  }
  function addToCart(productId, variantId, quantity) {
    const variant = getProduct(productId)?.variants.find((item) => item.id === variantId);
    const existing = cart.find(
      (line) => line.productId === productId && line.variantId === variantId,
    );
    if (
      !variant ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity + (existing?.quantity || 0) > capFor(variant)
    ) {
      setNotice('That quantity exceeds the available demo stock. Please review your bag.');
      return false;
    }
    setCart((previous) => cleanCart([...previous, { productId, variantId, quantity }]));
    setNotice(`${getProduct(productId).name} added to your bag.`);
    return true;
  }
  function updateQuantity(variantId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCart((previous) =>
      cleanCart(
        previous.map((line) => (line.variantId === variantId ? { ...line, quantity } : line)),
      ),
    );
  }
  function removeLine(variantId) {
    setCart((previous) => previous.filter((line) => line.variantId !== variantId));
    setNotice('Item removed from your bag.');
  }
  const value = {
    cart,
    wishlist,
    notice,
    setNotice,
    warning: cartWarning || wishWarning,
    order,
    setOrder,
    setCart,
    toggleWishlist,
    addToCart,
    updateQuantity,
    removeLine,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
