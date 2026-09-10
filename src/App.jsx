import {
  useEffect,
  useState,
} from 'react'

import {
  ShoppingBag,
  Plus,
  LoaderCircle,
} from 'lucide-react'

import logo from './assets/logo-mb-postres.jpeg'

import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminProducts from './pages/admin/AdminProducts'

import {
  createCompleteOrder,
} from './services/orders'

import {
  getProducts,
} from './services/products'

import {
  checkAdminAccess,
} from './services/admin'

const emptyOrder = {
  name: '',
  phone: '',
  email: '',
  deliveryType: 'pickup',
  deliveryDate: '',
  deliveryTime: '',
  address: '',
  reference: '',
  notes: '',
}

function App() {
  const [category, setCategory] =
    useState('Todos')

  const [page, setPage] =
    useState('menu')

  /*
   * MODO ADMINISTRADOR
   */
  const isAdminPath =
    window.location.pathname
      .startsWith('/admin')

  const [
    adminAuthenticated,
    setAdminAuthenticated,
  ] = useState(false)

  const [
    adminChecking,
    setAdminChecking,
  ] = useState(isAdminPath)

  const [
    adminPage,
    setAdminPage,
  ] = useState('dashboard')

  const [
    selectedAdminOrder,
    setSelectedAdminOrder,
  ] = useState(null)

  /*
   * PRODUCTOS DESDE SUPABASE
   */
  const [products, setProducts] =
    useState([])

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true)

  const [
    productsError,
    setProductsError,
  ] = useState('')

  /*
   * CARRITO
   */
  const [cart, setCart] =
    useState(() => {
      const savedCart =
        localStorage.getItem(
          'mb-postres-cart'
        )

      if (!savedCart) {
        return []
      }

      try {
        return JSON.parse(savedCart)
      } catch {
        return []
      }
    })

  /*
   * DATOS DEL PEDIDO
   */
  const [
    orderData,
    setOrderData,
  ] = useState(() => {
    const savedOrder =
      localStorage.getItem(
        'mb-postres-order'
      )

    if (!savedOrder) {
      return emptyOrder
    }

    try {
      return JSON.parse(savedOrder)
    } catch {
      return emptyOrder
    }
  })

  /*
   * COMPROBANTE
   */
  const [
    paymentData,
    setPaymentData,
  ] = useState({
    receipt: null,
    receiptName: '',
  })

  /*
   * PEDIDO FINALIZADO
   */
  const [
    completedOrder,
    setCompletedOrder,
  ] = useState(null)

  const [
    creatingOrder,
    setCreatingOrder,
  ] = useState(false)

  const [
    orderError,
    setOrderError,
  ] = useState('')

  /*
   * WHATSAPP MB POSTRES
   *
   * Reemplaza con el número real.
   * Ejemplo Ecuador:
   * 0991234567 -> 593991234567
   */
  const whatsappNumber =
    '593987055281'

  /*
   * VALIDAR SESIÓN DEL ADMINISTRADOR
   */
  useEffect(() => {
    if (!isAdminPath) {
      return
    }

    let active = true

    async function validateAdmin() {
      try {
        setAdminChecking(true)

        const allowed =
          await checkAdminAccess()

        if (active) {
          setAdminAuthenticated(
            allowed
          )
        }
      } catch (error) {
        console.error(
          'Error validando sesión admin:',
          error
        )

        if (active) {
          setAdminAuthenticated(false)
        }
      } finally {
        if (active) {
          setAdminChecking(false)
        }
      }
    }

    validateAdmin()

    return () => {
      active = false
    }
  }, [isAdminPath])

  /*
   * CARGAR PRODUCTOS DE SUPABASE
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true)
        setProductsError('')

        const data =
          await getProducts()

        setProducts(data)
      } catch (error) {
        console.error(
          'Error cargando productos:',
          error
        )

        setProductsError(
          'No pudimos cargar el menú. Intenta nuevamente.'
        )
      } finally {
        setLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  /*
   * GUARDAR CARRITO
   */
  useEffect(() => {
    localStorage.setItem(
      'mb-postres-cart',
      JSON.stringify(cart)
    )
  }, [cart])

  /*
   * GUARDAR DATOS DEL PEDIDO
   */
  useEffect(() => {
    localStorage.setItem(
      'mb-postres-order',
      JSON.stringify(orderData)
    )
  }, [orderData])

  /*
   * CATEGORÍAS
   */
  const categories = [
    'Todos',
    ...[
      ...new Set(
        products
          .map(
            product =>
              product.category
          )
          .filter(Boolean)
      ),
    ],
  ]

  /*
   * FILTRAR PRODUCTOS
   */
  const filteredProducts =
    category === 'Todos'
      ? products
      : products.filter(
          product =>
            product.category ===
            category
        )

  /*
   * AGREGAR AL CARRITO
   */
  function addToCart(product) {
    setCart(current => {
      const exists =
        current.find(
          item =>
            item.id === product.id
        )

      if (exists) {
        return current.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
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

  /*
   * CANTIDAD TOTAL
   */
  const itemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  /*
   * SUBTOTAL
   */
  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        item.quantity,
      0
    )

  /*
   * CREAR PEDIDO REAL
   */
  async function handleCreateOrder() {
    if (creatingOrder) {
      return
    }

    if (cart.length === 0) {
      setOrderError(
        'Tu carrito está vacío.'
      )
      return
    }

    if (!paymentData.receipt) {
      setOrderError(
        'Debes seleccionar un comprobante.'
      )
      return
    }

    try {
      setCreatingOrder(true)
      setOrderError('')

      const order =
        await createCompleteOrder({
          cart,
          orderData,
          receipt:
            paymentData.receipt,
        })

      setCompletedOrder(order)
      setPage('confirmation')
    } catch (error) {
      console.error(
        'Error creando pedido:',
        error
      )

      setOrderError(
        error?.message ||
        'No se pudo procesar el pedido.'
      )
    } finally {
      setCreatingOrder(false)
    }
  }

  /*
   * NUEVO PEDIDO
   */
  function handleNewOrder() {
    setCart([])
    setOrderData(emptyOrder)

    setPaymentData({
      receipt: null,
      receiptName: '',
    })

    setCompletedOrder(null)
    setOrderError('')
    setCategory('Todos')

    localStorage.removeItem(
      'mb-postres-cart'
    )

    localStorage.removeItem(
      'mb-postres-order'
    )

    setPage('menu')
  }

  /*
   * ADMINISTRACIÓN
   */
  if (isAdminPath) {
    if (adminChecking) {
      return (
        <div
          className="
            min-h-screen
            bg-[#fffaf8]
            flex
            items-center
            justify-center
            px-4
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-[#F7D3CF]
                border-t-[#67300E]
              "
            />

            <p
              className="
                mt-4
                font-bold
                text-[#67300E]
              "
            >
              Cargando administración...
            </p>
          </div>
        </div>
      )
    }

    if (!adminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setAdminAuthenticated(true)
            setAdminPage('dashboard')
          }}
          onBack={() => {
            window.location.href = '/'
          }}
        />
      )
    }

    if (
      adminPage === 'detail' &&
      selectedAdminOrder
    ) {
      return (
        <AdminOrderDetail
          order={selectedAdminOrder}
          onBack={() => {
            setSelectedAdminOrder(null)
            setAdminPage('dashboard')
          }}
          onUpdated={updatedOrder => {
            setSelectedAdminOrder(
              updatedOrder
            )
          }}
        />
      )
    }

    if (adminPage === 'products') {
      return (
        <AdminProducts
          onBack={() => {
            setAdminPage('dashboard')
          }}
        />
      )
    }

    return (
      <AdminDashboard
        onLogout={() => {
          setAdminAuthenticated(false)
          setSelectedAdminOrder(null)
          setAdminPage('dashboard')
        }}
        onOpenOrder={order => {
          setSelectedAdminOrder(order)
          setAdminPage('detail')
        }}
        onOpenProducts={() => {
          setAdminPage('products')
        }}
      />
    )
  }

  /*
   * PANTALLA CARRITO
   */
  if (page === 'cart') {
    return (
      <Cart
        cart={cart}
        setCart={setCart}
        onBack={() =>
          setPage('menu')
        }
        onContinue={() =>
          setPage('checkout')
        }
      />
    )
  }

  /*
   * PANTALLA DATOS
   */
  if (page === 'checkout') {
    return (
      <Checkout
        cart={cart}
        orderData={orderData}
        setOrderData={setOrderData}
        subtotal={subtotal}
        onBack={() =>
          setPage('cart')
        }
        onContinue={() => {
          setOrderError('')
          setPage('payment')
        }}
      />
    )
  }

  /*
   * PANTALLA PAGO
   */
  if (page === 'payment') {
    return (
      <>
        <Payment
          cart={cart}
          subtotal={subtotal}
          orderData={orderData}
          paymentData={paymentData}
          setPaymentData={
            setPaymentData
          }
          onBack={() => {
            setOrderError('')
            setPage('checkout')
          }}
          onContinue={
            handleCreateOrder
          }
        />

        {creatingOrder && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/40
              px-4
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-full
                max-w-sm
                rounded-[28px]
                bg-white
                p-7
                text-center
                shadow-2xl
              "
            >
              <div
                className="
                  mx-auto
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-[#F7D3CF]
                  border-t-[#67300E]
                "
              />

              <p
                className="
                  mt-5
                  font-black
                  text-[#67300E]
                "
              >
                Registrando tu pedido...
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#8f654d]
                "
              >
                Estamos guardando tu
                pedido y el comprobante.
                No cierres esta página.
              </p>
            </div>
          </div>
        )}

        {orderError && (
          <div
            className="
              fixed
              bottom-5
              left-1/2
              z-[110]
              w-[calc(100%-2rem)]
              max-w-lg
              -translate-x-1/2
              rounded-2xl
              bg-[#67300E]
              p-4
              text-sm
              font-bold
              text-white
              shadow-xl
            "
          >
            {orderError}
          </div>
        )}
      </>
    )
  }

  /*
   * CONFIRMACIÓN
   */
  if (
    page === 'confirmation' &&
    completedOrder
  ) {
    return (
      <Confirmation
        order={completedOrder}
        orderData={orderData}
        cart={cart}
        whatsapp={whatsappNumber}
        onNewOrder={handleNewOrder}
      />
    )
  }

  /*
   * MENÚ
   */
  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        pb-28
        sm:pb-10
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
                sm:h-14
                sm:w-14
              "
            />

            <div>
              <h1
                className="
                  text-lg
                  font-black
                  text-[#67300E]
                "
              >
                MB Postres
              </h1>

              <p
                className="
                  hidden
                  text-xs
                  text-[#8c634d]
                  sm:block
                "
              >
                Un detalle dulce para
                cada momento
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setPage('cart')
            }
            aria-label="Ver carrito"
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
            <ShoppingBag
              size={22}
            />

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
          </button>
        </div>
      </header>

      {/* HERO */}

      <section
        className="
          overflow-hidden
          bg-[#F7D3CF]
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            items-center
            gap-10
            px-4
            py-12
            sm:px-6
            md:grid-cols-2
            md:py-16
            lg:px-8
          "
        >
          <div
            className="
              text-center
              md:text-left
            "
          >
            <span
              className="
                inline-flex
                rounded-full
                bg-white/60
                px-4
                py-2
                text-sm
                font-bold
                text-[#67300E]
              "
            >
              🍪 Hecho con amor
            </span>

            <h2
              className="
                mt-5
                text-4xl
                font-black
                leading-tight
                text-[#67300E]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Un detalle dulce
              <br />
              para cada momento
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-base
                leading-7
                text-[#7f5137]
                md:mx-0
                sm:text-lg
              "
            >
              Galletas, cheesecakes y
              postres preparados para
              hacer especial cualquier
              ocasión.
            </p>

            <a
              href="#menu"
              className="
                mt-7
                inline-flex
                min-h-13
                items-center
                justify-center
                rounded-full
                bg-[#67300E]
                px-7
                font-bold
                text-white
                transition
                hover:scale-105
              "
            >
              Ver nuestro menú
            </a>
          </div>

          <div
            className="
              flex
              justify-center
            "
          >
            <div
              className="
                w-full
                max-w-sm
                rounded-[40px]
                bg-white/35
                p-4
              "
            >
              <img
                src={logo}
                alt="Logo MB Postres"
                className="
                  w-full
                  rounded-[30px]
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* MENÚ */}

      <section
        id="menu"
        className="
          mx-auto
          max-w-7xl
          px-4
          py-12
          sm:px-6
          lg:px-8
        "
      >
        <div className="text-center">
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#F04C58]
            "
          >
            Nuestro menú
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-black
              text-[#67300E]
              sm:text-4xl
            "
          >
            ¿Qué se te antoja?
          </h2>
        </div>

        {/* ESTADO CARGANDO */}

        {loadingProducts && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-[#67300E]
            "
          >
            <LoaderCircle
              size={35}
              className="animate-spin"
            />

            <p
              className="
                mt-4
                font-bold
              "
            >
              Cargando menú...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loadingProducts &&
          productsError && (
            <div
              className="
                mx-auto
                mt-8
                max-w-lg
                rounded-2xl
                bg-[#fff1ef]
                p-5
                text-center
                text-[#67300E]
              "
            >
              <p className="font-black">
                No pudimos cargar
                el menú
              </p>

              <p className="mt-2 text-sm">
                {productsError}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="
                  mt-4
                  rounded-full
                  bg-[#67300E]
                  px-5
                  py-2
                  text-sm
                  font-bold
                  text-white
                "
              >
                Intentar nuevamente
              </button>
            </div>
          )}

        {/* CATÁLOGO */}

        {!loadingProducts &&
          !productsError && (
            <>
              <div
                className="
                  mt-8
                  flex
                  gap-3
                  overflow-x-auto
                  pb-2
                "
              >
                {categories.map(
                  item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(
                          item
                        )
                      }
                      className={`
                        whitespace-nowrap
                        rounded-full
                        px-5
                        py-3
                        text-sm
                        font-bold
                        transition
                        ${
                          category ===
                          item
                            ? 'bg-[#67300E] text-white'
                            : 'bg-white text-[#67300E] ring-1 ring-[#ecd6cf]'
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              {/* SIN PRODUCTOS */}

              {filteredProducts.length ===
                0 && (
                <div
                  className="
                    py-14
                    text-center
                  "
                >
                  <p
                    className="
                      text-lg
                      font-black
                      text-[#67300E]
                    "
                  >
                    No hay productos
                    disponibles
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    Pronto tendremos
                    más postres para ti.
                  </p>
                </div>
              )}

              {/* PRODUCTOS */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {filteredProducts.map(
                  product => (
                    <article
                      key={product.id}
                      className="
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
                      {/* IMAGEN */}

                      <div
                        className="
                          flex
                          aspect-square
                          items-center
                          justify-center
                          overflow-hidden
                          bg-[#FFF4E8]
                        "
                      >
                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <span
                            className="
                              text-7xl
                            "
                          >
                            {product.category ===
                            'Cheesecakes'
                              ? '🍰'
                              : '🍪'}
                          </span>
                        )}
                      </div>

                      <div className="p-5">
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
                            mt-2
                            text-sm
                            leading-5
                            text-[#8f654d]
                          "
                        >
                          {
                            product.description
                          }
                        </p>

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
                            $
                            {Number(
                              product.price
                            ).toFixed(2)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                product
                              )
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
                            <Plus
                              size={18}
                            />

                            Agregar
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            </>
          )}
      </section>

      {/* CARRITO MÓVIL */}

      {itemCount > 0 && (
        <div
          className="
            fixed
            bottom-4
            left-0
            right-0
            z-50
            px-4
            sm:hidden
          "
        >
          <button
            type="button"
            onClick={() =>
              setPage('cart')
            }
            className="
              mx-auto
              flex
              w-full
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
              <ShoppingBag
                size={22}
              />

              <div className="text-left">
                <p
                  className="
                    text-xs
                    text-white/70
                  "
                >
                  {itemCount}{' '}
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
          </button>
        </div>
      )}
    </div>
  )
}

export default App

