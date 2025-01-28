'use client'

import { useRouter } from "next/navigation"
import React from "react"

export default function ErrorPage() {
  const [seconds, setSeconds] = React.useState(3)
  const router = useRouter()
  
  React.useEffect(() => {
    if (seconds === 0) {
      router.push("/")
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds, router])

  return (
    <div className="justify-center items-center flex h-screen text-2xl"> 
      <div>
        Sorry, something went wrong. Redirecting in {seconds}...
      </div>
    </div>
  )
}