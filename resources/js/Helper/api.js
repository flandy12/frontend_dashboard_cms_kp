export const useApiRequest = async (url, method = 'GET', options = {}) => {
  try {
    const fullUrl = `${import.meta.env.VITE_APP_URL}${url}`

    // Default options
    const fetchOptions = {
      method,
      headers: {},
      ...options
    }

    // Kalau ada body dan body bukan string, JSON stringify
    if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
      fetchOptions.body = JSON.stringify(fetchOptions.body)

      // Pastikan header Content-Type ada
      if (!fetchOptions.headers['Content-Type']) {
        fetchOptions.headers['Content-Type'] = 'application/json'
      }
    }

    // Pastikan header tetap dari options.headers
    if (options['Content-Type']) {
      fetchOptions.headers['Content-Type'] = options['Content-Type']
    }
    if (options['Authorization']) {
      fetchOptions.headers['Authorization'] = options['Authorization']
    }

    const response = await fetch(fullUrl, fetchOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('Fetch API error:', error)
    throw error
  }
}
