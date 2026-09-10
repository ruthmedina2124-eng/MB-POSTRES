import {
  useEffect,
  useState,
} from 'react'

import {
  Banknote,
  ChevronRight,
  Clock3,
  Download,
  LogOut,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Store,
} from 'lucide-react'

import logo from '../../assets/logo-mb-postres.jpeg'

import {
  adminLogout,
  getDashboardStats,
  getOrders,
} from '../../services/admin'

function StatusBadge({
  value,
}) {
  const labels = {
    pending_verification:
      'Por verificar',

    approved:
      'Pago verificado',

    rejected:
      'Pago rechazado',

    pending:
      'Pendiente',

    preparing:
      'En preparación',

    ready:
      'Listo',

    delivered:
      'Entregado',

    cancelled:
      'Cancelado',
  }

  let classes =
    'bg-[#FFF4E8] text-[#67300E]'

  if (
    value === 'approved' ||
    value === 'delivered'
  ) {
    classes =
      'bg-green-100 text-green-800'
  }

  if (
    value === 'rejected' ||
    value === 'cancelled'
  ) {
    classes =
      'bg-red-100 text-red-700'
  }

  if (
    value === 'preparing'
  ) {
    classes =
      'bg-blue-100 text-blue-800'
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-bold
        ${classes}
      `}
    >
      {labels[value] || value}
    </span>
  )
}

function escapeCsv(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return ''
  }

  const stringValue =
    String(value)

  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`
}

function paymentLabel(status) {
  const labels = {
    pending_verification:
      'Por verificar',

    approved:
      'Pago verificado',

    rejected:
      'Pago rechazado',
  }

  return labels[status] || status
}

function orderLabel(status) {
  const labels = {
    pending:
      'Pendiente',

    preparing:
      'En preparación',

    ready:
      'Listo',

    delivered:
      'Entregado',

    cancelled:
      'Cancelado',
  }

  return labels[status] || status
}

export default function AdminDashboard({
  onLogout,
  onOpenOrder,
  onOpenProducts,
}) {
  const [
    stats,
    setStats,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    downloading,
    setDownloading,
  ] = useState(false)

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const data =
        await getDashboardStats()

      setStats(data)
    } catch (error) {
      console.error(
        'Error dashboard:',
        error
      )

      setError(
        error?.message ||
        'No se pudo cargar el panel.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function handleLogout() {
    try {
      await adminLogout()
      onLogout()
    } catch (error) {
      console.error(
        'Error cerrando sesión:',
        error
      )

      setError(
        'No se pudo cerrar sesión.'
      )
    }
  }

  async function handleDownloadReport() {
    try {
      setDownloading(true)
      setError('')

      const orders =
        await getOrders()

      if (
        !orders ||
        orders.length === 0
      ) {
        setError(
          'No existen pedidos para descargar.'
        )

        return
      }

      const headers = [
        'Número de pedido',
        'Fecha de creación',
        'Cliente',
        'Teléfono',
        'Correo',
        'Tipo de entrega',
        'Fecha de entrega',
        'Hora de entrega',
        'Dirección',
        'Referencia',
        'Observaciones',
        'Subtotal',
        'Costo de entrega',
        'Total',
        'Estado del pago',
        'Estado del pedido',
      ]

      const rows =
        orders.map(order => {
          const createdAt =
            order.created_at
              ? new Date(
                  order.created_at
                ).toLocaleString(
                  'es-EC'
                )
              : ''

          const deliveryType =
            order.delivery_type ===
            'delivery'
              ? 'Entrega a domicilio'
              : 'Retiro'

          return [
            order.order_number,
            createdAt,
            order.customer_name,
            order.customer_phone,
            order.customer_email || '',
            deliveryType,
            order.delivery_date,
            order.delivery_time,
            order.delivery_address || '',
            order.delivery_reference || '',
            order.notes || '',
            Number(
              order.subtotal || 0
            ).toFixed(2),
            Number(
              order.delivery_fee || 0
            ).toFixed(2),
            Number(
              order.total || 0
            ).toFixed(2),
            paymentLabel(
              order.payment_status
            ),
            orderLabel(
              order.order_status
            ),
          ]
        })

      const csv =
        [
          headers
            .map(escapeCsv)
            .join(';'),

          ...rows.map(row =>
            row
              .map(escapeCsv)
              .join(';')
          ),
        ].join('\n')

      const blob =
        new Blob(
          [
            '\uFEFF',
            csv,
          ],
          {
            type:
              'text/csv;charset=utf-8;',
          }
        )

      const url =
        URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      const today =
        new Date()
          .toISOString()
          .slice(0, 10)

      link.href = url

      link.download =
        `MB-Postres-Pedidos-${today}.csv`

      document.body.appendChild(
        link
      )

      link.click()

      document.body.removeChild(
        link
      )

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(
        'Error descargando reporte:',
        error
      )

      setError(
        error?.message ||
        'No se pudo generar el reporte.'
      )
    } finally {
      setDownloading(false)
    }
  }

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
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-4
            py-3
            sm:px-6
            lg:px-8
          "
        >
          <div
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
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-[#F04C58]
                "
              >
                Administración
              </p>

              <h1
                className="
                  font-black
                  text-[#67300E]
                  sm:text-lg
                "
              >
                MB Postres
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-[#FFF4E8]
              px-4
              text-sm
              font-bold
              text-[#67300E]
            "
          >
            <LogOut size={17} />

            <span
              className="
                hidden
                sm:inline
              "
            >
              Salir
            </span>
          </button>
        </div>
      </header>

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
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
              Dashboard
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-black
                text-[#67300E]
              "
            >
              Pedidos
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#8f654d]
              "
            >
              Revisa y administra
              los pedidos de MB Postres.
            </p>
          </div>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            <button
              type="button"
              onClick={onOpenProducts}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#A9D6D8]
                px-5
                py-3
                text-sm
                font-black
                text-[#67300E]
                transition
                hover:opacity-90
              "
            >
              <Store size={17} />
              Productos
            </button>

            <button
              type="button"
              onClick={
                handleDownloadReport
              }
              disabled={
                downloading
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#67300E]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#512508]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {downloading ? (
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Download
                  size={17}
                />
              )}

              {downloading
                ? 'Generando...'
                : 'Descargar reporte'}
            </button>

            <button
              type="button"
              onClick={
                loadDashboard
              }
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-[#67300E]
                shadow-sm
                ring-1
                ring-black/5
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

              Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div
            className="
              mt-6
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

        {loading && (
          <div
            className="
              flex
              justify-center
              py-20
            "
          >
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-[#F7D3CF]
                border-t-[#67300E]
              "
            />
          </div>
        )}

        {!loading &&
          stats && (
            <>
              <section
                className="
                  mt-8
                  grid
                  gap-4
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >
                <StatCard
                  icon={
                    <ShoppingBag
                      size={20}
                    />
                  }
                  title="Pedidos totales"
                  value={
                    stats.totalOrders
                  }
                  background="bg-[#F7D3CF]"
                />

                <StatCard
                  icon={
                    <Banknote
                      size={20}
                    />
                  }
                  title="Pagos por verificar"
                  value={
                    stats.pendingPayments
                  }
                  background="bg-[#FFF4E8]"
                />

                <StatCard
                  icon={
                    <PackageCheck
                      size={20}
                    />
                  }
                  title="Pedidos pendientes"
                  value={
                    stats.pendingOrders
                  }
                  background="bg-[#A9D6D8]"
                />

                <StatCard
                  icon={
                    <Clock3
                      size={20}
                    />
                  }
                  title="Pedidos de hoy"
                  value={
                    stats.todayOrders
                  }
                  background="bg-[#fff1ef]"
                />
              </section>

              <section
                className="
                  mt-8
                  overflow-hidden
                  rounded-[28px]
                  bg-white
                  shadow-sm
                  ring-1
                  ring-black/5
                "
              >
                <div
                  className="
                    border-b
                    border-[#f1e2dc]
                    px-5
                    py-5
                    sm:px-6
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-black
                      text-[#67300E]
                    "
                  >
                    Pedidos recientes
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    Últimos pedidos
                    registrados.
                  </p>
                </div>

                {stats
                  .recentOrders
                  .length === 0 ? (
                  <div
                    className="
                      px-6
                      py-14
                      text-center
                    "
                  >
                    <ShoppingBag
                      size={38}
                      className="
                        mx-auto
                        text-[#d8b8aa]
                      "
                    />

                    <p
                      className="
                        mt-4
                        font-black
                        text-[#67300E]
                      "
                    >
                      Aún no hay pedidos
                    </p>
                  </div>
                ) : (
                  <div
                    className="
                      divide-y
                      divide-[#f3e7e2]
                    "
                  >
                    {stats
                      .recentOrders
                      .map(
                        order => (
                          <button
                            key={
                              order.id
                            }
                            type="button"
                            onClick={() =>
                              onOpenOrder?.(
                                order
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              justify-between
                              gap-4
                              px-5
                              py-5
                              text-left
                              transition
                              hover:bg-[#fffaf8]
                              sm:px-6
                            "
                          >
                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >
                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >
                                <p
                                  className="
                                    font-black
                                    text-[#67300E]
                                  "
                                >
                                  {
                                    order.order_number
                                  }
                                </p>

                                <StatusBadge
                                  value={
                                    order.payment_status
                                  }
                                />

                                <StatusBadge
                                  value={
                                    order.order_status
                                  }
                                />
                              </div>

                              <p
                                className="
                                  mt-2
                                  truncate
                                  text-sm
                                  font-bold
                                  text-[#67300E]
                                "
                              >
                                {
                                  order.customer_name
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-[#8f654d]
                                "
                              >
                                Entrega:{' '}
                                {
                                  order.delivery_date
                                }
                                {' · '}
                                {
                                  order.delivery_time
                                }
                              </p>
                            </div>

                            <div
                              className="
                                flex
                                shrink-0
                                items-center
                                gap-3
                              "
                            >
                              <span
                                className="
                                  font-black
                                  text-[#67300E]
                                "
                              >
                                $
                                {Number(
                                  order.total
                                ).toFixed(2)}
                              </span>

                              <ChevronRight
                                size={19}
                                className="
                                  text-[#8f654d]
                                "
                              />
                            </div>
                          </button>
                        )
                      )}
                  </div>
                )}
              </section>
            </>
          )}
      </main>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  background,
}) {
  return (
    <div
      className="
        rounded-[26px]
        bg-white
        p-5
        shadow-sm
        ring-1
        ring-black/5
      "
    >
      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          text-[#67300E]
          ${background}
        `}
      >
        {icon}
      </div>

      <p
        className="
          mt-5
          text-sm
          text-[#8f654d]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-3xl
          font-black
          text-[#67300E]
        "
      >
        {value}
      </p>
    </div>
  )
}
