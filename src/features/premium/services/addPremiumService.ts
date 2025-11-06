export async function addPremiumToUser(userId: any) {
  const response = await fetch('/api/premium/add-premium', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to add premium status')
  }

  return response.json()
}