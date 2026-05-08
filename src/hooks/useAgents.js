import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ── Fetch all approved agents ──────────────
export const useAgents = (category = null, search = '') => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)

        let query = supabase
          .from('agents')
          .select('*')
          .eq('approved', true)
          .order('featured', { ascending: false })

        if (category && category !== 'All') {
          query = query.eq('category', category)
        }

        const { data, error } = await query
        if (error) throw error

        let result = data || []
        if (search.trim()) {
          const s = search.toLowerCase()
          result = result.filter(a =>
            a.name?.toLowerCase().includes(s) ||
            a.description?.toLowerCase().includes(s) ||
            a.tagline?.toLowerCase().includes(s) ||
            a.tags?.some(t => t.toLowerCase().includes(s))
          )
        }

        setAgents(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [category, search])

  return { agents, loading, error }
}

// ── Fetch featured agents only ─────────────
export const useFeaturedAgents = () => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('approved', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error
        setAgents(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return { agents, loading }
}

// ── Fetch single agent by id ───────────────
export const useAgent = (id) => {
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', id)
          .eq('approved', true)
          .single()

        if (error) throw error
        setAgent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAgent()
  }, [id])

  return { agent, loading, error }
}