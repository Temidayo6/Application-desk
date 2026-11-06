import { useState } from 'react'

const statuses = ['Saved', 'Applied', 'Interview', 'Offer', 'Closed']

export default function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('application-desk') || '[]'
      )
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  function saveApplications(updated) {
    setApplications(updated)

    try {
      localStorage.setItem('application-desk', JSON.stringify(updated))
      setError('')
    } catch {
      setError('Could not save to this browser. Keep this tab open.')
    }
  }

  function addApplication(event) {
    event.preventDefault()

    if (!company.trim() || !role.trim()) return

    const application = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      status: 'Saved',
    }

    saveApplications([...applications, application])
    setCompany('')
    setRole('')
  }

  function changeStatus(id, status) {
    saveApplications(
      applications.map(application =>
        application.id === id
          ? { ...application, status }
          : application
      )
    )
  }

  function deleteApplication(id) {
    if (!window.confirm('Delete this application?')) return

    saveApplications(
      applications.filter(application => application.id !== id)
    )
  }

  const visibleApplications = applications.filter(application =>
    `${application.company} ${application.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <main>
      <style>{`
        :root {
          font-family: Arial, sans-serif;
          color: #20382c;
          background: #f4f7f4;
          color-scheme: light;
        }
        * { box-sizing: border-box; }
        body { margin: 0; display: block; min-width: 320px; }
        #root { width: 100%; }
        main { max-width: 850px; margin: auto; padding: 32px 20px; }
        h1 { font-size: 36px; margin-bottom: 8px; }
        h2 { font-size: 22px; }
        form, article {
          background: white;
          padding: 20px;
          border: 1px solid #dce5dd;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        label { display: block; margin: 12px 0; }
        input, select, button {
          font: inherit;
          padding: 12px;
          border: 1px solid #bdccbf;
          border-radius: 8px;
        }
        input { display: block; width: 100%; margin-top: 6px; }
        button {
          background: #285b40;
          color: white;
          cursor: pointer;
        }
        select { background: white; color: #20382c; }
        .actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .delete { background: white; color: #a02c2c; }
        .search { margin: 20px 0; }
        .error { color: #a02c2c; }
      `}</style>

      <header>
        <h1>Application Desk</h1>
        <p>Your next opportunity starts with a plan.</p>
        <p>{applications.length} opportunities tracked</p>
      </header>

      <form onSubmit={addApplication}>
        <h2>Add an opportunity</h2>

        <label>
          Company
          <input
            value={company}
            onChange={event => setCompany(event.target.value)}
            placeholder="e.g. Tesla"
            required
          />
        </label>

        <label>
          Role
          <input
            value={role}
            onChange={event => setRole(event.target.value)}
            placeholder="e.g. Software Engineering Intern"
            required
          />
        </label>

        <button type="submit">Save opportunity</button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      <label className="search">
        Search opportunities
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search company or role"
        />
      </label>

      {visibleApplications.length === 0 && (
        <p>No opportunities found. Add one above.</p>
      )}

      {visibleApplications.map(application => (
        <article key={application.id}>
          <h2>{application.company}</h2>
          <p>{application.role}</p>

          <div className="actions">
            <select
              aria-label={`Status for ${application.company}`}
              value={application.status}
              onChange={event =>
                changeStatus(application.id, event.target.value)
              }
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              className="delete"
              onClick={() => deleteApplication(application.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  )
}