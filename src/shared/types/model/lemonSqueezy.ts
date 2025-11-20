interface LemonSqueezyMeta {
  test_mode: boolean
  event_name: string
  custom_data: Record<string, any> | null
}

interface LemonSqueezyAttributes {
  store_id: number
  customer_id: number
  order_id: number
  product_id: number
  variant_id: number
  product_name: string
  variant_name: string
  user_name: string
  user_email: string
  status: string
  status_formatted: string
  card_brand: string
  card_last_four: string
  pause: null | any
  cancelled: boolean
  trial_ends_at: string | null
  billing_anchor: number
  urls: {
    update_payment_method: string
  }
  renews_at: string
  ends_at: string | null
  created_at: string
  updated_at: string
  test_mode: boolean
  custom_data: {
    userId: string
  } | null
}

interface LemonSqueezyData {
  type: string
  id: string
  attributes: LemonSqueezyAttributes
}

export interface LemonSqueezyResponse {
  meta: LemonSqueezyMeta
  data: LemonSqueezyData
}