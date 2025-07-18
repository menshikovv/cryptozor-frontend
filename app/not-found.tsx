'use client'
import { Button } from '@/app/shared/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const [showNotification, setShowNotification] = useState(false)
  const router = useRouter()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('admin@mentup.ru')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const goToHome = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00FFD0] via-[#75BE40] to-[#FFD600] text-[#0F0F15] px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300 font-semibold">
          Email скопирован!
        </div>
      )}

      <div className="rainbow-box-3 bg-[#101c13]/70 p-8 tablet:p-12 max-w-2xl mx-auto border border-[#75BE40]/30">
        <div className="relative mb-8">
          <h1 className="text-8xl tablet:text-9xl font-bold bg-gradient-to-r from-[#00FFD0] via-[#75BE40] to-[#FFD600] bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#75BE40] to-[#00FFD0] rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-[#FFD600] to-[#75BE40] rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <h2 className="text-2xl tablet:text-3xl font-bold text-white mb-4">
          Страница не найдена
        </h2>

        <p className="text-white/70 text-lg tablet:text-xl mb-8 max-w-md mx-auto">
          Похоже, что страница, которую вы ищете, не существует или была перемещена.
        </p>

        <div className="flex flex-col tablet:flex-row gap-4 justify-center items-center">
          <Button
            onClick={goToHome}
            className="bg-gradient-to-r from-[#7C3F00] via-[#B85C00] to-[#FF9900] text-white font-semibold hover:scale-105 transition-transform border-2 border-[#B85C00] shadow-lg hover:shadow-[0_0_24px_#B85C00cc]"
            size="lg"
          >
            Вернуться на главную
          </Button>
          
          <Button
            onClick={goToHome}
            className="bg-gradient-to-r from-[#1B3A1B] via-[#2e4319] to-[#0F2911] text-white font-semibold hover:scale-105 transition-transform border-2 border-[#2e4319] shadow-lg hover:shadow-[0_0_24px_#2e4319cc]"
            size="lg"
          >
            Последние новости
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Если вы считаете, что это ошибка, свяжитесь с нами{' '}
            <br />
            <button
              onClick={copyEmail}
              className="text-[#75BE40] hover:text-[#00FFD0] transition-colors cursor-pointer underline font-semibold"
            >
              admin@mentup.ru
            </button>
          </p>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-[#00FFD0]/20 to-[#75BE40]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-[#FFD600]/20 to-[#00FFD0]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-[#75BE40]/10 to-[#00FFD0]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
} 