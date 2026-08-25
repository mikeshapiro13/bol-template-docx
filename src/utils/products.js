export const hydrateProducts = (catalogProducts = []) => {
  return catalogProducts.map(p => ({ ...p, included: false, quantity: '', expiration: '' }))
}

export const toPersistentProduct = (product) => ({
  code: product.code || '',
  description: product.description || '',
  canUpc: product.canUpc || '',
  caseUpc: product.caseUpc || '',
  casesPerPallet: Number(product.casesPerPallet) || 0
})
