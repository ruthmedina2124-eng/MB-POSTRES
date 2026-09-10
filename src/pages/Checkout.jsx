import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Store,
  Truck,
  User,
  Phone,
  Mail,
  MessageSquareText,
} from 'lucide-react'

export default function Checkout({
  cart,
  orderData,
  setOrderData,
  subtotal,
  onBack,
  onContinue,
}) {

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setOrderData(current => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!orderData.name.trim()) {
      alert('Ingresa tu nombre')
      return
    }

    if (!orderData.phone.trim()) {
      alert(
        'Ingresa tu número de WhatsApp'
      )
      return
    }

    if (!orderData.deliveryDate) {
      alert(
        'Selecciona una fecha de entrega'
      )
      return
    }

    if (!orderData.deliveryTime) {
      alert(
        'Selecciona una hora de entrega'
      )
      return
    }

    if (
      orderData.deliveryType ===
        'delivery' &&
      !orderData.address.trim()
    ) {
      alert(
        'Ingresa la dirección de entrega'
      )
      return
    }

    onContinue()
  }

  const itemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        pb-10
      "
    >

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
            max-w-5xl
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
              Datos de tu pedido
            </h1>

            <p
              className="
                text-sm
                text-[#8f654d]
              "
            >
              Completa la información
              para continuar
            </p>
          </div>
        </div>
      </header>

      <main
        className="
          mx-auto
          grid
          max-w-5xl
          gap-6
          px-4
          py-8
          sm:px-6
          lg:grid-cols-[1fr_360px]
        "
      >

        <form
          onSubmit={handleSubmit}
          className="
            rounded-[28px]
            bg-white
            p-5
            shadow-sm
            ring-1
            ring-black/5
            sm:p-7
          "
        >

          <div>
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F04C58]
              "
            >
              Tus datos
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                text-[#67300E]
              "
            >
              ¿A nombre de quién
              hacemos el pedido?
            </h2>
          </div>

          <div
            className="
              mt-7
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <div>
              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#67300E]
                "
              >
                <User size={17} />
                Nombre completo *
              </label>

              <input
                type="text"
                name="name"
                value={orderData.name}
                onChange={handleChange}
                placeholder="Ej. María Medina"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#A9D6D8]
                  focus:ring-2
                  focus:ring-[#A9D6D8]/30
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#67300E]
                "
              >
                <Phone size={17} />
                WhatsApp *
              </label>

              <input
                type="tel"
                name="phone"
                value={orderData.phone}
                onChange={handleChange}
                placeholder="09XXXXXXXX"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  outline-none
                  focus:border-[#A9D6D8]
                  focus:ring-2
                  focus:ring-[#A9D6D8]/30
                "
              />
            </div>

          </div>

          <div className="mt-5">
            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-[#67300E]
              "
            >
              <Mail size={17} />
              Correo
              <span
                className="
                  font-normal
                  text-[#9b765f]
                "
              >
                (opcional)
              </span>
            </label>

            <input
              type="email"
              name="email"
              value={orderData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="
                w-full
                rounded-2xl
                border
                border-[#ead7cf]
                bg-[#fffaf8]
                px-4
                py-3
                outline-none
                focus:border-[#A9D6D8]
                focus:ring-2
                focus:ring-[#A9D6D8]/30
              "
            />
          </div>

          <div
            className="
              my-8
              border-t
              border-[#f1e2dc]
            "
          />

          <div>
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F04C58]
              "
            >
              Entrega
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                text-[#67300E]
              "
            >
              ¿Cómo quieres recibirlo?
            </h2>
          </div>

          <div
            className="
              mt-6
              grid
              gap-4
              sm:grid-cols-2
            "
          >

            <button
              type="button"
              onClick={() =>
                setOrderData(
                  current => ({
                    ...current,
                    deliveryType:
                      'pickup',
                    address: '',
                    reference: '',
                  })
                )
              }
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border-2
                p-4
                text-left
                transition
                ${
                  orderData.deliveryType ===
                  'pickup'
                    ? 'border-[#67300E] bg-[#FFF4E8]'
                    : 'border-[#ead7cf] bg-white'
                }
              `}
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#A9D6D8]
                  text-[#67300E]
                "
              >
                <Store size={22} />
              </div>

              <div>
                <p
                  className="
                    font-black
                    text-[#67300E]
                  "
                >
                  Retiro
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#8f654d]
                  "
                >
                  Recoge tu pedido
                  directamente
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setOrderData(
                  current => ({
                    ...current,
                    deliveryType:
                      'delivery',
                  })
                )
              }
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border-2
                p-4
                text-left
                transition
                ${
                  orderData.deliveryType ===
                  'delivery'
                    ? 'border-[#67300E] bg-[#FFF4E8]'
                    : 'border-[#ead7cf] bg-white'
                }
              `}
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F7D3CF]
                  text-[#67300E]
                "
              >
                <Truck size={22} />
              </div>

              <div>
                <p
                  className="
                    font-black
                    text-[#67300E]
                  "
                >
                  Entrega
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#8f654d]
                  "
                >
                  Recíbelo en la
                  dirección indicada
                </p>
              </div>
            </button>

          </div>

          <div
            className="
              mt-6
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <div>
              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#67300E]
                "
              >
                <CalendarDays size={17} />
                Fecha *
              </label>

              <input
                type="date"
                name="deliveryDate"
                value={
                  orderData.deliveryDate
                }
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split('T')[0]
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  outline-none
                  focus:border-[#A9D6D8]
                  focus:ring-2
                  focus:ring-[#A9D6D8]/30
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#67300E]
                "
              >
                <Clock3 size={17} />
                Hora *
              </label>

              <input
                type="time"
                name="deliveryTime"
                value={
                  orderData.deliveryTime
                }
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  outline-none
                  focus:border-[#A9D6D8]
                  focus:ring-2
                  focus:ring-[#A9D6D8]/30
                "
              />
            </div>

          </div>

          {orderData.deliveryType ===
            'delivery' && (
            <>
              <div className="mt-5">
                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-[#67300E]
                  "
                >
                  <MapPin size={17} />
                  Dirección de entrega *
                </label>

                <textarea
                  name="address"
                  value={
                    orderData.address
                  }
                  onChange={handleChange}
                  rows="3"
                  placeholder="Sector, calles, número de casa..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-[#ead7cf]
                    bg-[#fffaf8]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#A9D6D8]
                    focus:ring-2
                    focus:ring-[#A9D6D8]/30
                  "
                />
              </div>

              <div className="mt-5">
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[#67300E]
                  "
                >
                  Referencia
                </label>

                <input
                  type="text"
                  name="reference"
                  value={
                    orderData.reference
                  }
                  onChange={handleChange}
                  placeholder="Ej. Casa color blanco, junto a..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-[#ead7cf]
                    bg-[#fffaf8]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#A9D6D8]
                    focus:ring-2
                    focus:ring-[#A9D6D8]/30
                  "
                />
              </div>
            </>
          )}

          <div className="mt-5">
            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-[#67300E]
              "
            >
              <MessageSquareText
                size={17}
              />
              Observaciones
            </label>

            <textarea
              name="notes"
              value={orderData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Ej. Es para cumpleaños, escribir Feliz Cumple..."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#ead7cf]
                bg-[#fffaf8]
                px-4
                py-3
                outline-none
                focus:border-[#A9D6D8]
                focus:ring-2
                focus:ring-[#A9D6D8]/30
              "
            />
          </div>

          <button
            type="submit"
            className="
              mt-7
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
            Continuar al pago
          </button>

        </form>

        <aside
          className="
            h-fit
            rounded-[28px]
            bg-white
            p-5
            shadow-sm
            ring-1
            ring-black/5
            lg:sticky
            lg:top-24
          "
        >
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#F04C58]
            "
          >
            Resumen
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-black
              text-[#67300E]
            "
          >
            Tu pedido
          </h2>

          <div
            className="
              mt-5
              space-y-4
            "
          >
            {cart.map(item => (
              <div
                key={item.id}
                className="
                  flex
                  justify-between
                  gap-3
                "
              >
                <div>
                  <p
                    className="
                      font-bold
                      text-[#67300E]
                    "
                  >
                    {item.quantity} ×{' '}
                    {item.name}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
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

                <span
                  className="
                    whitespace-nowrap
                    font-bold
                    text-[#67300E]
                  "
                >
                  $
                  {(
                    Number(
                      item.price
                    ) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="
              my-5
              border-t
              border-dashed
              border-[#ead7cf]
            "
          />

          <div
            className="
              flex
              justify-between
              text-sm
              text-[#8f654d]
            "
          >
            <span>
              {itemCount}{' '}
              {itemCount === 1
                ? 'producto'
                : 'productos'}
            </span>

            <span>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
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
            El valor de entrega,
            si corresponde, se
            agregará más adelante
            según la configuración
            del negocio.
          </p>
        </aside>

      </main>
    </div>
  )
}