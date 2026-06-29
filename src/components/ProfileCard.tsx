 'use client'
import Image from 'next/image'

export default function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="bg-white rounded-b-3xl shadow-sm pb-6 mb-4">
      <div className="h-32 bg-gradient-to-r from-violet-500 to-purple-600 rounded-b-3xl"/>
      <div className="px-4 -mt-12 flex flex-col items-center text-center">
        {profile.profile_image_url ? (
          <Image
            src={profile.profile_image_url}
            alt={profile.business_name}
            width={80} height={80}
            className="w-20 h-20 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-white bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-700">
            {profile.business_name?.[0]}
          </div>
        )}
        <h1 className="mt-3 text-xl font-semibold">{profile.business_name}</h1>
        <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>
        {profile.phone && (
          <a href={`tel:${profile.phone}`} className="mt-2 text-purple-600 text-sm">
            {profile.phone}
          </a>
        )}
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {profile.instagram && (
            <a href={`https://instagram.com/${profile.instagram}`}
               className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-medium">
              Instagram
            </a>
          )}
          {profile.tiktok && (
            <a href={`https://tiktok.com/@${profile.tiktok}`}
               className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
              TikTok
            </a>
          )}
          {profile.whatsapp && (
            <a href={`https://wa.me/${profile.whatsapp}`}
               className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
              WhatsApp
            </a>
          )}
          {profile.facebook && (
            <a href={`https://facebook.com/${profile.facebook}`}
               className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
