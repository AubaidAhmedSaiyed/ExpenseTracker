import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const FRANKFURTER = 'https://api.frankfurter.app/latest'
/** Frankfurter (ECB) omits AED; merge from open.er-api public feed when needed. */
const OPEN_ER = 'https://open.er-api.com/v6/latest/USD'

/**
 * Fetches FX rates with USD as base.
 * `rates[currency]` = units of `currency` per 1 USD.
 */
export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [frRes, openRes] = await Promise.allSettled([
        axios.get(FRANKFURTER, {
          params: { from: 'USD', to: 'INR,EUR,GBP' },
          timeout: 12_000,
        }),
        axios.get(OPEN_ER, { timeout: 12_000 }),
      ])

      const merged = {}

      if (frRes.status === 'fulfilled' && frRes.value.data?.rates) {
        Object.assign(merged, frRes.value.data.rates)
      }

      /** Open ER returns `rates` (v6); older examples used `conversion_rates`. */
      const openData = openRes.status === 'fulfilled' ? openRes.value.data : null
      const openRates = openData?.rates ?? openData?.conversion_rates
      if (openRates && typeof openRates === 'object') {
        for (const code of ['INR', 'EUR', 'GBP', 'AED']) {
          const v = openRates[code]
          if (typeof v === 'number' && Number.isFinite(v) && merged[code] == null) {
            merged[code] = v
          }
        }
      }

      if (Object.keys(merged).length === 0) {
        throw new Error('No exchange rates returned.')
      }

      setRates(merged)
      if (frRes.status === 'rejected' && openRes.status === 'rejected') {
        setError('Unable to load exchange rates.')
      } else {
        setError(null)
      }
    } catch (e) {
      setRates(null)
      setError(
        e?.response?.status
          ? `Rates unavailable (HTTP ${e.response.status}).`
          : 'Unable to reach the exchange-rate service.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  const convertFromUsd = useCallback(
    (amountUsd, currency) => {
      if (!Number.isFinite(amountUsd)) return 0
      if (currency === 'USD') return amountUsd
      const r = rates?.[currency]
      if (!r) return null
      return amountUsd * r
    },
    [rates],
  )

  return { rates, loading, error, refetch: fetchRates, convertFromUsd }
}
