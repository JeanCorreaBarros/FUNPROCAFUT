"use client"

import { Toaster } from "react-hot-toast"

export default function HotToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#9333ea',
          color: '#fff',
        },
      }}
    />
  )
}
