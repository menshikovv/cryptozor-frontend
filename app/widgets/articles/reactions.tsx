import * as Popover from '@radix-ui/react-popover'
import { Button } from '@/app/shared/ui/button'
import Image from 'next/image'
import { Reaction } from '@/app/shared/types'
import { FC, useEffect, useState } from 'react'
import { useUserId } from '@/app/shared/hooks/useUserId'
import { cn } from '@/app/shared/libs'
import { toast } from 'sonner'

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
  { title: 'cryptozor', icon: '/emoji/cryptozor.png' },
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

interface ReactionsProps {
  articleId: string
  reactions: Reaction[]
  onReactionUpdate: (reactions: Reaction[]) => void
}

export const Reactions: FC<ReactionsProps> = ({
  articleId,
  reactions,
  onReactionUpdate,
}) => {
  const userId = useUserId()
  const handleReactionClick = async (reactionTitle: string) => {
    if (!userId) {
      return
    }

    const existingReaction = reactions.find(
      (r) => r.title === reactionTitle && r.documentId !== null,
    )

    const userAlreadyReacted = existingReaction?.userIds?.includes(userId)

    const userReactionsCount = reactions.filter(
      (r) => r.userIds?.includes(userId) && r.documentId !== null,
    ).length

    if (existingReaction) {
      if (userAlreadyReacted) {
        try {
          const updatedUserIds =
            existingReaction.userIds?.filter((id) => id !== userId) || []
          const newCount = updatedUserIds.length

          const response = await fetch(
            `/api/reactions/${existingReaction.documentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reaction_id: existingReaction.documentId,
                organic_count: newCount,
                userIds: updatedUserIds,
              }),
            },
          )

          if (response.ok) {
            const updatedReactions = reactions.map((r) =>
              r.documentId === existingReaction.documentId
                ? {
                    ...r,
                    organic_count: String(newCount),
                    userIds: updatedUserIds,
                  }
                : r,
            )
            onReactionUpdate(updatedReactions)
          }
        } catch (error) {
          console.error('Error removing reaction:', error)
        }
      } else {
        const updatedUserIds = [...(existingReaction.userIds || []), userId]
        const newCount = updatedUserIds.length

        try {
          const response = await fetch(
            `/api/reactions/${existingReaction.documentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reaction_id: existingReaction.documentId,
                organic_count: newCount,
                userIds: updatedUserIds,
              }),
            },
          )

          if (response.ok) {
            const updatedReactions = reactions.map((r) =>
              r.documentId === existingReaction.documentId
                ? {
                    ...r,
                    organic_count: String(newCount),
                    userIds: updatedUserIds,
                  }
                : r,
            )
            onReactionUpdate(updatedReactions)
          }
        } catch (error) {
          console.error('Error updating reaction:', error)
        }
      }
    } else {
      if (userReactionsCount >= 3 && !userAlreadyReacted) {
        toast.error('Максимальное количество реакций (3) уже достигнуто')
        return
      }

      try {
        const response = await fetch(`/api/reactions/${articleId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: reactionTitle,
            organic_count: 1,
            boosted_count: 0,
            userIds: [userId],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const updatedReactions = reactions.map((r) =>
            r.title === reactionTitle
              ? {
                  ...r,
                  documentId: data.data.documentId,
                  organic_count: '1',
                  userIds: [userId],
                }
              : r,
          )
          onReactionUpdate(updatedReactions)
        }
      } catch (error) {
        console.error('Error creating reaction:', error)
      }
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-white/10 pb-0.5 text-base outline-none">
          +
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={'start'}
          className="bg-bg data-[state=open]:animate-in fade-in data-[state=closed]:animate-out fade-out grid w-fit grid-cols-8 gap-2 rounded-xl p-4"
          sideOffset={5}
        >
          {ALL_REACTIONS.map((reaction) => {
            return (
              <Button
                key={reaction.title}
                size="sm"
                onClick={() => handleReactionClick(reaction.title)}
                className={cn(
                  'hover:bg-primary gap-2 rounded-full',
                  reactions.some(
                    (r) =>
                      r.title === reaction.title && r.userIds?.includes(userId),
                  )
                    ? 'bg-primary'
                    : 'bg-white/10',
                )}
              >
                <Image
                  src={reaction.icon || '/emoji/like.png'}
                  width={20}
                  height={20}
                  alt={reaction.title}
                />
              </Button>
            )
          })}
          <Popover.Arrow className="fill-bg" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
