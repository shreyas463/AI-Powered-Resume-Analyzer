'use client'

interface TemplatePlaceholderProps {
  type: 'modern' | 'professional' | 'creative' | 'minimal'
}

export default function TemplatePlaceholder({ type }: TemplatePlaceholderProps) {
  const getLayout = () => {
    switch (type) {
      case 'modern':
        return (
          <div className="w-full h-full flex">
            {/* Sidebar */}
            <div className="w-1/3 h-full bg-blue-600 p-4">
              <div className="bg-white/20 h-8 w-24 mb-4 rounded" />
              <div className="space-y-2">
                <div className="bg-white/20 h-4 w-32 rounded" />
                <div className="bg-white/20 h-4 w-28 rounded" />
                <div className="bg-white/20 h-4 w-36 rounded" />
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-white/20 h-20 w-full rounded" />
                <div className="bg-white/20 h-24 w-full rounded" />
              </div>
            </div>
            {/* Main Content */}
            <div className="w-2/3 p-4 bg-white">
              <div className="space-y-6">
                <div className="bg-gray-200 h-32 w-full rounded" />
                <div className="bg-gray-200 h-40 w-full rounded" />
                <div className="bg-gray-200 h-32 w-full rounded" />
              </div>
            </div>
          </div>
        )
      
      case 'professional':
        return (
          <div className="w-full h-full bg-white p-4">
            {/* Header */}
            <div className="bg-gray-200 h-16 w-full mb-6 rounded" />
            {/* Content */}
            <div className="space-y-6">
              <div className="bg-gray-200 h-24 w-full rounded" />
              <div className="bg-gray-200 h-32 w-full rounded" />
              <div className="bg-gray-200 h-40 w-full rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200 h-24 rounded" />
                <div className="bg-gray-200 h-24 rounded" />
              </div>
            </div>
          </div>
        )

      case 'creative':
        return (
          <div className="w-full h-full bg-emerald-50 p-4">
            {/* Creative Header */}
            <div className="flex gap-4 mb-8">
              <div className="bg-emerald-600 h-20 w-20 rounded-full" />
              <div className="flex-1">
                <div className="bg-emerald-600 h-8 w-48 rounded mb-2" />
                <div className="bg-emerald-600/60 h-4 w-36 rounded" />
              </div>
            </div>
            {/* Creative Content */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                <div className="bg-emerald-600/40 h-32 rounded" />
                <div className="bg-emerald-600/40 h-40 rounded" />
              </div>
              <div className="col-span-4 space-y-4">
                <div className="bg-emerald-600/30 h-24 rounded" />
                <div className="bg-emerald-600/30 h-24 rounded" />
                <div className="bg-emerald-600/30 h-24 rounded" />
              </div>
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className="w-full h-full bg-white p-4">
            {/* Minimal Header */}
            <div className="border-b-2 border-indigo-600 pb-4 mb-8">
              <div className="bg-indigo-600 h-6 w-40 rounded mb-2" />
              <div className="bg-indigo-600/40 h-4 w-32 rounded" />
            </div>
            {/* Minimal Content */}
            <div className="space-y-8">
              <div>
                <div className="bg-indigo-600/20 h-4 w-24 rounded mb-2" />
                <div className="bg-gray-200 h-20 rounded" />
              </div>
              <div>
                <div className="bg-indigo-600/20 h-4 w-28 rounded mb-2" />
                <div className="bg-gray-200 h-32 rounded" />
              </div>
              <div>
                <div className="bg-indigo-600/20 h-4 w-20 rounded mb-2" />
                <div className="bg-gray-200 h-24 rounded" />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
      {getLayout()}
    </div>
  )
}
