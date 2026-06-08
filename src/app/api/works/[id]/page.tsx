import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WorkPage({ params }: { params: { id: string } }) {
  const { data: work } = await supabase
    .from('works')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!work) notFound()

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="px-6 py-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-stone-500 text-sm hover:text-stone-800 transition">
            ← Назад к галерее
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md">
            <Image
              src={work.image_url}
              alt={work.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            {work.category && (
              <p className="text-stone-400 text-sm mb-2">{work.category}</p>
            )}
            <h1 className="text-3xl font-serif text-stone-800 mb-6">{work.title}</h1>
            {work.description && (
              <p className="text-stone-600 leading-relaxed">{work.description}</p>
            )}
            <Link
              href="/#kontakty"
              className="mt-8 inline-block bg-stone-800 text-white px-6 py-3 rounded-lg text-sm hover:bg-stone-700 transition w-fit"
            >
              Написать мастеру
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}