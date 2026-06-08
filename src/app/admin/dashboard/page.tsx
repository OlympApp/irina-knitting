'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Work } from '@/lib/supabase'

export default function Dashboard() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    const res = await fetch('/api/works')
    const data = await res.json()
    setWorks(data)
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!file || !title) return
    setUploading(true)

    // Загружаем фото в Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const uploadData = await uploadRes.json()

    // Сохраняем работу в Supabase
    await fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        category,
        image_url: uploadData.secure_url,
      }),
    })

    // Сброс формы
    setTitle('')
    setDescription('')
    setCategory('')
    setFile(null)
    setPreview(null)
    setUploading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    fetchWorks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту работу?')) return
    await fetch(`/api/works?id=${id}`, { method: 'DELETE' })
    fetchWorks()
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-serif text-stone-800 mb-8">Мои работы</h1>

        {/* Форма добавления */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-lg font-medium text-stone-700 mb-4">Добавить работу</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Название *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
            />
            <input
              type="text"
              placeholder="Категория (свитер, шапка...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
            />
          </div>

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400 mb-4"
          />

          {/* Загрузка фото */}
          <label className="block border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-stone-400 transition mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {preview ? (
              <div className="relative w-32 h-40 mx-auto rounded-lg overflow-hidden">
                <Image src={preview} alt="preview" fill className="object-cover" />
              </div>
            ) : (
              <p className="text-stone-400">Нажмите чтобы выбрать фото</p>
            )}
          </label>

          {success && (
            <p className="text-green-500 text-sm mb-3">Работа успешно добавлена!</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading || !file || !title}
            className="bg-stone-800 text-white px-6 py-3 rounded-lg text-sm hover:bg-stone-700 transition disabled:opacity-40"
          >
            {uploading ? 'Загружаем...' : 'Добавить работу'}
          </button>
        </div>

        {/* Список работ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-stone-400">Загрузка...</p>
          ) : works.map((work) => (
            <div key={work.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[3/4] w-full">
                <Image src={work.image_url} alt={work.title} fill className="object-cover" />
              </div>
              <div className="p-3 flex justify-between items-center">
                <p className="text-stone-700 text-sm font-medium truncate">{work.title}</p>
                <button
                  onClick={() => handleDelete(work.id)}
                  className="text-red-400 text-xs hover:text-red-600 transition ml-2 shrink-0"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}