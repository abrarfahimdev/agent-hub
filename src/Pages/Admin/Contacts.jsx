// ============================================
// ADMIN CONTACTS PAGE
// View all contact form submissions
// ============================================

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setContacts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (!error) setContacts(contacts.filter(c => c.id !== id))
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contacts</h1>
        <p>View all contact form submissions</p>
      </div>

      {loading ? (
        <div className="admin-loading">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="admin-empty">No contacts yet</div>
      ) : (
        <div className="admin-table">
          {contacts.map(contact => (
            <div className="admin-agent-row" key={contact.id}>
              <div className="admin-agent-info">
                <div className="admin-agent-icon" style={{ background: '#f472b620', color: '#f472b6' }}>
                  📧
                </div>
                <div>
                  <h4>{contact.name}</h4>
                  <p>{contact.email}</p>
                  <p className="admin-seller">"{contact.message}"</p>
                </div>
              </div>
              <div className="admin-actions">
                
                  href={`mailto:${contact.email}`}
                  className="admin-btn demo"
               <a >
                  📧 Reply
                </a>
                <button
                  className="admin-btn delete"
                  onClick={() => deleteContact(contact.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts