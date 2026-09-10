import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  Check,
  ChevronDown,
  CirclePlus,
  Edit3,
  ImagePlus,
  Package,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import logo from '../../assets/logo-mb-postres.jpeg'

import {
  createCategory,
  createProduct,
  deleteProduct,
  getAdminCategories,
  getAdminProducts,
  removeProductImage,
  updateProduct,
  updateProductImage,
  uploadProductImage,
} from '../../services/admin'

const emptyForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  categoryId: '',
  active: true,
  available: true,
  sortOrder: 0,
  imageUrl: '',
}

export default function AdminProducts({
  onBack,
}) {
  const [
    products,
    setProducts,
  ] = useState([])

  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    form,
    setForm,
  ] = useState(emptyForm)

  const [
    imageFile,
    setImageFile,
  ] = useState(null)

  const [
    imagePreview,
    setImagePreview,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)

  const [
    removingImage,
    setRemovingImage,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    showCategoryForm,
    setShowCategoryForm,
  ] = useState(false)

  const [
    newCategory,
    setNewCategory,
  ] = useState('')

  const [
    creatingCategory,
    setCreatingCategory,
  ] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [
        productData,
        categoryData,
      ] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ])

      setProducts(productData)
      setCategories(categoryData)
    } catch (error) {
      console.error(
        'Error cargando productos:',
        error
      )

      setError(
        error?.message ||
        'No se pudieron cargar los productos.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        )
      }
    }
  }, [imagePreview])

  const filteredProducts =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      if (!value) {
        return products
      }

      return products.filter(
        product =>
          product.name
            ?.toLowerCase()
            .includes(value) ||
          product.category
            ?.toLowerCase()
            .includes(value)
      )
    }, [products, search])

  function updateForm(
    field,
    value
  ) {
    setForm(current => ({
      ...current,
      [field]: value,
    }))
  }

  function clearImageSelection() {
    if (
      imagePreview &&
      imagePreview.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      )
    }

    setImageFile(null)
    setImagePreview('')
  }

  function resetForm() {
    clearImageSelection()
    setForm(emptyForm)
    setMessage('')
    setError('')
  }

  function editProduct(product) {
    clearImageSelection()

    setForm({
      id:
        product.id,

      name:
        product.name || '',

      description:
        product.description || '',

      price:
        String(
          product.price ?? ''
        ),

      categoryId:
        product.category_id || '',

      active:
        Boolean(product.active),

      available:
        Boolean(product.available),

      sortOrder:
        product.sort_order || 0,

      imageUrl:
        product.image_url || '',
    })

    setMessage('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleImageChange(
    event
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        'La imagen debe ser JPG, PNG o WEBP.'
      )

      event.target.value = ''
      return
    }

    const maxSize =
      5 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        'La imagen no puede pesar más de 5 MB.'
      )

      event.target.value = ''
      return
    }

    clearImageSelection()

    setImageFile(file)

    setImagePreview(
      URL.createObjectURL(file)
    )

    setError('')
  }

  async function handleSave(
    event
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const payload = {
        id:
          form.id,

        name:
          form.name,

        description:
          form.description,

        price:
          form.price,

        categoryId:
          form.categoryId ||
          null,

        active:
          form.active,

        available:
          form.available,

        sortOrder:
          form.sortOrder,
      }

      let savedProduct

      if (form.id) {
        savedProduct =
          await updateProduct(
            payload
          )
      } else {
        savedProduct =
          await createProduct(
            payload
          )
      }

      if (imageFile) {
        const uploaded =
          await uploadProductImage({
            productId:
              savedProduct.id,

            file:
              imageFile,
          })

        await updateProductImage({
          productId:
            savedProduct.id,

          imageUrl:
            uploaded.publicUrl,
        })
      }

      await loadData()

      setForm(emptyForm)
      clearImageSelection()

      setMessage(
        form.id
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.'
      )
    } catch (error) {
      console.error(
        'Error guardando producto:',
        error
      )

      setError(
        error?.message ||
        'No se pudo guardar el producto.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(
    product
  ) {
    const confirmed =
      window.confirm(
        `¿Eliminar "${product.name}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(
        product.id
      )

      setError('')
      setMessage('')

      if (product.image_url) {
        try {
          await removeProductImage({
            productId:
              product.id,
          })
        } catch (imageError) {
          console.warn(
            'No se pudo limpiar la imagen del producto:',
            imageError
          )
        }
      }

      await deleteProduct(
        product.id
      )

      if (
        form.id ===
        product.id
      ) {
        resetForm()
      }

      await loadData()

      setMessage(
        'Producto eliminado correctamente.'
      )
    } catch (error) {
      console.error(
        'Error eliminando producto:',
        error
      )

      setError(
        error?.message ||
        'No se pudo eliminar el producto.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function handleRemoveImage() {
    if (!form.id) {
      clearImageSelection()

      setForm(current => ({
        ...current,
        imageUrl: '',
      }))

      return
    }

    const confirmed =
      window.confirm(
        '¿Quitar la imagen de este producto?'
      )

    if (!confirmed) {
      return
    }

    try {
      setRemovingImage(true)
      setError('')

      await removeProductImage({
        productId:
          form.id,
      })

      setForm(current => ({
        ...current,
        imageUrl: '',
      }))

      clearImageSelection()

      await loadData()

      setMessage(
        'Imagen eliminada correctamente.'
      )
    } catch (error) {
      console.error(
        'Error eliminando imagen:',
        error
      )

      setError(
        error?.message ||
        'No se pudo eliminar la imagen.'
      )
    } finally {
      setRemovingImage(false)
    }
  }

  async function handleCreateCategory(
    event
  ) {
    event.preventDefault()

    try {
      setCreatingCategory(
        true
      )
      setError('')

      const category =
        await createCategory({
          name:
            newCategory,
        })

      setNewCategory('')
      setShowCategoryForm(
        false
      )

      await loadData()

      setForm(current => ({
        ...current,
        categoryId:
          category.id,
      }))

      setMessage(
        'Categoría creada correctamente.'
      )
    } catch (error) {
      console.error(
        'Error creando categoría:',
        error
      )

      setError(
        error?.message ||
        'No se pudo crear la categoría.'
      )
    } finally {
      setCreatingCategory(
        false
      )
    }
  }

  const currentImage =
    imagePreview ||
    form.imageUrl

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
                size={19}
              />
            </button>

            <img
              src={logo}
              alt="MB Postres"
              className="
                h-11
                w-11
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
                "
              >
                Productos
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-white
              px-4
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

            <span
              className="
                hidden
                sm:inline
              "
            >
              Actualizar
            </span>
          </button>
        </div>
      </header>

      <main
        className="
          mx-auto
          grid
          max-w-7xl
          gap-7
          px-4
          py-8
          sm:px-6
          lg:grid-cols-[390px_1fr]
          lg:px-8
        "
      >
        <section
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
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
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
                {form.id
                  ? 'Editar'
                  : 'Nuevo'}
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  font-black
                  text-[#67300E]
                "
              >
                {form.id
                  ? 'Editar producto'
                  : 'Crear producto'}
              </h2>
            </div>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#fff1ef]
                  text-[#F04C58]
                "
              >
                <X size={18} />
              </button>
            )}
          </div>

          <form
            onSubmit={
              handleSave
            }
            className="mt-6"
          >
            <FieldLabel>
              Imagen del producto
            </FieldLabel>

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-[#ead7cf]
                bg-[#FFF4E8]
              "
            >
              <div
                className="
                  flex
                  aspect-[4/3]
                  items-center
                  justify-center
                  overflow-hidden
                "
              >
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt="Vista previa"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      text-center
                      text-[#8f654d]
                    "
                  >
                    <ImagePlus
                      size={38}
                      className="mx-auto"
                    />

                    <p
                      className="
                        mt-3
                        text-sm
                        font-bold
                      "
                    >
                      Sin imagen
                    </p>
                  </div>
                )}
              </div>

              <div
                className="
                  grid
                  gap-2
                  border-t
                  border-[#ead7cf]
                  bg-white
                  p-3
                  sm:grid-cols-2
                  lg:grid-cols-1
                  xl:grid-cols-2
                "
              >
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#A9D6D8]
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-[#67300E]
                  "
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  <Upload size={17} />

                  {currentImage
                    ? 'Cambiar foto'
                    : 'Subir foto'}
                </label>

                {currentImage && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      removingImage
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-[#fff1ef]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-[#F04C58]
                      disabled:opacity-50
                    "
                  >
                    {removingImage ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2
                        size={17}
                      />
                    )}

                    Quitar
                  </button>
                )}
              </div>
            </div>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#8f654d]
              "
            >
              JPG, PNG o WEBP. Máximo 5 MB.
              Recomendado: imagen cuadrada o 4:3.
            </p>

            <div className="mt-5">
              <FieldLabel>
                Nombre *
              </FieldLabel>

              <input
                type="text"
                value={form.name}
                onChange={event =>
                  updateForm(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Ej. Cookie Nutella"
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <FieldLabel>
                Descripción
              </FieldLabel>

              <textarea
                value={
                  form.description
                }
                onChange={event =>
                  updateForm(
                    'description',
                    event.target.value
                  )
                }
                rows="3"
                placeholder="Descripción del producto..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div
              className="
                mt-5
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-1
                xl:grid-cols-2
              "
            >
              <div>
                <FieldLabel>
                  Precio *
                </FieldLabel>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.price
                  }
                  onChange={event =>
                    updateForm(
                      'price',
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>
                  Orden
                </FieldLabel>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    form.sortOrder
                  }
                  onChange={event =>
                    updateForm(
                      'sortOrder',
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <FieldLabel>
                  Categoría
                </FieldLabel>

                <button
                  type="button"
                  onClick={() =>
                    setShowCategoryForm(
                      current =>
                        !current
                    )
                  }
                  className="
                    text-xs
                    font-bold
                    text-[#F04C58]
                  "
                >
                  + Nueva
                </button>
              </div>

              <div className="relative">
                <select
                  value={
                    form.categoryId
                  }
                  onChange={event =>
                    updateForm(
                      'categoryId',
                      event.target.value
                    )
                  }
                  className={`
                    ${inputClass}
                    appearance-none
                    pr-10
                  `}
                >
                  <option value="">
                    Sin categoría
                  </option>

                  {categories.map(
                    category => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#8f654d]
                  "
                />
              </div>
            </div>

            {showCategoryForm && (
              <div
                className="
                  mt-4
                  rounded-2xl
                  bg-[#FFF4E8]
                  p-4
                "
              >
                <FieldLabel>
                  Nueva categoría
                </FieldLabel>

                <div
                  className="
                    mt-2
                    flex
                    gap-2
                  "
                >
                  <input
                    type="text"
                    value={
                      newCategory
                    }
                    onChange={event =>
                      setNewCategory(
                        event.target.value
                      )
                    }
                    placeholder="Ej. Brownies"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={
                      handleCreateCategory
                    }
                    disabled={
                      creatingCategory
                    }
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#67300E]
                      text-white
                      disabled:opacity-50
                    "
                  >
                    {creatingCategory ? (
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Check
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div
              className="
                mt-5
                space-y-3
              "
            >
              <ToggleRow
                label="Visible en el catálogo"
                checked={
                  form.active
                }
                onChange={value =>
                  updateForm(
                    'active',
                    value
                  )
                }
              />

              <ToggleRow
                label="Disponible para pedidos"
                checked={
                  form.available
                }
                onChange={value =>
                  updateForm(
                    'available',
                    value
                  )
                }
              />
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
                  rounded-2xl
                  bg-green-50
                  p-4
                  text-sm
                  font-bold
                  text-green-800
                "
              >
                {message}
              </div>
            )}

            <button
              type="submit"
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
              ) : form.id ? (
                <Save
                  size={18}
                />
              ) : (
                <CirclePlus
                  size={18}
                />
              )}

              {saving
                ? 'Guardando...'
                : form.id
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </button>
          </form>
        </section>

        <section>
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                Catálogo
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-black
                  text-[#67300E]
                "
              >
                Tus productos
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-[#8f654d]
                "
              >
                {
                  products.length
                } productos registrados
              </p>
            </div>

            <div
              className="
                relative
                w-full
                sm:max-w-xs
              "
            >
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8f654d]
                "
              />

              <input
                type="search"
                value={search}
                onChange={event =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Buscar producto..."
                className={`
                  ${inputClass}
                  pl-11
                `}
              />
            </div>
          </div>

          {loading ? (
            <div
              className="
                flex
                justify-center
                py-20
              "
            >
              <RefreshCw
                size={32}
                className="
                  animate-spin
                  text-[#67300E]
                "
              />
            </div>
          ) : filteredProducts
              .length === 0 ? (
            <div
              className="
                mt-8
                rounded-[28px]
                bg-white
                px-6
                py-16
                text-center
                shadow-sm
                ring-1
                ring-black/5
              "
            >
              <Package
                size={40}
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
                No hay productos
              </p>
            </div>
          ) : (
            <div
              className="
                mt-7
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredProducts.map(
                product => (
                  <article
                    key={
                      product.id
                    }
                    className="
                      overflow-hidden
                      rounded-[26px]
                      bg-white
                      shadow-sm
                      ring-1
                      ring-black/5
                    "
                  >
                    <div
                      className="
                        flex
                        aspect-[16/9]
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[#FFF4E8]
                      "
                    >
                      {product.image_url ? (
                        <img
                          src={
                            product.image_url
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
                            text-5xl
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
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              truncate
                              text-lg
                              font-black
                              text-[#67300E]
                            "
                          >
                            {
                              product.name
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-[#8f654d]
                            "
                          >
                            {
                              product.category
                            }
                          </p>
                        </div>

                        <strong
                          className="
                            whitespace-nowrap
                            text-lg
                            text-[#67300E]
                          "
                        >
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </strong>
                      </div>

                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        <Badge
                          ok={
                            product.active
                          }
                          yes="Visible"
                          no="Oculto"
                        />

                        <Badge
                          ok={
                            product.available
                          }
                          yes="Disponible"
                          no="Agotado"
                        />
                      </div>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            editProduct(
                              product
                            )
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-[#FFF4E8]
                            px-4
                            py-3
                            text-sm
                            font-bold
                            text-[#67300E]
                          "
                        >
                          <Edit3
                            size={17}
                          />

                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-[#fff1ef]
                            px-4
                            py-3
                            text-sm
                            font-bold
                            text-[#F04C58]
                            disabled:opacity-50
                          "
                        >
                          {deletingId ===
                          product.id ? (
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={17}
                            />
                          )}

                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

const inputClass = `
  w-full
  rounded-2xl
  border
  border-[#ead7cf]
  bg-[#fffaf8]
  px-4
  py-3
  text-[#67300E]
  outline-none
  transition
  focus:border-[#A9D6D8]
  focus:ring-2
  focus:ring-[#A9D6D8]/30
`

function FieldLabel({
  children,
}) {
  return (
    <label
      className="
        mb-2
        block
        text-sm
        font-bold
        text-[#67300E]
      "
    >
      {children}
    </label>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-2xl
        bg-[#fffaf8]
        p-4
      "
    >
      <span
        className="
          text-sm
          font-bold
          text-[#67300E]
        "
      >
        {label}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative
          h-7
          w-12
          rounded-full
          transition
          ${
            checked
              ? 'bg-[#67300E]'
              : 'bg-[#d9c8c0]'
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow
            transition
            ${
              checked
                ? 'left-6'
                : 'left-1'
            }
          `}
        />
      </button>
    </div>
  )
}

function Badge({
  ok,
  yes,
  no,
}) {
  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-bold
        ${
          ok
            ? 'bg-green-100 text-green-800'
            : 'bg-[#fff1ef] text-[#F04C58]'
        }
      `}
    >
      {ok ? yes : no}
    </span>
  )
}