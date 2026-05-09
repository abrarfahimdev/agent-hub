// ============================================
// ADMIN CONTACTS PAGE
// View and reply to contact form submissions
// ============================================

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

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

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (!error) {
      setContacts(contacts.filter(c => c.id !== id))
      showMessage('🗑️ Deleted!')
    }
  }

  // Save reply to contacts table
  const handleReply = async (contact) => {
    if (!replyMessage.trim()) return
    try {
      setSending(true)

      // Save reply in contacts table
      const { error } = await supabase
        .from('contacts')
        .update({ reply: replyMessage })
        .eq('id', contact.id)

      if (error) throw error

      // Update local state
      setContacts(contacts.map(c =>
        c.id === contact.id ? { ...c, reply: replyMessage } : c
      ))

      setReplyingTo(null)
      setReplyMessage('')
      showMessage('✅ Reply saved!')

    } catch (err) {
      console.error(err)
      showMessage('❌ Error saving reply')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contacts</h1>
        <p>View and reply to contact form submissions</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {loading ? (
        <div className="admin-loading">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="admin-empty">No contacts yet</div>
      ) : (
        <div className="admin-table">
          {contacts.map(contact => (
            <div className="admin-agent-row" key={contact.id}
              style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              {/* Contact Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', gap: '16px' }}>
                <div className="admin-agent-info">
                  <div className="admin-agent-icon" style={{ background: '#f472b620', color: '#f472b6' }}>
                    📧
                  </div>
                  <div>
                    <h4>{contact.name}</h4>
                    <p>{contact.email}</p>
                    <p className="admin-seller">
                      Agent: {contact.agent_name}
                    </p>
                    <p className="admin-seller" style={{ marginTop: '4px', color: 'var(--text-soft)' }}>
                      "{contact.message}"
                    </p>
                    <p className="admin-seller" style={{ marginTop: '4px' }}>
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-actions">
                  <button
                    className="admin-btn feature"
                    onClick={() => {
                      setReplyingTo(contact.id)
                      setReplyMessage(contact.reply || '')
                    }}
                  >
                    💬 Reply
                  </button>
                  <button
                    className="admin-btn delete"
                    onClick={() => deleteContact(contact.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Show existing reply */}
              {contact.reply && replyingTo !== contact.id && (
                <div className="contact-reply-preview">
                  <span>✅ Reply sent:</span>
                  <p>"{contact.reply}"</p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === contact.id && (
                <div className="contact-reply-form">
                  <p className="reply-to">
                    Replying to: <strong>{contact.name}</strong> ({contact.email})
                  </p>
                  <textarea
                    placeholder="Type your reply here..."
                    rows={4}
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    className="reply-textarea"
                  />
                  <div className="reply-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleReply(contact)}
                      disabled={sending || !replyMessage.trim()}
                    >
                      {sending ? 'Saving...' : '✅ Save Reply'}
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyMessage('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts