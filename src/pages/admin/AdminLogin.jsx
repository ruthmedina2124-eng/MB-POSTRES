import {
  useState,
} from 'react'

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from 'lucide-react'

import logo from '../../assets/logo-mb-postres.jpeg'

import {
  adminLogin,
} from '../../services/admin'

export default function AdminLogin({
  onLoginSuccess,
  onBack,
}) {
  const [email, setEmail] =
    useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    if (!email.trim()) {
      setError(
        'Ingresa el correo.'
      )

      return
    }

    if (!password) {
      setError(
        'Ingresa la contraseña.'
      )

      return
    }

    try {
      setLoading(true)
      setError('')

      await adminLogin({
        email:
          email.trim(),
        password,
      })

      onLoginSuccess()
    } catch (error) {
      console.error(
        'Error login admin:',
        error
      )

      if (
        error?.message
          ?.toLowerCase()
          .includes(
            'invalid login credentials'
          )
      ) {
        setError(
          'Correo o contraseña incorrectos.'
        )
      } else {
        setError(
          error?.message ||
          'No se pudo iniciar sesión.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        px-4
        py-8
        sm:px-6
      "
    >
      <main
        className="
          mx-auto
          max-w-md
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[32px]
            bg-white
            shadow-xl
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
                shadow-sm
              "
            />

            <p
              className="
                mt-5
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F04C58]
              "
            >
              Administración
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                text-[#67300E]
              "
            >
              MB Postres
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#7f5137]
              "
            >
              Ingresa para gestionar
              pedidos y productos.
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="
              p-6
              sm:p-8
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
                <Mail size={17} />

                Correo
              </label>

              <input
                type="email"
                value={email}
                onChange={event =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
                placeholder="admin@mbpostres.com"
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
                <LockKeyhole
                  size={17}
                />

                Contraseña
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={event =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-[#ead7cf]
                    bg-[#fffaf8]
                    px-4
                    py-3
                    pr-12
                    outline-none
                    transition
                    focus:border-[#A9D6D8]
                    focus:ring-2
                    focus:ring-[#A9D6D8]/30
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      current =>
                        !current
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-9
                    w-9
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    text-[#8f654d]
                  "
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-[#fff1ef]
                  p-4
                  text-sm
                  font-bold
                  text-[#9c392f]
                "
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-[#67300E]
                px-5
                py-4
                font-black
                text-white
                transition
                hover:bg-[#512508]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <div
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn
                    size={19}
                  />

                  Iniciar sesión
                </>
              )}
            </button>

            {onBack && (
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
                Volver al menú
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}