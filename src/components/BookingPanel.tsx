 'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingPanel({ profileId, services, slots }: any) {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [booked, setBooked] = useState(false)

  const filteredSlots = slots.filter((s: any) =>
    !selectedService || s.service_id === selectedService
  )

  async function handleBook() {
    if (!selectedSlot || !name || !phone) return alert('Please fill in all fields')
    const { error } = await supabase
      .from('booking_slots')
      .update({ is_booked: true, customer_name: name, customer_phone: phone })
      .eq('id', selectedSlot)
    if (!error) setBooked(true)
    else alert('Booking failed, please try again')
  }

  if (booked) return (
    <div className="mx-4 p-6 bg-green-50 rounded-2xl text-center">
      <div className="text-4xl mb-2">✓</div>
      <p className="font-semibold text-green-800">Booking confirmed!</p>
      <p className="text-green-600 text-sm mt-1">We will see you soon, {name}.</p>
    </div>
  )

  return (
    <div className="mx-4">
      <h2 className="font-semibold text-lg mb-3">Book a slot</h2>

      <div className="mb-3">
        <label className="text-sm text-gray-500 mb-1 block">Select service</label>
        <select
          className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
        >
          <option value="">All services</option>
          {services.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name} — RM{s.price} ({s.duration_minutes} min)
            </option>
          ))}
        </select>
      </div>

      <label className="text-sm text-gray-500 mb-2 block">Select a time slot</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {filteredSlots.length === 0 && (
          <p className="text-sm text-gray-400 col-span-2">No available slots</p>
        )}
        {filteredSlots.map((slot: any) => (
          <button
            key={slot.id}
            onClick={() => setSelectedSlot(slot.id)}
            className={`border rounded-xl p-3 text-sm text-left ${
              selectedSlot === slot.id
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            {new Date(slot.slot_datetime).toLocaleString('en-MY', {
              weekday: 'short', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </button>
        ))}
      </div>

      <input
        placeholder="Your name"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-2 text-sm"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Phone number (e.g. 0123456789)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-4 text-sm"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <button
        onClick={handleBook}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition"
      >
        Confirm booking
      </button>
    </div>
  )
}
