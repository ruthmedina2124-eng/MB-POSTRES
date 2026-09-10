import { supabase } from '../lib/supabase'

/*
 * =========================
 * AUTENTICACIÓN ADMIN
 * =========================
 */

export async function adminLogin({
  email,
  password,
}) {
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  const user = data?.user

  if (!user) {
    throw new Error(
      'No se pudo iniciar sesión.'
    )
  }

  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc(
    'is_mb_admin'
  )

  if (adminError) {
    await supabase.auth.signOut()
    throw adminError
  }

  if (!isAdmin) {
    await supabase.auth.signOut()

    throw new Error(
      'Este usuario no tiene permisos de administrador.'
    )
  }

  return data
}

export async function adminLogout() {
  const {
    error,
  } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getAdminSession() {
  const {
    data,
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data?.session || null
}

export async function checkAdminAccess() {
  const session =
    await getAdminSession()

  if (!session) {
    return false
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    'is_mb_admin'
  )

  if (error) {
    console.error(
      'Error validando administrador:',
      error
    )

    return false
  }

  return Boolean(data)
}

/*
 * =========================
 * PEDIDOS
 * =========================
 */

export async function getOrders() {
  const {
    data,
    error,
  } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      delivery_type,
      delivery_date,
      delivery_time,
      delivery_address,
      delivery_reference,
      notes,
      subtotal,
      delivery_fee,
      total,
      payment_status,
      order_status,
      receipt_path,
      created_at
    `)
    .order(
      'created_at',
      {
        ascending: false,
      }
    )

  if (error) {
    throw error
  }

  return data || []
}

export async function getOrderItems(
  orderId
) {
  const {
    data,
    error,
  } = await supabase
    .from('order_items')
    .select(`
      id,
      product_id,
      product_name,
      quantity,
      unit_price,
      subtotal,
      created_at
    `)
    .eq(
      'order_id',
      orderId
    )
    .order(
      'created_at',
      {
        ascending: true,
      }
    )

  if (error) {
    throw error
  }

  return data || []
}

export async function updateOrderStatus({
  orderId,
  paymentStatus,
  orderStatus,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('orders')
    .update({
      payment_status:
        paymentStatus,

      order_status:
        orderStatus,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      orderId
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/*
 * =========================
 * COMPROBANTES
 * =========================
 */

export async function getReceiptSignedUrl(
  receiptPath
) {
  if (!receiptPath) {
    throw new Error(
      'Este pedido no tiene comprobante.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .storage
    .from(
      'payment-receipts'
    )
    .createSignedUrl(
      receiptPath,
      60 * 10
    )

  if (error) {
    throw error
  }

  return data.signedUrl
}

/*
 * =========================
 * DASHBOARD
 * =========================
 */

export async function getDashboardStats() {
  const orders =
    await getOrders()

  const today =
    new Date()
      .toISOString()
      .split('T')[0]

  const pendingPayments =
    orders.filter(
      order =>
        order.payment_status ===
        'pending_verification'
    ).length

  const pendingOrders =
    orders.filter(
      order =>
        order.order_status ===
        'pending'
    ).length

  const todayOrders =
    orders.filter(
      order =>
        order.created_at
          ?.slice(0, 10) === today
    ).length

  return {
    totalOrders:
      orders.length,

    pendingPayments,

    pendingOrders,

    todayOrders,

    recentOrders:
      orders.slice(0, 6),
  }
}

/*
 * =========================
 * CATEGORÍAS
 * =========================
 */

export async function getAdminCategories() {
  const {
    data,
    error,
  } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      sort_order,
      active,
      created_at
    `)
    .order(
      'sort_order',
      {
        ascending: true,
      }
    )
    .order(
      'name',
      {
        ascending: true,
      }
    )

  if (error) {
    throw error
  }

  return data || []
}

export async function createCategory({
  name,
  sortOrder = 0,
}) {
  const cleanName =
    String(name || '').trim()

  if (!cleanName) {
    throw new Error(
      'El nombre de la categoría es obligatorio.'
    )
  }

  const slug =
    cleanName
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )

  const {
    data,
    error,
  } = await supabase
    .from('categories')
    .insert({
      name:
        cleanName,

      slug,

      sort_order:
        Number(sortOrder) || 0,

      active:
        true,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/*
 * =========================
 * PRODUCTOS
 * =========================
 */

export async function getAdminProducts() {
  const {
    data,
    error,
  } = await supabase
    .from('products')
    .select(`
      id,
      category_id,
      name,
      description,
      price,
      image_url,
      active,
      available,
      sort_order,
      created_at,
      updated_at,
      categories (
        id,
        name,
        slug
      )
    `)
    .order(
      'sort_order',
      {
        ascending: true,
      }
    )
    .order(
      'name',
      {
        ascending: true,
      }
    )

  if (error) {
    throw error
  }

  return (
    data?.map(product => ({
      ...product,

      price:
        Number(product.price),

      category:
        product.categories?.name ||
        'Sin categoría',
    })) || []
  )
}

export async function createProduct({
  name,
  description,
  price,
  categoryId,
  active,
  available,
  sortOrder,
}) {
  const cleanName =
    String(name || '').trim()

  if (!cleanName) {
    throw new Error(
      'El nombre del producto es obligatorio.'
    )
  }

  const numericPrice =
    Number(price)

  if (
    Number.isNaN(numericPrice) ||
    numericPrice < 0
  ) {
    throw new Error(
      'El precio ingresado no es válido.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .insert({
      name:
        cleanName,

      description:
        String(
          description || ''
        ).trim() || null,

      price:
        numericPrice,

      category_id:
        categoryId || null,

      active:
        Boolean(active),

      available:
        Boolean(available),

      sort_order:
        Number(sortOrder) || 0,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateProduct({
  id,
  name,
  description,
  price,
  categoryId,
  active,
  available,
  sortOrder,
}) {
  if (!id) {
    throw new Error(
      'Producto inválido.'
    )
  }

  const cleanName =
    String(name || '').trim()

  if (!cleanName) {
    throw new Error(
      'El nombre del producto es obligatorio.'
    )
  }

  const numericPrice =
    Number(price)

  if (
    Number.isNaN(numericPrice) ||
    numericPrice < 0
  ) {
    throw new Error(
      'El precio ingresado no es válido.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .update({
      name:
        cleanName,

      description:
        String(
          description || ''
        ).trim() || null,

      price:
        numericPrice,

      category_id:
        categoryId || null,

      active:
        Boolean(active),

      available:
        Boolean(available),

      sort_order:
        Number(sortOrder) || 0,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      id
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteProduct(
  productId
) {
  if (!productId) {
    throw new Error(
      'Producto inválido.'
    )
  }

  const {
    error,
  } = await supabase
    .from('products')
    .delete()
    .eq(
      'id',
      productId
    )

  if (error) {
    throw error
  }

  return true
}

/*
 * =========================
 * IMÁGENES DE PRODUCTOS
 * =========================
 */

export async function uploadProductImage({
  productId,
  file,
}) {
  if (!productId) {
    throw new Error(
      'Producto inválido.'
    )
  }

  if (!file) {
    throw new Error(
      'Selecciona una imagen.'
    )
  }

  /*
   * Solo permitimos formatos
   * adecuados para el catálogo.
   */
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
    throw new Error(
      'La imagen debe ser JPG, PNG o WEBP.'
    )
  }

  /*
   * Máximo 5 MB.
   */
  const maxSize =
    5 * 1024 * 1024

  if (file.size > maxSize) {
    throw new Error(
      'La imagen no puede pesar más de 5 MB.'
    )
  }

  /*
   * Conservamos la extensión
   * original del archivo.
   */
  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() ||
    'jpg'

  /*
   * Cada producto tiene su
   * propia carpeta.
   *
   * productId/
   *    uuid.jpg
   */
  const filePath =
    `${productId}/${crypto.randomUUID()}.${extension}`

  const {
    error: uploadError,
  } = await supabase
    .storage
    .from('product-images')
    .upload(
      filePath,
      file,
      {
        cacheControl:
          '3600',

        upsert:
          false,

        contentType:
          file.type,
      }
    )

  if (uploadError) {
    throw uploadError
  }

  /*
   * El bucket product-images
   * es público, por lo que
   * obtenemos su URL pública.
   */
  const {
    data,
  } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(
      filePath
    )

  if (!data?.publicUrl) {
    throw new Error(
      'No se pudo obtener la URL pública de la imagen.'
    )
  }

  return {
    filePath,

    publicUrl:
      data.publicUrl,
  }
}

/*
 * Guarda la URL pública
 * dentro de products.image_url.
 */
export async function updateProductImage({
  productId,
  imageUrl,
}) {
  if (!productId) {
    throw new Error(
      'Producto inválido.'
    )
  }

  if (!imageUrl) {
    throw new Error(
      'La URL de la imagen es obligatoria.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .update({
      image_url:
        imageUrl,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      productId
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/*
 * Elimina las imágenes que
 * existan dentro de la carpeta
 * correspondiente al producto.
 */
export async function removeProductImage({
  productId,
}) {
  if (!productId) {
    throw new Error(
      'Producto inválido.'
    )
  }

  const {
    data: files,
    error: listError,
  } = await supabase
    .storage
    .from('product-images')
    .list(
      productId,
      {
        limit: 100,
      }
    )

  if (listError) {
    throw listError
  }

  const paths =
    (files || [])
      .filter(
        item =>
          item.name &&
          item.id
      )
      .map(
        item =>
          `${productId}/${item.name}`
      )

  /*
   * Eliminamos físicamente
   * los archivos del Storage.
   */
  if (paths.length > 0) {
    const {
      error: removeError,
    } = await supabase
      .storage
      .from('product-images')
      .remove(paths)

    if (removeError) {
      throw removeError
    }
  }

  /*
   * Limpiamos image_url
   * en la tabla products.
   */
  const {
    error: updateError,
  } = await supabase
    .from('products')
    .update({
      image_url:
        null,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      productId
    )

  if (updateError) {
    throw updateError
  }

  return true
}