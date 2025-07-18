'use client'

import { motion } from 'framer-motion'
import { School } from 'lucide-react'

export const SchoolPageContent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-5 bg-[#0F0F15]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#101c13] via-[#0F0F15] to-[#1a2e1a] rounded-3xl p-8 shadow-2xl border border-[#75BE40]/30 overflow-hidden relative"
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(117,190,64,0.15) 0%, transparent 70%)'}} />
          <div className="flex items-start mb-8 relative z-10 justify-center text-center">
            <div>
              <div className="flex items-baseline flex-wrap justify-center gap-2">
                <span className="school-title-word text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#75BE40] via-yellow-300 to-yellow-300 drop-shadow-[0_0_16px_#75BE40cc]">Обучение</span>
                <span className="school-title-word text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-[#00FFD0] drop-shadow-[0_0_16px_#75BE40cc]">P2P-арбитражу</span>
              </div>
              <div>
                <span className="school-title-word text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#75BE40] via-yellow-300 to-[#00FFD0] drop-shadow-[0_0_16px_#75BE40cc]">от CryptoZor</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-white"
          >
            <p className="text-lg leading-relaxed">
              Хочешь зарабатывать на криптовалюте стабильно и уже через неделю после старта?<br/>
              Мы научим тебя P2P-арбитражу — с нуля до первых денег!
            </p>

            <div className="my-6 border-t border-[#75BE40]/30" />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#75BE40]">Что ты получаешь:</h2>
              <ul className="space-y-3 text-white/90">
                <li><b>Реальный заработок уже через 7 дней</b><br/>Только практические схемы, которые работают прямо сейчас.</li>
                <li><b>Онлайн-уроки в реальном времени</b><br/>Уроки проходят вживую, без записей — ты можешь задать вопрос прямо на занятии.</li>
                <li><b>Обучающие аккаунты на биржах</b><br/>Во время обучения мы выдаём тебе готовые аккаунты для отработки навыков.</li>
                <li><b>Поддержка 2 месяца после обучения</b><br/>После окончания курса мы остаёмся с тобой — отвечаем на все вопросы, помогаем с разбором сделок и ситуаций.</li>
              </ul>
            </div>

            <div className="my-6 border-t border-[#75BE40]/30" />

            <div>
              <h2 className="text-xl font-semibold text-[#75BE40] mb-2">Для кого это:</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/90">
                <li>Для новичков, которые хотят зарабатывать на крипте без вложений в торговлю</li>
                <li>Для тех, кто уже пробовал, но не получалось</li>
                <li>Для всех, кто хочет выйти на доход от 15.000₽ до 40.000₽ в неделю</li>
              </ul>
            </div>

            <motion.a
              href="https://t.me/shakhnazzarov"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center mt-4 px-6 py-3 bg-gradient-to-r from-[#00FFD0] via-[#75BE40] to-[#FFD600] text-[#0F0F15] font-semibold rounded-lg shadow-lg border-none hover:shadow-[0_0_24px_#75BE40cc] transition-all duration-300 cursor-pointer"
            >
              Проконсультироваться с нами
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}