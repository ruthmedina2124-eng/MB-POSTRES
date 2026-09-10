import { supabase } from '../lib/supabase'

export async function createOrder({
  cart,
  orderData,
}) {
  const items = cart.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
  }))

  const {
    data,
    error,
  } = await supabase.rpc(
    'create_mb_order',
    {
      p_customer_name:
        orderData.name,

      p_customer_phone:
        orderData.phone,

      p_customer_email:
        orderData.email || null,

      p_delivery_type:
        orderData.deliveryType,

      p_delivery_date:
        orderData.deliveryDate,

      p_delivery_time:
        orderData.deliveryTime,

      p_delivery_address:
        orderData.deliveryType ===
        'delivery'
          ? orderData.address
          : null,

      p_delivery_reference:
        orderData.deliveryType ===
        'delivery'
          ? orderData.reference
          : null,

      p_notes:
        orderData.notes || null,

      p_items: items,
    }
  )

  if (error) {
    throw error
  }

  return data
}

export async function uploadReceipt({
  orderId,
  orderNumber,
  file,
}) {
  if (!file) {
    throw new Error(
      'No se seleccionó comprobante'
    )
  }

  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() || 'jpg'

  const uniquePart =
    crypto.randomUUID()

  const filePath =
    `${orderId}/${orderNumber}-${uniquePart}.${extension}`

  const {
    error: uploadError,
  } = await supabase
    .storage
    .from('payment-receipts')
    .upload(
      filePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      }
    )

  if (uploadError) {
    throw uploadError
  }

  return filePath
}

export async function attachReceipt({
  orderId,
  receiptPath,
}) {
  const {
    error,
  } = await supabase.rpc(
    'attach_mb_receipt',
    {
      p_order_id: orderId,
      p_receipt_path: receiptPath,
    }
  )

  if (error) {
    throw error
  }
}

export async function createCompleteOrder({
  cart,
  orderData,
  receipt,
}) {
  const order =
    await createOrder({
      cart,
      orderData,
    })

  try {
    const receiptPath =
      await uploadReceipt({
        orderId: order.id,
        orderNumber:
          order.order_number,
        file: receipt,
      })

    await attachReceipt({
      orderId: order.id,
      receiptPath,
    })

    return {
      ...order,
      receipt_path: receiptPath,
    }
  } catch (error) {
    console.error(
      'Pedido creado pero ocurrió un error con el comprobante:',
      error
    )

    throw new Error(
      `El pedido ${order.order_number} fue creado, pero no se pudo guardar el comprobante. No vuelvas a confirmar el pedido; contacta a MB Postres indicando este número.`
    )
  }
}