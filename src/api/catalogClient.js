import { toPersistentProduct } from '../utils/products'

const readApiError = async (response) => {
  try {
    const body = await response.json()
    return body.error || `Request failed with status ${response.status}.`
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

export const fetchCatalogs = async () => {
  const response = await fetch('/api/catalogs')
  if (!response.ok) {
    throw new Error(await readApiError(response))
  }
  return response.json()
}

export const addCatalogProduct = async (catalogName, product) => {
  const response = await fetch(`/api/catalogs/${encodeURIComponent(catalogName)}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPersistentProduct(product))
  })

  if (!response.ok) {
    throw new Error(await readApiError(response))
  }

  return response.json()
}

export const deleteCatalogProduct = async (catalogName, index) => {
  const response = await fetch(`/api/catalogs/${encodeURIComponent(catalogName)}/products/${index}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error(await readApiError(response))
  }

  return response.json()
}
