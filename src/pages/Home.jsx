import {
  useMemo,
  useState,
} from 'react'

import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import CartBar from '../components/CartBar'

import logo from '../assets/logo-mb-postres.jpeg'

const demoProducts = [
  {
    id: '1',
    name: 'Cookie Nutella',
    description:
      'Galleta suave con relleno cremoso de Nutella.',
    price: 3.00,
    category: 'Galletas',
    image_url:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Cookie Chocolate',
    description:
      'Galleta artesanal con abundantes chips de chocolate.',
    price: 2.50,
    category: 'Galletas',
    image_url:
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Cheesecake Oreo',
    description:
      'Cheesecake cremoso con base y topping de Oreo.',
    price: 18.00,
    category: 'Cheesecakes',
    image_url:
      'https://images.unsplash.com/photo-1567171466295-4afa63d45416?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    name: 'Cheesecake Frutos Rojos',
    description:
      'Cheesecake suave cubierto con frutos rojos.',
    price: 20.00,
    category: 'Cheesecakes',
    image_url:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
  },
]

export default function Home() {

  const categories = [
    'Todos',
    'Galletas',
    'Cheesecakes',
    'Postres',
    'Combos',
  ]

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Todos')

  const products = useMemo(() => {

    if (
      selectedCategory === 'Todos'
    ) {
      return demoProducts
    }

    return demoProducts.filter(
      product =>
        product.category ===
        selectedCategory
    )

  }, [selectedCategory])

  return (
    <div
      className="
        min-h-screen
        pb-28
        sm:pb-10
      "
    >

      <Header />

      <main>

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
              gap-8
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
                  bg-white/70
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-[#67300E]
                "
              >
                🍪 Hecho con amor
              </span>

              <h1
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
                {' '}
                para cada momento
              </h1>

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
                convertir cualquier ocasión
                en algo especial.
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
                  relative
                  w-full
                  max-w-sm
                  rounded-[40px]
                  bg-white/40
                  p-5
                  shadow-sm
                "
              >

                <img
                  src={logo}
                  alt="MB Postres"
                  className="
                    w-full
                    rounded-[30px]
                  "
                />

              </div>

            </div>

          </div>

        </section>

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

          <div
            className="
              text-center
            "
          >

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
              category => (

                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category
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
                      selectedCategory ===
                      category
                        ? `
                          bg-[#67300E]
                          text-white
                        `
                        : `
                          bg-white
                          text-[#67300E]
                          ring-1
                          ring-[#efd7cf]
                        `
                    }
                  `}
                >
                  {category}
                </button>

              )
            )}

          </div>

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

            {products.map(
              product => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              )
            )}

          </div>

        </section>

      </main>

      <CartBar />

    </div>
  )
}