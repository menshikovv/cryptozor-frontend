export interface Tag {
  id: string
  title: string
  icon?: Capture
}

export interface Article {
  slug: string
  title: string
  content: any
  createdAt: string
  publishedAt: string
  updatedAt: string
  button: {
    icon: Capture
    title: string
    link: string
  }
  tags: Tag[]
  id: string
  documentId: string
  organic_views: string
  boosted_views: string
  categories: any[]
  wallpaper?: Capture
  reactions: any[]
}

export interface Capture {
  id: number
  documentId: string
  name: string
  alternativeText: any
  caption: any
  width: number
  height: number
  formats: Formats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Formats {
  large: Large
  small: Small
  medium: Medium
  thumbnail: Thumbnail
}

export interface Large {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: any
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface Small {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: any
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface Medium {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: any
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface Thumbnail {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: any
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface Reaction {
  documentId: string | null
  title: string
  organic_count: string
  boosted_count: string
  icon?: string
  userIds?: string[]
}

export interface SitemapItem {
  url: string
  lastModified: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface Category {
  id: string
  slug: string
  title: string
  description?: string
  updatedAt: string
  publishedAt: string
  createdAt: string
}

export interface Tag {
  id: string
  slug: string
  title: string
  description?: string
  updatedAt: string
  publishedAt: string
  createdAt: string
}