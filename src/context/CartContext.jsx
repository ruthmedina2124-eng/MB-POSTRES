import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {

    const saved =
      localStorage.getItem('mb-postres-cart')

    if (!saved) {
      return []
    }

    try {
      return JSON.parse(saved)
    } catch {
      return []
    }

  })

  useEffect(() => {

    localStorage.setItem(
      'mb-postres-cart',
      JSON.stringify(cart)
    )

  }, [cart])

  function addToCart(product) {

    setCart(current => {

      const existing =
        current.find(
          item => item.id === product.id
        )

      if (existing) {

        return current.map(item => {

          if (item.id === product.id) {

            return {
              ...item,
              quantity: item.quantity + 1,
            }

          }

          return item

        })

      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ]

    })

  }

  function removeFromCart(productId) {

    setCart(current =>
      current.filter(
        item => item.id !== productId
      )
    )

  }

  function updateQuantity(
    productId,
    quantity
  ) {

    if (quantity <= 0) {

      removeFromCart(productId)

      return

    }

    setCart(current =>
      current.map(item => {

        if (item.id === productId) {

          return {
            ...item,
            quantity,
          }

        }

        return item

      })
    )

  }

  function clearCart() {

    setCart([])

  }

  const itemCount = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  }, [cart])

  const subtotal = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        item.quantity,
      0
    )

  }, [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {

  const context =
    useContext(CartContext)

  if (!context) {

    throw new Error(
      'useCart debe usarse dentro de CartProvider'
    )

  }

  return context
}