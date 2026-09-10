import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

export default function Cart({
  cart,
  setCart,
  onBack,
  onContinue,
}) {

  function removeItem(id) {

    setCart(current =>
      current.filter(
        item =>
          item.id !== id
      )
    )

  }

  function updateQuantity(
    id,
    quantity
  ) {

    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setCart(current =>
      current.map(item =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )

  }

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        item.quantity,
      0
    )

  const itemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  /*
   * CARRITO VACÍO
   */

  if (cart.length === 0) {

    return (

      <div
        className="
          min-h-screen
          bg-[#fffaf8]
        "
      >

        <header
          className="
            border-b
            border-[#f1d3cb]
            bg-white
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-4xl
              items-center
              gap-4
              px-4
              py-4
              sm:px-6
            "
          >

            <button
              type="button"
              onClick={onBack}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#FFF4E8]
                text-[#67300E]
              "
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <h1
              className="
                text-xl
                font-black
                text-[#67300E]
              "
            >
              Tu pedido
            </h1>

          </div>

        </header>

        <main
          className="
            mx-auto
            flex
            max-w-xl
            flex-col
            items-center
            px-4
            py-20
            text-center
          "
        >

          <div
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-[#F7D3CF]
            "
          >

            <ShoppingBag
              size={38}
              className="
                text-[#67300E]
              "
            />

          </div>

          <h2
            className="
              mt-6
              text-2xl
              font-black
              text-[#67300E]
            "
          >
            Tu carrito está vacío
          </h2>

          <p
            className="
              mt-3
              max-w-sm
              text-[#8f654d]
            "
          >
            Agrega tus postres
            favoritos para comenzar
            tu pedido.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="
              mt-8
              rounded-full
              bg-[#67300E]
              px-7
              py-3
              font-bold
              text-white
            "
          >
            Ver menú
          </button>

        </main>

      </div>

    )

  }

  /*
   * CARRITO CON PRODUCTOS
   */

  return (

    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        pb-10
      "
    >

      {/* HEADER */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-[#f1d3cb]
          bg-white/95
          backdrop-blur
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-4xl
            items-center
            gap-4
            px-4
            py-4
            sm:px-6
          "
        >

          <button
            type="button"
            onClick={onBack}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FFF4E8]
              text-[#67300E]
              transition
              hover:bg-[#F7D3CF]
            "
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <h1
              className="
                text-xl
                font-black
                text-[#67300E]
              "
            >
              Tu pedido
            </h1>

            <p
              className="
                text-sm
                text-[#8f654d]
              "
            >
              {itemCount}{' '}
              {itemCount === 1
                ? 'producto seleccionado'
                : 'productos seleccionados'}
            </p>

          </div>

        </div>

      </header>

      <main
        className="
          mx-auto
          max-w-4xl
          px-4
          py-8
          sm:px-6
        "
      >

        <div className="space-y-4">

          {cart.map(item => {

            const itemSubtotal =
              Number(item.price) *
              item.quantity

            return (

              <article
                key={item.id}
                className="
                  flex
                  gap-4
                  rounded-[24px]
                  bg-white
                  p-4
                  shadow-sm
                  ring-1
                  ring-black/5
                  sm:p-5
                "
              >

                {/* FOTO TEMPORAL */}

                <div
                  className="
                    flex
                    h-24
                    w-24
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#FFF4E8]
                    sm:h-28
                    sm:w-28
                  "
                >

                  <span
                    className="
                      text-4xl
                    "
                  >
                    {item.category ===
                    'Cheesecakes'
                      ? '🍰'
                      : '🍪'}
                  </span>

                </div>

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div>

                      <h2
                        className="
                          font-black
                          text-[#67300E]
                          sm:text-lg
                        "
                      >
                        {item.name}
                      </h2>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-[#8f654d]
                        "
                      >
                        $
                        {Number(
                          item.price
                        ).toFixed(2)}
                        {' '}
                        c/u
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      aria-label={
                        `Eliminar ${item.name}`
                      }
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#fff1ef]
                        text-[#F04C58]
                        transition
                        hover:bg-[#ffe3df]
                      "
                    >
                      <Trash2
                        size={17}
                      />
                    </button>

                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    {/* CANTIDAD */}

                    <div
                      className="
                        flex
                        items-center
                        rounded-full
                        bg-[#FFF4E8]
                        p-1
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[#67300E]
                          shadow-sm
                        "
                      >
                        <Minus
                          size={17}
                        />
                      </button>

                      <span
                        className="
                          min-w-10
                          text-center
                          font-black
                          text-[#67300E]
                        "
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[#67300E]
                          text-white
                        "
                      >
                        <Plus
                          size={17}
                        />
                      </button>

                    </div>

                    <span
                      className="
                        text-lg
                        font-black
                        text-[#67300E]
                      "
                    >
                      $
                      {itemSubtotal.toFixed(2)}
                    </span>

                  </div>

                </div>

              </article>

            )

          })}

        </div>

        {/* RESUMEN */}

        <section
          className="
            mt-8
            rounded-[28px]
            bg-white
            p-5
            shadow-sm
            ring-1
            ring-black/5
            sm:p-6
          "
        >

          <h2
            className="
              text-lg
              font-black
              text-[#67300E]
            "
          >
            Resumen
          </h2>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[#8f654d]
              "
            >
              Subtotal
            </span>

            <span
              className="
                font-bold
                text-[#67300E]
              "
            >
              ${subtotal.toFixed(2)}
            </span>

          </div>

          <div
            className="
              my-4
              border-t
              border-dashed
              border-[#ead7cf]
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-lg
                font-black
                text-[#67300E]
              "
            >
              Total
            </span>

            <span
              className="
                text-2xl
                font-black
                text-[#67300E]
              "
            >
              ${subtotal.toFixed(2)}
            </span>

          </div>

          <p
            className="
              mt-3
              text-xs
              leading-5
              text-[#9b765f]
            "
          >
            El costo de entrega,
            si aplica, se calculará
            después de seleccionar
            el tipo de entrega.
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="
              mt-6
              w-full
              rounded-2xl
              bg-[#67300E]
              px-5
              py-4
              text-base
              font-black
              text-white
              transition
              hover:bg-[#512508]
            "
          >
            Continuar con mi pedido
          </button>

          <button
            type="button"
            onClick={onBack}
            className="
              mt-3
              w-full
              rounded-2xl
              px-5
              py-3
              text-sm
              font-bold
              text-[#67300E]
            "
          >
            Seguir comprando
          </button>

        </section>

      </main>

    </div>

  )
}