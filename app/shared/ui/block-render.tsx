'use client'

import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer'

export default function BlockRenderer({
  content,
}: {
  readonly content: BlocksContent
}) {
  if (!content) return null
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          return (
            <div className="relative w-full">
              <img
                src={image.url}
                className="w-full rounded-2xl"
                width={image.width}
                height={image.height}
                alt={image.url}
              />
            </div>
          )
        },
      }}
      modifiers={{
        bold: ({ children }) => <strong>{children}</strong>,
        italic: ({ children }) => <em>{children}</em>,
        underline: ({ children }) => <u>{children}</u>,
        strikethrough: ({ children }) => <s>{children}</s>,
        code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>,
      }}
    />
  )
}
