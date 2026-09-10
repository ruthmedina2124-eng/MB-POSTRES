import {
  ShoppingBag,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import logo from '../assets/logo-mb-postres.jpeg'
import { useCart } from '../context/CartContext'

export default function Header() {

  const {
    itemCount,
  } = useCart()

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#f2d7cf]
        bg-[#fffaf8]/95
        backdrop-blur
      "
    >

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-4
          py-3
          sm:px-6
          lg:px-8
        "
      >

        <Link
          to="/"
          className="
            flex
            items-center
            gap-3
          "
        >

          <img
            src={logo}
            alt="MB Postres"
            className="
              h-12
              w-12
              rounded-full
              object-cover
              sm:h-14
              sm:w-14
            "
          />

          <div>

            <p
              className="
                text-lg
                font-black
                leading-none
                text-[#67300E]
              "
            >
              MB Postres
            </p>

            <p
              className="
                mt-1
                hidden
                text-xs
                text-[#8f654d]
                sm:block
              "
            >
              Un detalle dulce para cada momento
            </p>

          </div>

        </Link>

        <Link
          to="/carrito"
          className="
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[#A9D6D8]
            text-[#67300E]
            transition
            hover:scale-105
          "
        >

          <ShoppingBag size={22} />

          {itemCount > 0 && (

            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-6
                min-w-6
                items-center
                justify-center
                rounded-full
                bg-[#F04C58]
                px-1
                text-xs
                font-bold
                text-white
              "
            >
              {itemCount}
            </span>

          )}

        </Link>

      </div>

    </header>
  )
}