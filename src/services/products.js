import { supabase } from '../lib/supabase'

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image_url,
      sort_order,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('active', true)
    .eq('available', true)
    .order('sort_order', {
      ascending: true,
    })

  if (error) {
    throw error
  }

  return data.map(product => ({
    ...product,
    price: Number(product.price),
    category:
      product.categories?.name || 'Otros',
    image: product.image_url,
  }))
}