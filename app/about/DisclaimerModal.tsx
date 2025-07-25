"use client"

import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import './disclaimer-modal.css'

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 470)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 0 2px #fff, 0 4px 24px #fff2' }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2 border border-white/80 rounded-full text-white font-medium bg-transparent hover:bg-white/10 transition-colors cursor-pointer select-none"
          style={{ letterSpacing: '0.03em' }}
        >
          ДИСКЛЕЙМЕР
        </motion.button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.35 }}
                className={
                  isMobile
                    ? 'fixed bottom-0 left-0 z-[1001] w-full rounded-t-2xl rounded-b-none bg-gradient-to-br from-[#101c13] via-[#0F0F15] to-[#1a2e1a] p-4 shadow-2xl border-t border-[#75BE40]/30 overflow-hidden max-h-[90vh] overflow-y-auto modal-padding'
                    : 'fixed top-16 left-1/2 z-[1001] w-full max-w-md -translate-x-1/2 rounded-2xl bg-gradient-to-br from-[#101c13] via-[#0F0F15] to-[#1a2e1a] p-5 shadow-2xl border border-[#75BE40]/30 overflow-hidden max-h-[80vh] overflow-y-auto modal-padding'
                }
              >
                <Dialog.Close>
                  <button className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors rounded-full p-1.5 bg-black/20 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
                <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(117,190,64,0.12) 0%, transparent 70%)'}} />
                <div className="flex items-center mb-5 relative z-10">
                  <Lock className="h-7 w-7 text-[#FFD600] drop-shadow-[0_0_8px_#FFD600cc] mr-3" />
                  <Dialog.Title asChild>
                    <motion.h1
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD600] via-[#75BE40] to-[#00FFD0] drop-shadow-[0_0_16px_#FFD600cc]"
                    >
                      Дисклеймер / Отказ от ответственности
                    </motion.h1>
                  </Dialog.Title>
                </div>

                <div className="space-y-5 text-white relative z-10 text-sm">
                  <div className="bg-[#182616]/50 p-4 rounded-lg border border-dashed border-[#2e4319] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,214,0,0.07)_0%,_transparent_80%)] z-0 pointer-events-none" />
                    <div className="mb-1 text-base font-semibold text-[#FFD600]">Реквизиты</div>
                    <div className="text-white/90 space-y-0.5">
                      <div>ИП Шахназаров Александр Александрович</div>
                      <div>ИНН: 971518528714</div>
                      <div>ОГРНИП: 325774600454691</div>
                      <div>Телефон: <a href="tel:+79936000104" className="underline hover:text-[#75BE40]">+7(993)600-01-04</a></div>
                      <div>Почта: <a href="mailto:sasha@namnedollar.ru" className="underline hover:text-[#75BE40]">sasha@namnedollar.ru</a></div>
                    </div>
                  </div>

                  <div className="bg-[#182616]/50 p-4 rounded-lg border border-dashed border-[#2e4319] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,255,208,0.07)_0%,_transparent_80%)] z-0 pointer-events-none" />
                    <div className="mb-2 text-base font-bold text-[#75BE40] flex items-center gap-2">
                      <Lock className="h-5 w-5 text-[#FFD600] mr-1" />
                      Дисклеймер
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-white/90 text-sm">
                      <li>Вся информация, размещённая на данном сайте, публикуется исключительно в ознакомительных и информационных целях.</li>
                      <li>Мы не даём инвестиционных, или иных персональных рекомендаций. Материалы, содержащиеся на сайте, не являются призывом к совершению финансовых операций, вложению средств, покупке или продаже криптовалют, токенов, ценных бумаг либо иных активов.</li>
                      <li>Авторы и администрация сайта не несут ответственности за возможные убытки или упущенную выгоду, понесённые в результате использования опубликованной информации, а также за действия третьих лиц.</li>
                      <li>Пользователь принимает на себя полную ответственность за принятие любых решений, связанных с инвестициями, торговлей и использованием криптовалютных инструментов.</li>
                      <li>Перед принятием финансовых решений мы настоятельно рекомендуем обращаться к профессиональным консультантам и изучать риски, связанные с цифровыми активами.</li>
                    </ul>
                  </div>
                </div>
                {isMobile && <div style={{ height: 72 }} />}
                {isMobile && (
                  <Dialog.Close asChild>
                    <button
                      className="fixed left-0 bottom-0 w-full z-[1002] py-4 text-white font-semibold text-lg rounded-t-2xl shadow-2xl active:scale-95 transition-all"
                      style={{
                        background: 'linear-gradient(90deg,rgb(220, 200, 100) 0%,rgb(22, 164, 77) 100%)',
                        boxShadow: '0 0 24px #7C3AED55',
                      }}
                    >
                      Закрыть
                    </button>
                  </Dialog.Close>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
} 