'use client'

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
        <button
          onClick={() => reset()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
} 