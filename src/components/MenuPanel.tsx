 'use client'
import { useState } from 'react'
import Image from 'next/image'
import PaymentPanel from './PaymentPanel'

export default function MenuPanel({ menuItems, paymentQrUrl }: any) {
  const [cart, setCart] = useState<any[]>([])
  const [showPayment, setShowPayment] = useState(false)

  const categories = [...new Set(menuItems.map((i: any) => i.category))] as string[]
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  function addToCart(item: any) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function removeFromCart(itemId: string) {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing?.qty === 1) return prev.filter(i => i.id !== itemId)
      return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i)
    })
  }

  function getQty(itemId: string) {
    return cart.find(i => i.id === itemId)?.qty || 0
  }

  if (showPayment) return (
    <PaymentPanel
      cart={cart}
      total={total}
      paymentQrUrl={paymentQrUrl}
      onBack={() => setShowPayment(false)}
    />
  )

  return (
    <div className="mx-4 pb-32">
      <h2 className="font-semibold text-lg mb-3">Menu</h2>

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {cat}
          </h3>
          {menuItems
            .filter((i: any) => i.category === cat)
            .map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 mb-2 flex items-center gap-3 shadow-sm"
              >
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={56} height={56}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.description && (
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>
                  )}
                  <p className="text-purple-600 font-semibold text-sm mt-1">
                    RM {Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getQty(item.id) > 0 && (
                    <>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full border border-purple-300 text-purple-600 flex items-center justify-center text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {getQty(item.id)}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => addToCart(item)}
                    className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}

      {cart.length > 0 && (
        <button
          onClick={() => setShowPayment(true)}
          className="fixed bottom-4 left-4 right-4 bg-purple-600 text-white py-4 rounded-2xl font-semibold text-center shadow-lg"
        >
          View order · RM {total.toFixed(2)}
        </button>
      )}
    </div>
  )
}
