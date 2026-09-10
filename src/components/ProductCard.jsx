import {
  Plus,
} from 'lucide-react'

import {
  useCart,
} from '../context/CartContext'

export default function ProductCard({
  product,
}) {

  const {
    addToCart,
  } = useCart()

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[28px]
        bg-white
        shadow-sm
        ring-1
        ring-black/5
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div
        className="
          aspect-square
          overflow-hidden
          bg-[#FFF4E8]
        "
      >

        <img
          src={product.image_url}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-300
            group-hover:scale-105
          "
        />

      </div>

      <div className="p-4 sm:p-5">

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div>

            <h3
              className="
                text-lg
                font-black
                text-[#67300E]
              "
            >
              {product.name}
            </h3>

            <p
              className="
                mt-1
                line-clamp-2
                text-sm
                leading-5
                text-[#8f654d]
              "
            >
              {product.description}
            </p>

          </div>

        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <span
            className="
              text-xl
              font-black
              text-[#67300E]
            "
          >
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() =>
              addToCart(product)
            }
            className="
              flex
              min-h-11
              items-center
              gap-2
              rounded-full
              bg-[#67300E]
              px-4
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#512508]
            "
          >

            <Plus size={18} />

            Agregar

          </button>

        </div>

      </div>

    </article>
  )
}