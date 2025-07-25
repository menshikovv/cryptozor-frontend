'use client'

import Image from 'next/image'
import { Badge } from '@/app/shared/ui/badge'
import {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useEffect,
} from 'react'
import BlockRenderer from '@/app/shared/ui/block-render'
import dayjs from 'dayjs'
import { Button } from '@/app/shared/ui/button'
import 'dayjs/locale/ru'
import { Icons } from '@/app/shared/ui/icons'
import { BASE_URL } from '@/app/shared/config'
import { cn } from '@/app/shared/libs'
import { Article } from '@/app/shared/types'
import { Reactions } from '@/app/widgets/articles/reactions'
import { AnimatePresence, motion } from 'motion/react'
import { Eye } from 'lucide-react'
import { useMediaQuery, useClipboard } from '@siberiacancode/reactuse'
import { useUserId } from '@/app/shared/hooks/useUserId'
import Link from 'next/link'

dayjs.locale('ru')

const ALL_REACTIONS = [
  { title: 'cart', icon: '/emoji/cart.png' },
  { title: 'cup', icon: '/emoji/cup.png' },
  { title: 'eyes', icon: '/emoji/eyes.png' },
  { title: 'fire', icon: '/emoji/fire.png' },
  { title: 'handlove', icon: '/emoji/handlove.png' },
  { title: 'handshake', icon: '/emoji/handshake.png' },
  { title: 'like', icon: '/emoji/like.png' },
  { title: 'lock', icon: '/emoji/lock.png' },
  { title: 'love-shape', icon: '/emoji/love-shape.png' },
  { title: 'medal-1', icon: '/emoji/medal-1.png' },
  { title: 'medal-2', icon: '/emoji/medal-2.png' },
  { title: 'medal-3', icon: '/emoji/medal-3.png' },
  { title: 'mentup', icon: '/emoji/cryptozor.png' },
  { title: 'percent', icon: '/emoji/percent.png' },
  { title: 'rocket', icon: '/emoji/rocket.png' },
  { title: 'shield', icon: '/emoji/shield.png' },
  { title: 'smile-cash', icon: '/emoji/smile-cash.png' },
  { title: 'smile-confusion', icon: '/emoji/smile-confusion.png' },
  { title: 'smile-glasses', icon: '/emoji/smile-glasses.png' },
  { title: 'smile-hide', icon: '/emoji/smile-hide.png' },
  { title: 'smile-joy', icon: '/emoji/smile-joy.png' },
  { title: 'smile-party', icon: '/emoji/smile-party.png' },
  { title: 'smile-sadness', icon: '/emoji/smile-sadness.png' },
  { title: 'smile-tired', icon: '/emoji/smile-tired.png' },
  { title: 'star', icon: '/emoji/star.png' },
  { title: 'world', icon: '/emoji/world.png' },
]

type ArticleContentProps = {
  article: Article
  reactions: any[]
  containerRef: any
  views: any
}

export const ArticleContent: FC<ArticleContentProps> = ({
  article,
  reactions,
  containerRef,
  views,
}) => {
  const [copied, setCopied] = useState(false)
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 })
  const userId = useUserId()

  const [localReactions, setLocalReactions] = useState<any[]>([])

  useEffect(() => {
    setLocalReactions(reactions)
  }, [reactions])

  const formattedDate = useMemo(() => {
    return dayjs(article.createdAt).format('D MMMM YYYY года, в HH:mm')
  }, [article.createdAt])

  const totalViews = useMemo(() => {
    return Number(views?.organic_views) + Number(views?.boosted_views)
  }, [views])

  useLayoutEffect(() => {
    const updateBarStyle = () => {
      if (containerRef.current) {
        const { left, width } = containerRef.current.getBoundingClientRect()
        setBarStyle({ left, width })
      }
    }

    updateBarStyle()
    window.addEventListener('resize', updateBarStyle)
    return () => window.removeEventListener('resize', updateBarStyle)
  }, [])

  useEffect(() => {
    const merged = ALL_REACTIONS.map((reaction) => {
      const existing = reactions.find((r) => r.title === reaction.title)
      return (
        existing ?? {
          title: reaction.title,
          documentId: null,
          organic_count: '0',
          boosted_count: '0',
          icon: reaction.icon,
        }
      )
    })
    setLocalReactions(merged)
  }, [reactions])

  const { copy } = useClipboard()

  const handleShareClick = useCallback(() => {
    const url = `${window.location.origin}/article/${article.slug}`

    copy(url).then(() => {
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1000)
    })
  }, [article.slug])

  const updateReaction = async (reactionId: string, newCount: number) => {
    try {
      const reaction = localReactions.find((r) => r.documentId === reactionId)
      if (!reaction || !userId) return

      const userAlreadyReacted = reaction.userIds?.includes(userId)

      if (userAlreadyReacted) return

      const updatedUserIds = [...(reaction.userIds || []), userId]

      setLocalReactions((prev) =>
        prev.map((r) =>
          r.documentId === reactionId
            ? {
                ...r,
                organic_count: String(newCount),
                userIds: updatedUserIds,
              }
            : r,
        ),
      )

      await fetch(`/api/reactions/${reactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reaction_id: reactionId,
          organic_count: newCount,
          userIds: updatedUserIds,
        }),
      })
    } catch (error) {
      console.error('Error updating reaction:', error)
    }
  }

  const createReaction = async (
    reactionId: string,
    newCount: number,
    title: string,
  ) => {
    try {
      if (!userId) return

      const response = await fetch(`/api/reactions/${article.documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organic_count: newCount,
          title,
          boosted_count: 0,
          userIds: [userId],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLocalReactions((prev) =>
          prev.map((r) =>
            r.title === title
              ? {
                  ...r,
                  documentId: data.data.documentId,
                  organic_count: String(newCount),
                  userIds: [userId],
                }
              : r,
          ),
        )
      }
    } catch (error) {
      console.error('Error creating reaction:', error)
    }
  }

  const removeReaction = async (reactionId: string) => {
    try {
      if (!userId) return

      const reaction = localReactions.find((r) => r.documentId === reactionId)
      if (!reaction) return

      const updatedUserIds =
        reaction.userIds?.filter((id: string) => id !== userId) || []
      const newCount = updatedUserIds.length

      const response = await fetch(`/api/reactions/${reactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reaction_id: reactionId,
          organic_count: newCount,
          userIds: updatedUserIds,
        }),
      })

      if (response.ok) {
        setLocalReactions((prev) =>
          prev.map((r) =>
            r.documentId === reactionId
              ? {
                  ...r,
                  organic_count: String(newCount),
                  userIds: updatedUserIds,
                }
              : r,
          ),
        )
      }
    } catch (error) {
      console.error('Error removing reaction:', error)
    }
  }

  const handleReactionUpdate = (updatedReactions: any[]) => {
    setLocalReactions(updatedReactions)
  }

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div
      ref={containerRef}
      className="tablet-small:rounded-t-2xl tablet-small:min-h-[calc(100dvh-80px-20px-36px)] relative flex flex-col overflow-hidden rounded-2xl bg-white/5"
    >
      <div className="tablet-small:p-6 flex flex-col gap-5 p-4 pb-24">
        <div className="flex flex-wrap items-center gap-1">
          {article.tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge icon={BASE_URL + (tag.icon?.url || '')}>
                {tag.title}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="tablet-small:text-2xl text-xl font-semibold text-wrap break-all text-white uppercase">
          {article.title}
        </h1>

        <div className="article-content flex flex-col gap-5 font-medium">
          <BlockRenderer content={article.content} />
        </div>
        {article?.button?.title && (
          <Link href={article?.button?.link}>
            <Button
              className={
                'bg-gradient-to-r from-[#1B3A1B] via-[#2e4319] to-[#0F2911] text-white font-semibold hover:scale-105 transition-transform border-2 border-[#2e4319] shadow-lg hover:shadow-[0_0_24px_#2e4319cc] w-fit items-center gap-3 text-sm'
              }
              size={'sm'}
              target={'_blank'}
            >
              {article.button.title}
              {article?.button?.icon?.url && (
                <div className="relative">
                  <Image
                    height={20}
                    width={20}
                    alt={article.button.title}
                    src={BASE_URL + article?.button?.icon?.url}
                    className="transition-opacity duration-300"
                  />
                </div>
              )}
            </Button>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {barStyle.width > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ stiffness: 300 }}
            style={{
              left: isMobile ? 'auto' : barStyle.left,
              width: isMobile ? '100%' : barStyle.width,
            }}
            className="tablet-small:px-6 tablet-small:py-4 tablet-small:fixed relative bottom-0 z-50 rounded-t-2xl border-t border-white/10 bg-[#1A1A1F]/80 px-4 py-6 backdrop-blur"
          >
            <div className="tablet-small:gap-2 tablet-small:items-center flex flex-col items-start justify-between gap-6 text-sm text-white">
              <div className="flex w-full flex-row flex-wrap items-center gap-3">
                <Reactions
                  articleId={article.documentId}
                  reactions={localReactions}
                  onReactionUpdate={handleReactionUpdate}
                />
                {localReactions
                  .filter((re) => re.organic_count > 0)
                  .map((reaction) => {
                    const count =
                      Number(reaction.organic_count) +
                      Number(reaction.boosted_count)

                    return (
                      <Button
                        onClick={() => {
                          const userReacted = reaction.userIds?.includes(userId)

                          const userReactionCount = localReactions.filter((r) =>
                            r.userIds?.includes(userId),
                          ).length
                          if (userReactionCount >= 3) {
                            console.warn(
                              'You can only react with up to 3 different reactions',
                            )
                            return
                          }

                          if (userReacted) {
                            removeReaction(reaction.documentId)
                          } else {
                            count === 0
                              ? createReaction(
                                  reaction.documentId,
                                  Number(reaction.organic_count) + 1,
                                  reaction.title,
                                )
                              : updateReaction(
                                  reaction.documentId,
                                  Number(reaction.organic_count) + 1,
                                )
                          }
                        }}
                        key={reaction.title}
                        size="sm"
                        className={cn(
                          'gap-2 rounded-full',
                          reaction.userIds?.includes(userId)
                            ? 'bg-primary'
                            : 'bg-white/10',
                        )}
                      >
                        <Image
                          src={
                            ALL_REACTIONS.find(
                              (a) => a.title === reaction.title,
                            )?.icon || '/emoji/like.png'
                          }
                          width={20}
                          height={20}
                          alt={reaction.title}
                        />

                        {count === 0 ? '' : count}
                      </Button>
                    )
                  })}
              </div>

              <div className="tablet-small:flex-row tablet-small:items-center flex w-full flex-col items-start justify-end gap-4">
                <div className="flex items-center gap-1.5 text-sm text-white/60">
                  {formattedDate} • {totalViews}
                  <Eye className="size-3.5" />
                </div>
                <Button
                  onClick={handleShareClick}
                  size="sm"
                  className={cn(copied && 'bg-white/10', 'gap-2')}
                >
                  {copied ? 'Скопировано' : 'Поделиться статьей'}
                  {!copied && <Icons.Forward className="fill-white" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
