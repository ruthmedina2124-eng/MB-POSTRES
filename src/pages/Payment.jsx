import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Copy,
  FileImage,
  Upload,
} from 'lucide-react'

export default function Payment({
  cart,
  subtotal,
  orderData,
  paymentData,
  setPaymentData,
  onBack,
  onContinue,
}) {

  const bankData = {
    bank: 'Banco Pichincha',
    accountType: 'Cuenta de ahorros',
    accountNumber: '2214114289',
    holder: 'María Belen Medina Bocca',
    identification: '1754327458',
  }

  function copyText(text) {
    navigator.clipboard.writeText(text)
  }

  function handleReceipt(event) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ]

    if (
      !allowedTypes.includes(file.type)
    ) {
      alert(
        'Sube una imagen JPG, PNG, WEBP o un archivo PDF.'
      )
      event.target.value = ''
      return
    }

    const maxSize =
      5 * 1024 * 1024

    if (file.size > maxSize) {
      alert(
        'El comprobante no puede pesar más de 5 MB.'
      )
      event.target.value = ''
      return
    }

    setPaymentData({
      receipt: file,
      receiptName: file.name,
    })
  }

  function handleSubmit() {
    if (!paymentData.receipt) {
      alert(
        'Debes subir el comprobante de transferencia.'
      )
      return
    }

    onContinue()
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
              Realiza tu pago
            </h1>

            <p
              className="
                text-sm
                text-[#8f654d]
              "
            >
              Transferencia bancaria
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
          lg:grid-cols-[1fr_350px]
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
            sm:p-7
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
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
              <Banknote size={22} />
            </div>

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
                Transferencia
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-[#67300E]
                "
              >
                Datos bancarios
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#8f654d]
                "
              >
                Realiza la transferencia
                por el total de tu pedido
                y luego sube el comprobante.
              </p>
            </div>
          </div>

          <div
            className="
              mt-7
              rounded-[24px]
              bg-[#FFF4E8]
              p-5
            "
          >
            <div
              className="
                flex
                justify-between
                gap-4
                border-b
                border-[#ead7cf]
                pb-4
              "
            >
              <span
                className="
                  text-sm
                  text-[#8f654d]
                "
              >
                Banco
              </span>

              <strong
                className="
                  text-right
                  text-[#67300E]
                "
              >
                {bankData.bank}
              </strong>
            </div>

            <div
              className="
                flex
                justify-between
                gap-4
                border-b
                border-[#ead7cf]
                py-4
              "
            >
              <span
                className="
                  text-sm
                  text-[#8f654d]
                "
              >
                Tipo de cuenta
              </span>

              <strong
                className="
                  text-right
                  text-[#67300E]
                "
              >
                {bankData.accountType}
              </strong>
            </div>

            <div
              className="
                border-b
                border-[#ead7cf]
                py-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <span
                    className="
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    Número de cuenta
                  </span>

                  <p
                    className="
                      mt-1
                      text-xl
                      font-black
                      tracking-wide
                      text-[#67300E]
                    "
                  >
                    {bankData.accountNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      bankData.accountNumber
                    )
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[#67300E]
                  "
                  aria-label="Copiar cuenta"
                >
                  <Copy size={17} />
                </button>
              </div>
            </div>

            <div
              className="
                flex
                justify-between
                gap-4
                border-b
                border-[#ead7cf]
                py-4
              "
            >
              <span
                className="
                  text-sm
                  text-[#8f654d]
                "
              >
                Titular
              </span>

              <strong
                className="
                  text-right
                  text-[#67300E]
                "
              >
                {bankData.holder}
              </strong>
            </div>

            <div
              className="
                flex
                justify-between
                gap-4
                pt-4
              "
            >
              <span
                className="
                  text-sm
                  text-[#8f654d]
                "
              >
                Cédula / RUC
              </span>

              <strong
                className="
                  text-right
                  text-[#67300E]
                "
              >
                {bankData.identification}
              </strong>
            </div>
          </div>

          <div
            className="
              mt-6
              rounded-[24px]
              bg-[#F7D3CF]
              p-5
              text-center
            "
          >
            <p
              className="
                text-sm
                font-bold
                text-[#8f654d]
              "
            >
              Total a transferir
            </p>

            <p
              className="
                mt-1
                text-4xl
                font-black
                text-[#67300E]
              "
            >
              ${subtotal.toFixed(2)}
            </p>
          </div>

          <div className="mt-8">

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F04C58]
              "
            >
              Comprobante
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                text-[#67300E]
              "
            >
              Sube tu comprobante
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-[#8f654d]
              "
            >
              Puedes subir una imagen
              o PDF de máximo 5 MB.
            </p>

            <label
              className="
                mt-5
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-[24px]
                border-2
                border-dashed
                border-[#dcbeb4]
                bg-[#fffaf8]
                px-5
                py-10
                text-center
                transition
                hover:border-[#A9D6D8]
              "
            >
              <input
                type="file"
                accept="
                  image/jpeg,
                  image/png,
                  image/webp,
                  application/pdf
                "
                onChange={handleReceipt}
                className="hidden"
              />

              {paymentData.receipt ? (
                <>
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#A9D6D8]
                      text-[#67300E]
                    "
                  >
                    <CheckCircle2 size={26} />
                  </div>

                  <p
                    className="
                      mt-4
                      font-black
                      text-[#67300E]
                    "
                  >
                    Comprobante seleccionado
                  </p>

                  <p
                    className="
                      mt-2
                      max-w-full
                      break-all
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    {paymentData.receiptName}
                  </p>

                  <p
                    className="
                      mt-3
                      text-xs
                      font-bold
                      text-[#F04C58]
                    "
                  >
                    Toca aquí para cambiarlo
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FFF4E8]
                      text-[#67300E]
                    "
                  >
                    <Upload size={25} />
                  </div>

                  <p
                    className="
                      mt-4
                      font-black
                      text-[#67300E]
                    "
                  >
                    Seleccionar comprobante
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#8f654d]
                    "
                  >
                    JPG, PNG, WEBP o PDF
                  </p>
                </>
              )}
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
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
            Confirmar pedido
          </button>

        </section>

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
            Pedido de {orderData.name}
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
                <p
                  className="
                    text-sm
                    font-bold
                    text-[#67300E]
                  "
                >
                  {item.quantity} ×{' '}
                  {item.name}
                </p>

                <span
                  className="
                    whitespace-nowrap
                    text-sm
                    font-bold
                    text-[#67300E]
                  "
                >
                  $
                  {(
                    Number(item.price) *
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
              items-center
              justify-between
            "
          >
            <strong
              className="
                text-[#67300E]
              "
            >
              Total
            </strong>

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

          <div
            className="
              mt-5
              rounded-2xl
              bg-[#FFF4E8]
              p-4
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <FileImage
                size={19}
                className="
                  mt-0.5
                  shrink-0
                  text-[#67300E]
                "
              />

              <p
                className="
                  text-xs
                  leading-5
                  text-[#8f654d]
                "
              >
                El pago será verificado
                por MB Postres antes de
                confirmar definitivamente
                el pedido.
              </p>
            </div>
          </div>

        </aside>

      </main>
    </div>
  )
}