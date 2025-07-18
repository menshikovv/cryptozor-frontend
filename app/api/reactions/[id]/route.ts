import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const body = await req.json()
    const { title, organic_count, boosted_count, userIds } = body

    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            title,
            organic_count,
            boosted_count,
            userIds,
            article: {
              connect: [{ documentId: id }],
            },
          },
        }),
      },
    )

    if (!updateRes.ok) {
      return new NextResponse(updateRes.statusText, {
        status: updateRes.status,
      })
    }

    const updatedArticle = await updateRes.json()
    return NextResponse.json(updatedArticle)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { reaction_id, organic_count, userIds } = body

    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reactions/${reaction_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            organic_count: String(organic_count),
            userIds,
          },
        }),
      },
    )

    if (!updateRes.ok) {
      return new NextResponse(updateRes.statusText, {
        status: updateRes.status,
      })
    }

    const updatedArticle = await updateRes.json()
    return NextResponse.json(updatedArticle)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
