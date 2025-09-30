import { useEffect, useMemo, useState } from 'react'

const VISTAS = {
  home: 'Home',
  tareas: 'Tareas',
  noticias: 'Noticias'
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function App() {
  const [vista, setVista] = useState('home')
  const online = useOnline()
  return (
    <div className="app">
      <header>
        <div className="header-wrap">
          <div className="brand">
            <span className="dot" />
            <span>App Shell PWA</span>
          </div>
          <nav>
            {Object.entries(VISTAS).map(([key, label]) => (
              <button key={key}
                className={vista === key ? 'active' : ''}
                onClick={() => setVista(key)}>
                {label}
              </button>
            ))}
          </nav>
          <div className="status">{online ? '🟢 Online' : '🔴 Offline'}</div>
        </div>
      </header>

      <main>
        <div className="container">
          {vista === 'home' && <Home />}
          {vista === 'tareas' && <Tareas />}
          {vista === 'noticias' && <Noticias online={online} />}
        </div>
      </main>

      <footer>
        <div className="footer-wrap">
          App Shell • PWA • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <section className="card">
      <h2>Bienvenido 👋</h2>
      <p>
        Esta es una PWA con <strong>App Shell</strong>: el header, menú, footer y estilos
        se precargan y quedan en caché gracias al Service Worker. Funciona offline.
      </p>
      <ul>
        <li><strong>Tareas</strong>: ejemplo 100% offline con <code>localStorage</code>.</li>
        <li><strong>Noticias</strong>: EL ejemplo usa fetch; si habia entrado antes carga desde caché.</li>
      </ul>
    </section>
  )
}

function Tareas() {
  const [tareas, setTareas] = useState(() => {
    const raw = localStorage.getItem('tareas')
    return raw ? JSON.parse(raw) : []
  })
  const [texto, setTexto] = useState('')

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  const pendientes = useMemo(() => tareas.filter(t => !t.done).length, [tareas])

  function add(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setTareas(prev => [...prev, { id: crypto.randomUUID(), txt: texto.trim(), done: false }])
    setTexto('')
  }

  function toggle(id) {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function clear() {
    if (confirm('¿Borrar todas las tareas?')) setTareas([])
  }

  return (
    <section className="card">
      <h2>Tareas ({pendientes} pendientes)</h2>
      <form onSubmit={add} className="card" style={{marginTop:12}}>
        <input
          type="text"
          placeholder="Escribe una tarea y presiona Enter…"
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
      </form>
      <div className="list" style={{marginTop:12}}>
        {tareas.map(t => (
          <div className="item" key={t.id} onClick={() => toggle(t.id)} style={{cursor:'pointer'}}>
            <input type="checkbox" readOnly checked={t.done} />{' '}
            <span style={{textDecoration: t.done ? 'line-through' : 'none'}}>{t.txt}</span>
          </div>
        ))}
      </div>
      {tareas.length > 0 && (
        <div style={{marginTop:12}}>
          <button className="btn" onClick={clear}>Limpiar</button>
        </div>
      )}
    </section>
  )
}

function Noticias({ online }) {
  const [posts, setPosts] = useState([])
  const [state, setState] = useState('idle') // idle | loading | error

  async function load() {
    setState('loading')
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      if (!res.ok) throw new Error('Error de red')
      const data = await res.json()
      setPosts(data)
      setState('idle')
    } catch {
      setState('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="card">
      <h2>Noticias (simuladas)</h2>
      <p style={{marginTop:0,color:'var(--muted)'}}>
        {online ? 'Cargando desde la red (si hay)…' : 'Estás offline: si ya visitaste esta vista, verás la versión en caché.'}
      </p>
      {state === 'loading' && <p>Cargando…</p>}
      {state === 'error' && <p>No se pudieron cargar. Intenta de nuevo o revisa tu conexión.</p>}
      <div className="list">
        {posts.map(p => (
          <article className="item" key={p.id}>
            <strong>{p.title}</strong>
            <p style={{margin:0}}>{p.body}</p>
          </article>
        ))}
      </div>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="btn" onClick={load}>Recargar</button>
      </div>
    </section>
  )
}
