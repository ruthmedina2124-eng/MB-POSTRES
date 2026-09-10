import {
  ShoppingBag,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useCart,
} from '../context/CartContext'

export default function CartBar() {

  const {
    itemCount,
    subtotal,
  } = useCart()

  if (itemCount === 0) {
    return null
  }

  return (
    <div
      className="
        fixed
        bottom-4
        left-0
        right-0
        z-40
        px-4
        sm:hidden
      "
    >

      <Link
        to="/carrito"
        className="
          mx-auto
          flex
          max-w-md
          items-center
          justify-between
          rounded-2xl
          bg-[#67300E]
          px-5
          py-4
          text-white
          shadow-xl
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <ShoppingBag size={22} />

          <div>

            <p className="text-xs text-white/75">
              {itemCount}
              {' '}
              {itemCount === 1
                ? 'producto'
                : 'productos'}
            </p>

            <p className="font-bold">
              Ver pedido
            </p>

          </div>

        </div>

        <span className="font-black">
          ${subtotal.toFixed(2)}
        </span>

      </Link>

    </div>
  )
}