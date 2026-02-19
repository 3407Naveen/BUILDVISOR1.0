'use client'

import dynamic from 'next/dynamic'

const ImmersiveHome = dynamic(() => import('@/components/home/ImmersiveHome'), { ssr: false })

export default function Home() {
    return <ImmersiveHome />
}
