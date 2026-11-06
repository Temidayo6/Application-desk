import { useEffect, useState } from 'react'

const statuses = ['Saved', 'Applied', 'Interview', 'Offer', 'Closed']
const api = '/api/applications'

async function request(url, options = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`)
  }

  return response.status === 204 ? null : response.json()
}

export default function App() {
  const [applications, setApplications] = useState([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    request(api)
      .then(data => {
        if (active) setApplications(data)
      })
      .catch(() => {
        if (active) {
          setError('Could not load applications. Check that the backend is running.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function addApplication(event) {
    event.preventDefault()
    if (busy) return

    if (!company.trim() || !role.trim()) {
      setError('Enter both a company and a role.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const saved = await request(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          status: 'Saved',
        }),
      })

      setApplications(current => [...current, saved])
      setCompany('')
      setRole('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(application, status) {
    if (busy) return
    setBusy(true)
    setError('')

    try {
      const updated = await request(`${api}/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...application, status }),
      })

      setApplications(current =>
        current.map(item => item.id === updated.id ? updated : item)
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteApplication(application) {
    if (busy) return
    if (!window.confirm(`Delete ${application.company} — ${application.role}?`)) {
      return
    }

    setBusy(true)
    setError('')

    try {
      await request(`${api}/${application.id}`, { method: 'DELETE' })
      setApplications(current =>
        current.filter(item => item.id !== application.id)
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const query = search.trim().toLowerCase()
  const visible = applications.filter(application =>
    `${application.company} ${application.role}`.toLowerCase().includes(query)
  )

  return (
    <main>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          color: #20382c;
          background: #f4f7f4;
        }
        main {
          max-width: 850px;
          margin: 0 auto;
          padding: 32px 20px;
        }
        h1 { font-size: 36px; margin-bottom: 8px; }
        h2 { font-size: 22px; }
        form, article {
          background: white;
          padding: 20px;
          border: 1px solid #d5dfd7;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        label { display: block; margin-bottom: 16px; }
        input, select, button { font: inherit; }
        input {
          display: block;
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: 1px solid #aab9ae;
          border-radius: 8px;
          color: #20382c;
          background: white;
        }
        button, select {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #aab9ae;
        }
        button {
          background: #24613a;
          color: white;
          cursor: pointer;
        }
        button:disabled, select:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        .actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .delete { background: white; color: #a12626; }
        .error { color: #a12626; }
        header { margin-bottom: 24px; }
      `}</style>

      <header>
        <h1>Application Desk</h1>
        <p>Your next opportunity starts with a plan.</p>
        {!loading && (
          <p>
            {applications.length}{' '}
            {applications.length === 1 ? 'opportunity' : 'opportunities'} tracked
          </p>
        )}
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <form onSubmit={addApplication}>
        <h2>Add an opportunity</h2>

        <label>
          Company
          <input
            value={company}
            onChange={event => setCompany(event.target.value)}
            placeholder="e.g. Tesla"
            maxLength={200}
            disabled={busy || loading}
            required
          />
        </label>

        <label>
          Role
          <input
            value={role}
            onChange={event => setRole(event.target.value)}
            placeholder="e.g. Software Engineering Intern"
            maxLength={200}
            disabled={busy || loading}
            required
          />
        </label>

        <button disabled={busy || loading} type="submit">
          {busy ? 'Saving…' : 'Save opportunity'}
        </button>
      </form>

      <label>
        Search opportunities
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search company or role"
        />
      </label>

      {loading ? (
        <p role="status">Loading applications…</p>
      ) : (
        <>
          {!error && visible.length === 0 && (
            <p>{query ? 'No matching opportunities.' : 'No opportunities yet.'}</p>
          )}

          {visible.map(application => (
            <article key={application.id}>
              <h2>{application.company}</h2>
              <p>{application.role}</p>

              <div className="actions">
                <select
                  aria-label={`Status for ${application.company} ${application.role}`}
                  value={application.status}
                  onChange={event =>
                    changeStatus(application, event.target.value)
                  }
                  disabled={busy}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <button
                  className="delete"
                  onClick={() => deleteApplication(application)}
                  disabled={busy}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </>
      )}
    </main>
  )
}