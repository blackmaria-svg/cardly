 'use client'
import Image from 'next/image'

export default function PaymentPanel({ cart, total, paymentQrUrl, onBack }: any) {
  return (
    <div className="mx-4 pb-16">
      <button
        onClick={onBack}
        className="text-purple-600 mb-4 text-sm flex items-center gap-1"
      >
        ← Back to menu
      </button>

      <h2 className="font-semibold text-lg mb-3">Your order</h2>

      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        {cart.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm"
          >
            <span className="text-gray-700">{item.name} × {item.qty}</span>
            <span className="font-medium">RM {(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-semibold text-base">
          <span>Total</span>
          <span className="text-purple-600">RM {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <p className="font-medium text-gray-700 mb-1">Scan to pay</p>
        <p className="text-xs text-gray-400 mb-4">
          Use DuitNow, Touch n Go, or any QR payment app
        </p>
        {paymentQrUrl ? (
          <Image
            src={paymentQrUrl}
            alt="Payment QR Code"
            width={220} height={220}
            className="mx-auto rounded-xl border border-gray-100"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-gray-400 text-sm">
            QR code not uploaded yet
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">
          Show payment confirmation to staff after paying
        </p>
      </div>
    </div>
  )
}
