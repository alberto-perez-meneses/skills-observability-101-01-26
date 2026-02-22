"use client"

import { ServiceCard } from "@/components/service-card"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
          Demo Frontend
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <ServiceCard title="Service One Response" url="http://localhost:8081/one" />
          <ServiceCard title="Service Two Response" url="http://localhost:8082/two" />
        </div>
      </div>
    </main>
  )
}
