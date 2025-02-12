'use client'
import React from 'react'
import ImageKitImage from '@/app/components/ImageKitImage'

export default function BWProjects() {
  return (
    <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center">
      <div className="relative flex items-center w-80 aspect-[3/4]">
        <ImageKitImage 
          src="default-image.jpg"
          alt="Description de l'image"
          width={800}
          height={600}
          className="object-cover"
        /> 
      </div>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Noir et Blanc</h1>
        <p className="text-lg">Description du projet...</p>
      </div>
    </div>
  )
}