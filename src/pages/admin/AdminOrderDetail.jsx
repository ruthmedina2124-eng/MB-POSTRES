import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileImage,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  User,
} from 'lucide-react'

import {
  getOrderItems,
  getReceiptSignedUrl,
  updateOrderStatus,
} from '../../services/admin'

const paymentOptions = [
  {
    value: 'pending_verification',
    label: 'Por verificar',
  },
  {
    value: 'approved',
    label: 'Pago verificado',
  },
  {
    value: 'rejected',
    label: 'Pago rechazado',
  },
]

const orderOptions = [
  {
    value: 'pending',
    label: 'Pendiente',
  },
  {
    value: 'preparing',
    label: 'En preparación',
  },
  {
    value: 'ready',
    label: 'Listo',
  },
  {
    value: 'delivered',
    label: 'Entregado',
  },
  {
    value: 'cancelled',
    label: 'Cancelado',
  },
]

export default function AdminOrderDetail({
  order,
  onBack,
  onUpdated,
}) {
  const [
    items,
    setItems,
  ] = useState([])

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState(
    order.payment_status
  )

  const [
    orderStatus,
    setOrderStatus,
  ] = useState(
    order.order_status
  )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    receiptLoading,
    setReceiptLoading,
  ] = useState(false)

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState('')

  async function loadItems() {
    try {
      setLoading(true)
      setError('')

      const data =
        await getOrderItems(
          order.id
        )

      setItems(data)
    } catch (error) {
      console.error(
        'Error cargando detalle:',
        error
      )

      setError(
        error?.message ||
        'No se pudo cargar el detalle.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [order.id])

  async function handleReceipt() {
    if (!order.receipt_path) {
      setError(
        'Este pedido no tiene comprobante asociado.'
      )
      return
    }

    try {
      setReceiptLoading(true)
      setError('')

      const url =
        await getReceiptSignedUrl(
          order.receipt_path
        )

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      )
    } catch (error) {
      console.error(
        'Error abriendo comprobante:',
        error
      )

      setError(
        error?.message ||
        'No se pudo abrir el comprobante.'
      )
    } finally {
      setReceiptLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError('')
      setMessage('')

      const updated =
        await updateOrderStatus({
          orderId: order.id,
          paymentStatus,
          orderStatus,
        })

      onUpdated?.(updated)

      setMessage(
        'Estados actualizados correctamente.'
      )
    } catch (error) {
      console.error(
        'Error actualizando pedido:',
        error
      )

      setError(
        error?.message ||
        'No se pudieron guardar los cambios.'
      )
    } finally {
      setSaving(false)
    }
  }

  const deliveryLabel =
    order.delivery_type ===
    'delivery'
      ? 'Entrega a domicilio'
      : 'Retiro'

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

          <div className="min-w-0">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#F04C58]
              "
            >
              Detalle del pedido
            </p>

            <h1
              className="
                truncate
                text-xl
                font-black
                text-[#67300E]
              "
            >
              {order.order_number}
            </h1>
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
          lg:grid-cols-[1fr_340px]
        "
      >
        <div className="space-y-6">
          <section
            className="
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
                text-xl
                font-black
                text-[#67300E]
              "
            >
              Cliente y entrega
            </h2>

            <div
              className="
                mt-5
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              <Info
                icon={<User size={18} />}
                label="Cliente"
                value={order.customer_name}
              />

              <Info
                icon={<Phone size={18} />}
                label="Teléfono"
                value={order.customer_phone}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Fecha"
                value={order.delivery_date}
              />

              <Info
                icon={<Clock3 size={18} />}
                label="Hora"
                value={order.delivery_time}
              />

              <Info
                icon={<MapPin size={18} />}
                label="Tipo de entrega"
                value={deliveryLabel}
              />
            </div>

            {order.delivery_type ===
              'delivery' && (
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
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#F04C58]
                  "
                >
                  Dirección
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[#67300E]
                  "
                >
                  {order.delivery_address ||
                    'Sin dirección'}
                </p>

                {order.delivery_reference && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    Referencia:{' '}
                    {
                      order.delivery_reference
                    }
                  </p>
                )}
              </div>
            )}

            {order.notes && (
              <div
                className="
                  mt-4
                  rounded-2xl
                  bg-[#FFF4E8]
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#F04C58]
                  "
                >
                  Observaciones
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[#67300E]
                  "
                >
                  {order.notes}
                </p>
              </div>
            )}
          </section>

          <section
            className="
              rounded-[28px]
              bg-white
              p-5
              shadow-sm
              ring-1
              ring-black/5
              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <h2
                className="
                  text-xl
                  font-black
                  text-[#67300E]
                "
              >
                Productos
              </h2>

              <button
                type="button"
                onClick={loadItems}
                disabled={loading}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF4E8]
                  text-[#67300E]
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? 'animate-spin'
                      : ''
                  }
                />
              </button>
            </div>

            {loading ? (
              <p
                className="
                  mt-6
                  text-sm
                  text-[#8f654d]
                "
              >
                Cargando productos...
              </p>
            ) : (
              <div
                className="
                  mt-5
                  divide-y
                  divide-[#f1e2dc]
                "
              >
                {items.map(item => (
                  <div
                    key={item.id}
                    className="
                      flex
                      justify-between
                      gap-4
                      py-4
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
                        {item.product_name}
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
                          item.unit_price
                        ).toFixed(2)}
                        {' '}c/u
                      </p>
                    </div>

                    <strong
                      className="
                        whitespace-nowrap
                        text-[#67300E]
                      "
                    >
                      $
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside
          className="
            h-fit
            space-y-5
            lg:sticky
            lg:top-24
          "
        >
          <section
            className="
              rounded-[28px]
              bg-white
              p-5
              shadow-sm
              ring-1
              ring-black/5
            "
          >
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#F04C58]
              "
            >
              Total
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-black
                text-[#67300E]
              "
            >
              ${Number(order.total).toFixed(2)}
            </p>

            <div
              className="
                mt-5
                border-t
                border-dashed
                border-[#ead7cf]
                pt-5
              "
            >
              <button
                type="button"
                onClick={handleReceipt}
                disabled={
                  receiptLoading ||
                  !order.receipt_path
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#A9D6D8]
                  px-4
                  py-3
                  font-black
                  text-[#67300E]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {receiptLoading ? (
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <FileImage size={18} />
                )}

                Ver comprobante

                {!receiptLoading && (
                  <ExternalLink
                    size={16}
                  />
                )}
              </button>
            </div>
          </section>

          <section
            className="
              rounded-[28px]
              bg-white
              p-5
              shadow-sm
              ring-1
              ring-black/5
            "
          >
            <h2
              className="
                text-lg
                font-black
                text-[#67300E]
              "
            >
              Estado del pedido
            </h2>

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
                Estado del pago
              </label>

              <select
                value={paymentStatus}
                onChange={event =>
                  setPaymentStatus(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  text-[#67300E]
                  outline-none
                "
              >
                {paymentOptions.map(
                  option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
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
                Estado de preparación
              </label>

              <select
                value={orderStatus}
                onChange={event =>
                  setOrderStatus(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ead7cf]
                  bg-[#fffaf8]
                  px-4
                  py-3
                  text-[#67300E]
                  outline-none
                "
              >
                {orderOptions.map(
                  option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {error && (
              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-red-50
                  p-4
                  text-sm
                  font-bold
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-2
                  rounded-2xl
                  bg-green-50
                  p-4
                  text-sm
                  font-bold
                  text-green-800
                "
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#67300E]
                px-5
                py-4
                font-black
                text-white
                disabled:opacity-60
              "
            >
              {saving ? (
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>
          </section>
        </aside>
      </main>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-2xl
        bg-[#fffaf8]
        p-4
      "
    >
      <div
        className="
          mt-0.5
          text-[#67300E]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#F04C58]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-sm
            font-bold
            text-[#67300E]
          "
        >
          {value || '-'}
        </p>
      </div>
    </div>
  )
}
