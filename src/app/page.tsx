'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Work } from '@/lib/supabase'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'Все работы' },
  { value: 'sviter', label: 'Свитеры' },
  { value: 'shapka', label: 'Шапки' },
  { value: 'zhilet', label: 'Жилеты' },
  { value: 'aksessuary', label: 'Аксессуары' },
  { value: 'другое', label: 'Другое' },
]

export default function Home() {
  const [works, setWorks] = useState<Work[]>([])
  const [filter, setFilter] = useState('all')
  const [visible, setVisible] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/works').then(r => r.json()).then(setWorks)
  }, [])

  const filtered = filter === 'all' ? works : works.filter(w => w.category === filter)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.work-card').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [filtered])

  return (
    <main style={{ background: '#FAF5EC', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", color: '#1E1612' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }

        :root {
          --terracotta: #C1432A;
          --saffron: #E8820C;
          --cream: #FAF5EC;
          --warm-white: #FFFDF8;
          --dark: #1E1612;
          --mid: #6B4F3A;
          --border: rgba(193,67,42,0.13);
        }

        /* NAV */
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
          color: var(--dark); letter-spacing: 0.02em; text-decoration: none;
        }
        .nav-logo span { color: var(--terracotta); }
        .nav-link {
          padding: 0.45rem 1.1rem; background: var(--terracotta); color: #fff;
          border-radius: 2rem; font-family: 'Nunito', sans-serif;
          font-size: 0.82rem; font-weight: 600; text-decoration: none;
          transition: background 0.2s;
        }
        .nav-link:hover { background: var(--saffron); }

        /* INTRO */
        .intro {
          padding: 8rem 2.5rem 3rem;
          max-width: 960px; margin: 0 auto;
          display: flex; align-items: flex-end;
          justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
        }
        .intro-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 5vw, 4.2rem);
          line-height: 1.08; font-weight: 600; color: var(--dark);
        }
        .intro-headline em { color: var(--terracotta); font-style: italic; }
        .intro-sub {
          font-size: 0.92rem; color: var(--mid);
          line-height: 1.8; max-width: 300px; flex-shrink: 0;
        }

        /* FILTERS */
        .filters {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
          padding: 0 2.5rem 2.5rem;
          max-width: 960px; margin: 0 auto;
        }
        .filter-btn {
          padding: 0.38rem 1rem;
          border: 1px solid var(--border);
          background: transparent; color: var(--mid);
          font-family: 'Nunito', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          border-radius: 2rem; cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover, .filter-btn.active {
          background: var(--dark); border-color: var(--dark); color: #fff;
        }

        /* GALLERY */
        .gallery-wrap { padding: 0 2rem 6rem; }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1300px; margin: 0 auto;
      }

        /* CARD */
        .card {
          background: var(--warm-white);
          border-radius: 1rem; overflow: hidden;
          border: 1px solid var(--border);
          cursor: pointer; position: relative;
          display: flex; flex-direction: column;
          transition: transform 0.25s, box-shadow 0.25s, opacity 0.4s, translate 0.4s;
          opacity: 0; translate: 0 20px;
          text-decoration: none; color: inherit;
        }
        .card.visible { opacity: 1; translate: 0 0; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 18px 40px rgba(30,22,18,0.1); }

        .card-featured {
          grid-column: span 2;
          flex-direction: row; align-items: stretch;
        }
        @media (max-width: 700px) {
          .card-featured { grid-column: span 1; flex-direction: column; }
        }
        .card-featured .card-img-wrap { flex: 1.2; }
        .card-featured .card-body { flex: 1; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; }
        .card-featured .card-title { font-size: 1.6rem; }
        .card-featured .card-desc { -webkit-line-clamp: 6; }

        .card-img-wrap { overflow: hidden; background: #EDE8E0; }
        .card-img-wrap img { width: 100%; height: auto; display: block; transition: transform 0.5s; }
        .card:hover .card-img-wrap img { transform: scale(1.04); }

        .card-body { padding: 1.4rem 1.6rem 1.75rem; flex: 1; }
        .card-category {
          display: inline-block; font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 0.18rem 0.65rem; border-radius: 2rem;
          background: rgba(193,67,42,0.1); color: var(--terracotta);
          margin-bottom: 0.65rem;
        }
        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600;
          color: var(--dark); line-height: 1.2;
        }
        .card-desc {
          font-size: 0.85rem; color: var(--mid);
          line-height: 1.7; margin-top: 0.5rem;
          display: -webkit-box; -webkit-box-orient: vertical;
          -webkit-line-clamp: 3; overflow: hidden;
        }
        .card-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--cream); margin-top: 1rem;
          font-size: 1rem; transition: background 0.2s, transform 0.2s;
        }
        .card:hover .card-arrow { background: var(--terracotta); color: #fff; transform: translateX(3px); }

        /* EMPTY */
        .gallery-empty {
          grid-column: 1/-1; text-align: center;
          padding: 5rem 2rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-style: italic; color: #C4A882;
        }

        /* CONTACT */
        .contact {
          background: var(--dark); padding: 6rem 2.5rem;
          text-align: center;
        }
        .contact-eyebrow {
          font-size: 0.7rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--saffron);
          margin-bottom: 1.5rem;
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 400; color: #FAF5EC;
          line-height: 1.2; margin-bottom: 2.5rem;
        }
        .contact-title em { font-style: italic; color: var(--saffron); }
        .contact-links { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
        .contact-link {
          font-size: 0.8rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: #FAF5EC;
          text-decoration: none;
          border: 1px solid rgba(232,130,12,0.4);
          padding: 0.75rem 2rem; border-radius: 2rem;
          transition: all 0.2s;
        }
        .contact-link:hover { background: var(--terracotta); border-color: var(--terracotta); }

        /* FOOTER */
        .footer {
          background: var(--dark);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem 2.5rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-text { font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(250,245,236,0.3); }

        @media (max-width: 600px) {
          .nav { padding: 0.9rem 1.5rem; }
          .intro { padding: 7rem 1.5rem 2rem; }
          .filters { padding: 0 1.5rem 2rem; }
          .gallery-wrap { padding: 0 1rem 4rem; }
          .footer { flex-direction: column; gap: 0.5rem; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          Ирина <span>Сорокина</span>
        </a>
        <a href="#kontakty" className="nav-link">Связаться</a>
      </nav>

      {/* INTRO */}
      <section className="intro">
        <h1 className="intro-headline">
          Одежда,<br />
          которая <em>отражает</em><br />
          вас
        </h1>
<p className="intro-sub">
  Вяжу прежде всего для себя — это моё удовольствие и мой язык. Но иногда вещи находят своих людей, и это делает меня по-настоящему счастливой.
  <br /><br />
  Машинное вязание с программированием · Ручное спицами и крючком · Жаккард · Авторские техники
</p>
      </section>

      {/* FILTERS */}
      <div className="filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`filter-btn${filter === cat.value ? ' active' : ''}`}
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GALLERY */}
      <div className="gallery-wrap">
        <div className="gallery-grid">
          {filtered.length === 0 ? (
            <div className="gallery-empty">
              {works.length === 0 ? 'Работы скоро появятся...' : 'В этой категории пока нет работ'}
            </div>
          ) : (
            filtered.map((work, idx) => (
              <Link
                key={work.id}
                id={work.id}
                href={`/works/${work.id}`}
                className={`card work-card${visible.has(work.id) ? ' visible' : ''}`}                style={{ transitionDelay: `${(idx % 6) * 60}ms` }}
              >
                <div className="card-img-wrap">
                  <Image
                    src={work.image_url}
                    alt={work.title}
                    width={800}
                    height={1000}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="card-body">
                  {work.category && <span className="card-category">{work.category}</span>}
                  <div className="card-title">{work.title}</div>
                  {work.description && <div className="card-desc">{work.description}</div>}
                  <div className="card-arrow">→</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* CONTACT */}
      <section id="kontakty" className="contact">
        <div className="contact-eyebrow">Написать мастеру</div>
        <h2 className="contact-title">
          Что-то <em>откликнулось?</em>
        </h2>
        <div className="contact-links">
          <a href="https://t.me/" className="contact-link">Telegram</a>
          <a href="mailto:" className="contact-link">Email</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-text">© 2025 Ирина Сорокина</span>
        <span className="footer-text">Авторское вязание · Ручная работа</span>
      </footer>

    </main>
  )
}