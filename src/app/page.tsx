import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 0

export default async function Home() {
  const { data: works } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Шапка */}
      <header className="px-6 py-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">Ирина Сорокина</h1>
            <p className="text-stone-500 text-sm mt-1">Одежда, которая отражает вас</p>
          </div>
          <a href="#kontakty" className="text-stone-600 text-sm hover:text-stone-900 transition">
            Связаться
          </a>
        </div>
      </header>

      {/* Галерея */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {!works || works.length === 0 ? (
          <p className="text-center text-stone-400 py-24">Работы скоро появятся</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <Link key={work.id} href={`/works/${work.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={work.image_url}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-stone-800 font-medium">{work.title}</h2>
                    {work.category && (
                      <p className="text-stone-400 text-sm mt-1">{work.category}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Контакты */}
      <section id="kontakty" className="bg-stone-100 py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-stone-800 mb-4">Что-то откликнулось?</h2>
          <p className="text-stone-500 mb-8">Пишите — я читаю всё</p>
          <div className="flex flex-col gap-3 items-center">
            <a href="https://t.me/" className="text-stone-700 hover:text-stone-900 transition">
              Telegram
            </a>
            <a href="mailto:" className="text-stone-700 hover:text-stone-900 transition">
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}