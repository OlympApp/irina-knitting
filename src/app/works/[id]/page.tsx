import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: work } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single()

  if (!work) notFound()

  return (
    <main style={{ background: '#FAF5EC', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", color: '#1E1612' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --terracotta: #C1432A; --saffron: #E8820C;
          --cream: #FAF5EC; --dark: #1E1612;
          --mid: #6B4F3A; --border: rgba(193,67,42,0.13);
        }
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem 2.5rem;
          background: rgba(250,245,236,0.95); backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-style: italic;
          color: var(--dark); text-decoration: none;
        }
        .nav-logo span { color: var(--terracotta); }
        .back-link {
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--mid); text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--terracotta); }
        .work-page {
          max-width: 1100px; margin: 0 auto;
          padding: 7rem 2.5rem 6rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: start;
        }
        @media (max-width: 768px) {
          .work-page { grid-template-columns: 1fr; gap: 2.5rem; padding: 6rem 1.5rem 4rem; }
        }
        .work-image-wrap {
          border-radius: 1rem; overflow: hidden;
          background: #EDE8E0; position: sticky; top: 6rem;
        }
        .work-image-wrap img { width: 100%; height: auto; display: block; }
        .work-info { padding-top: 1rem; }
        .work-category {
          display: inline-block; font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.2rem 0.75rem; border-radius: 2rem;
          background: rgba(193,67,42,0.1); color: var(--terracotta);
          margin-bottom: 1.25rem;
        }
        .work-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600; line-height: 1.1;
          color: var(--dark); margin-bottom: 2rem;
        }
        .work-divider {
          width: 3rem; height: 2px;
          background: var(--terracotta);
          margin-bottom: 2rem; border: none;
        }
        .work-description {
          font-size: 0.95rem; color: var(--mid);
          line-height: 1.85; margin-bottom: 3rem;
          white-space: pre-wrap;
        }
        .work-meta {
          display: flex; flex-direction: column; gap: 0.75rem;
          padding: 1.5rem; border-radius: 0.75rem;
          background: rgba(193,67,42,0.05);
          border: 1px solid var(--border); margin-bottom: 2.5rem;
        }
        .work-meta-row {
          display: flex; justify-content: space-between;
          font-size: 0.85rem;
        }
        .work-meta-label { color: var(--mid); font-weight: 400; }
        .work-meta-value { color: var(--dark); font-weight: 600; }
        .contact-btn {
          display: inline-block; padding: 0.85rem 2.5rem;
          background: var(--terracotta); color: #fff;
          border-radius: 2rem; font-family: 'Nunito', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          text-decoration: none; letter-spacing: 0.05em;
          transition: background 0.2s, transform 0.2s;
        }
        .contact-btn:hover { background: var(--saffron); transform: translateY(-2px); }
        .footer {
          background: var(--dark); padding: 1.5rem 2.5rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-text { font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(250,245,236,0.3); }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Ирина <span>Сорокина</span></a>
        <Link href="/" className="back-link">← Все работы</Link>
      </nav>

      <div className="work-page">
        <div className="work-image-wrap">
          <Image
            src={work.image_url}
            alt={work.title}
            width={800}
            height={1000}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>

        <div className="work-info">
          {work.category && <span className="work-category">{work.category}</span>}
          <h1 className="work-title">{work.title}</h1>
          <hr className="work-divider" />
          {work.description && <p className="work-description">{work.description}</p>}
          <div className="work-meta">
            <div className="work-meta-row">
              <span className="work-meta-label">Категория</span>
              <span className="work-meta-value">{work.category || '—'}</span>
            </div>
            <div className="work-meta-row">
              <span className="work-meta-label">Мастер</span>
              <span className="work-meta-value">Ирина Сорокина</span>
            </div>
            <div className="work-meta-row">
              <span className="work-meta-label">Техника</span>
              <span className="work-meta-value">Авторское вязание</span>
            </div>
          </div>
          <a href="/#kontakty" className="contact-btn">Написать мастеру →</a>
        </div>
      </div>

      <footer className="footer">
        <span className="footer-text">© 2025 Ирина Сорокина</span>
        <span className="footer-text">Авторское вязание · Ручная работа</span>
      </footer>
    </main>
  )
}