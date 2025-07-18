import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string): string =>
  dayjs(date).locale('ru').format('dddd D MMMM')