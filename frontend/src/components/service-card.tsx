"use client"

import { useEffect, useState } from "react"

interface ServiceCardProps {
  title: string
  url: string
}

export function ServiceCard({ title, url }: ServiceCardProps) {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        setData(text)
      })
      .catch((err) => {
        setError(err.message ?? "Failed to fetch")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url])

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm">Loading...</span>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">
          Error: {error}
        </p>
      )}
      {data && (
        <p className="font-mono text-sm text-card-foreground">{data}</p>
      )}
    </div>
  )
}
