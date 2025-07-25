'use client'

import { motion } from 'framer-motion'
import { DollarSign, BarChart3, TrendingUp, School, Newspaper } from 'lucide-react'
import DisclaimerModal from './DisclaimerModal'

export default function AboutContent() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0F0F15]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-gradient-to-br from-[#101c13] via-[#0F0F15] to-[#1a2e1a] rounded-3xl p-8 shadow-2xl border border-[#75BE40]/30 overflow-hidden relative"
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(117,190,64,0.15) 0%, transparent 70%)'}} />
          <div className="flex flex-wrap items-center mb-8 relative z-10">
            <DollarSign className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_8px_#FFD600cc] mr-4" />
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#75BE40] via-yellow-300 to-[#00FFD0] drop-shadow-[0_0_16px_#75BE40cc]"
            >
              CryptoZor.Ru
            </motion.h1>
            <div
              className="ml-auto mt-4 sm:mt-0 w-full sm:w-auto"
              style={{ maxWidth: '100%', ...(typeof window !== 'undefined' && window.innerWidth <= 356 ? { display: 'flex', justifyContent: 'center' } : {}) }}
            >
              <DisclaimerModal />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-white"
          >
            <p className="text-lg leading-relaxed">
              CryptoZor — это современный новостной портал о криптовалютах, блокчейне и P2P-трейдинге. Здесь собраны самые важные новости, полезные материалы и свежие обновления из криптомира.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#182616] p-6 rounded-xl border border-[#22331A] relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[radial-gradient(circle,_rgba(117,190,64,0.12)_0%,_transparent_80%)] z-0 pointer-events-none" />
                <div className="flex items-center mb-4 relative z-10">
                  <TrendingUp className="h-8 w-8 text-[#75BE40] drop-shadow-[0_0_8px_#75BE40cc] mr-3" />
                  <h3 className="text-xl font-semibold text-white">Криптоновости</h3>
                </div>
                <p className="text-white/90 relative z-10">
                  Главные события: курсы монет, обновления проектов, листинги и тренды.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#182616] p-6 rounded-xl border border-[#22331A] relative overflow-hidden"
              >
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[radial-gradient(circle,_rgba(0,255,208,0.10)_0%,_transparent_80%)] z-0 pointer-events-none" />
                <div className="flex items-center mb-4 relative z-10">
                  <BarChart3 className="h-8 w-8 text-[#FFD600] drop-shadow-[0_0_8px_#FFD600cc] mr-3" />
                  <h3 className="text-xl font-semibold text-white">P2P и трейдинг</h3>
                </div>
                <p className="text-white/90 relative z-10">
                  Гайды, советы, схемы и аналитика — всё, что нужно, чтобы начать зарабатывать на крипте.
                </p>
              </motion.div>
            </div>

            <div className="mt-8 bg-[#182616]/50 p-6 rounded-xl border border-dashed border-[#2e4319] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,214,0,0.07)_0%,_transparent_80%)] z-0 pointer-events-none" />
              <div className="flex items-center mb-4 relative z-10">
                <Newspaper className="h-8 w-8 text-[#75BE40] drop-shadow-[0_0_8px_#75BE40cc] mr-3" />
                <h3 className="text-xl font-semibold text-white">Эксклюзив</h3>
              </div>
              <p className="text-white/90 relative z-10">
                Инсайды, сливы, интервью и разборы новых токенов до их роста.
              </p>
            </div>

            <div className="mt-8 bg-[#182616]/50 p-6 rounded-xl border border-dashed border-[#2e4319] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,255,208,0.07)_0%,_transparent_80%)] z-0 pointer-events-none" />
              <div className="flex items-center mb-4 relative z-10">
                <School className="h-8 w-8 text-[#00FFD0] drop-shadow-[0_0_8px_#00FFD0cc] mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-white">CryptoZor School</h3>
              </div>
              <p className="text-white/90 relative z-10">
                Изучи P2P-арбитраж и начни зарабатывать прямо сейчас.
              </p>
              <motion.a
                href="/school"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center mt-4 px-6 py-3 bg-gradient-to-r from-[#00FFD0] via-[#75BE40] to-[#FFD600] text-[#0F0F15] font-semibold rounded-lg shadow-lg hover:shadow-[0_0_24px_#75BE40cc] transition-all duration-300 cursor-pointer"
              >
                Перейти к обучению
              </motion.a>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <p className="text-lg font-medium text-white drop-shadow-[0_0_8px_#75BE40cc]">
                Присоединяйтесь к нашему крипто комьюнити и будьте в курсе всех событий!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
} 