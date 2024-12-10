import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="relative aspect-[3/4]">
          <Image
            src="/images/bw-cover.jpg"
            alt="Image 1"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative aspect-[3/4]">
          <Image
            src="/images/color-cover.jpg"
            alt="Image 2"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  )
}
