export const LEMON_SQUEEZY_CONFIG = {
  storeId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID!,
  monthlyVariantId: process.env.LEMON_SQUEEZY_MONTHLY_VARIANT_ID!,
  yearlyVariantId: process.env.LEMON_SQUEEZY_YEARLY_VARIANT_ID!,
  webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!,
}

export const PRICING = {
  monthly: {
    price: 49.90,
    currency: '₺',
    interval: 'month',
  },
  yearly: {
    price: 399.90,
    currency: '₺',
    interval: 'year',
    discount: '33%',
  },
}