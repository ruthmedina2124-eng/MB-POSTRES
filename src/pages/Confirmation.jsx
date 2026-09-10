import {
  CheckCircle2,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'

import logo from '../assets/logo-mb-postres.jpeg'

export default function Confirmation({
  order,
  orderData,
  cart,
  whatsapp,
  onNewOrder,
}) {
  function openWhatsApp() {
    const productLines = cart
      .map(
        item =>
          `${item.quantity} x ${item.name} - $${(
            Number(item.price) *
            item.quantity
          ).toFixed(2)}`
      )
      .join('\n')

    const deliveryText =
      orderData.deliveryType === 'delivery'
        ? `Entrega a domicilio
Dirección: ${orderData.address}
Referencia: ${orderData.reference || '-'}`
        : 'Retiro del pedido'

    const message = `
Hola MB Postres 🍪

Acabo de realizar un pedido.

Pedido: ${order.order_number}

Cliente: ${orderData.name}
Teléfono: ${orderData.phone}

Productos:
${productLines}

Fecha de entrega: ${orderData.deliveryDate}
Hora: ${orderData.deliveryTime}

${deliveryText}

Total: $${Number(order.total).toFixed(2)}

Ya subí mi comprobante de transferencia.
`.trim()

    const cleanNumber =
      String(whatsapp || '')
        .replace(/\D/g, '')

    if (!cleanNumber) {
      alert(
        'El número de WhatsApp de MB Postres no está configurado.'
      )
      return
    }

    const url =
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        px-4
        py-10
        sm:px-6
      "
    >
      <main
        className="
          mx-auto
          max-w-xl
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-sm
          ring-1
          ring-black/5
        "
      >
        <div
          className="
            bg-[#F7D3CF]
            px-6
            py-8
            text-center
          "
        >
          <img
            src={logo}
            alt="MB Postres"
            className="
              mx-auto
              h-24
              w-24
              rounded-full
              object-cover
            "
          />

          <div
            className="
              mx-auto
              mt-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#67300E]
            "
          >
            <CheckCircle2 size={34} />
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-black
              text-[#67300E]
            "
          >
            ¡Pedido recibido!
          </h1>

          <p
            className="
              mt-2
              text-[#7f5137]
            "
          >
            Recibimos tu pedido y tu
            comprobante de transferencia.
          </p>
        </div>

        <div className="p-6">

          <div
            className="
              rounded-[24px]
              bg-[#FFF4E8]
              p-5
              text-center
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F04C58]
              "
            >
              Número de pedido
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-black
                tracking-wide
                text-[#67300E]
              "
            >
              {order.order_number}
            </p>
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-[#ead7cf]
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <ShoppingBag
                size={20}
                className="text-[#67300E]"
              />

              <span
                className="
                  font-bold
                  text-[#67300E]
                "
              >
                Total
              </span>
            </div>

            <span
              className="
                text-2xl
                font-black
                text-[#67300E]
              "
            >
              ${Number(order.total).toFixed(2)}
            </span>
          </div>

          <div
            className="
              mt-5
              rounded-2xl
              bg-[#fffaf8]
              p-4
            "
          >
            <p
              className="
                text-sm
                leading-6
                text-[#8f654d]
              "
            >
              El comprobante será revisado
              por MB Postres. Tu pedido
              quedará confirmado una vez
              verificado el pago.
            </p>
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-[#25D366]
              px-5
              py-4
              font-black
              text-white
              transition
              hover:opacity-90
            "
          >
            <MessageCircle size={21} />

            Enviar pedido por WhatsApp
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="
              mt-3
              w-full
              rounded-2xl
              px-5
              py-3
              font-bold
              text-[#67300E]
            "
          >
            Hacer otro pedido
          </button>

        </div>
      </main>
    </div>
  )
}