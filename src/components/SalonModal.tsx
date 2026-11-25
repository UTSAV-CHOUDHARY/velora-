import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, MapPin, X } from 'lucide-react';
import { SalonBooking } from '../types';

interface SalonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORES = [
  'Mumbai · Kala Ghoda Flagship Store',
  'New Delhi · Mehrauli Designer Studio',
  'Bengaluru · Lavelle Road Boutique',
  'Online Video Styling Call',
];

const SERVICES = [
  'Custom Dress Fitting & Measurements',
  'Skincare & Perfume Recommendation',
  'Wedding & Festive Trousseau Shopping',
];

const TIME_SLOTS = ['11:00 AM', '12:30 PM', '03:00 PM', '04:30 PM', '06:30 PM'];

export const SalonModal: React.FC<SalonModalProps> = ({ isOpen, onClose }) => {
  const [salonCity, setSalonCity] = useState(STORES[0]);
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState('2026-12-04');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[2]);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<SalonBooking | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) return;
    setBooking({
      referenceCode: `VST-${Math.floor(1000 + Math.random() * 8999)}`,
      salonCity,
      service,
      date,
      timeSlot,
      clientName: clientName.trim(),
      email: email.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1915]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#FAF7F2] border border-[#E3DBD0] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking window"
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#EDE6DC] flex items-center justify-center text-[#3A2D22] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {booking ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="w-11 h-11 text-[#8B6C36] mx-auto" strokeWidth={1.5} />
            <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#8B6C36] font-medium">
              Visit Confirmed · {booking.referenceCode}
            </p>
            <h2
              id="visit-modal-title"
              className="mt-1 font-display text-3xl font-medium text-[#1E1915]"
            >
              We Look Forward to Seeing You
            </h2>

            <div className="mt-6 rounded-2xl bg-[#F2ECE3] border border-[#E5DDD2] p-5 text-left space-y-2.5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-[#5C4F43]">Guest Name</span>
                <span className="font-medium text-[#1E1915]">{booking.clientName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#5C4F43]">Location</span>
                <span className="font-medium text-[#1E1915] text-right">{booking.salonCity}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#5C4F43]">Purpose</span>
                <span className="font-medium text-[#1E1915] text-right">{booking.service}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#5C4F43]">Date &amp; Time</span>
                <span className="font-medium text-[#1E1915] tabular-nums">
                  {booking.date} at {booking.timeSlot}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBooking(null);
                onClose();
              }}
              className="mt-6 px-8 py-3 rounded-full bg-[#1E1915] text-[#FAF7F2] text-xs font-medium tracking-[0.16em] uppercase cursor-pointer"
            >
              DONE
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8B6C36] font-medium">
              Personal Styling &amp; Fittings
            </p>
            <h2
              id="visit-modal-title"
              className="mt-1 font-display text-3xl sm:text-4xl font-medium text-[#1E1915]"
            >
              Book a Store Visit
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5C4F43]">
              Schedule a personal session with our stylists for custom dress fittings, wedding
              trousseau shopping, or skincare and perfume advice.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8B6C36]" />
                  <span>Select Store / Video Call</span>
                </label>
                <select
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  className="w-full rounded-xl border border-[#DDD3C5] bg-white/80 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                >
                  {STORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1.5">
                  What Would You Like Help With?
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-[#DDD3C5] bg-white/80 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                >
                  {SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B6C36]" />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-[#DDD3C5] bg-white/80 px-3.5 py-2.5 text-sm text-[#1E1915] tabular-nums focus:outline-none focus:border-[#A58347]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1.5">
                    Time Slot (IST)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-medium tabular-nums border cursor-pointer ${
                          timeSlot === slot
                            ? 'bg-[#1E1915] border-[#1E1915] text-[#FAF7F2]'
                            : 'bg-white/70 border-[#DDD3C5] text-[#3A2D22]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Meera Kapoor"
                    className="w-full rounded-xl border border-[#DDD3C5] bg-white/80 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#5C4F43] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="meera@example.in"
                    className="w-full rounded-xl border border-[#DDD3C5] bg-white/80 px-3.5 py-2.5 text-sm text-[#1E1915] focus:outline-none focus:border-[#A58347]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 rounded-full bg-gradient-to-b from-[#B49052] to-[#98763D] hover:from-[#A58347] hover:to-[#876632] text-[#FAF7F2] text-xs font-medium tracking-[0.16em] uppercase transition-all cursor-pointer"
              >
                CONFIRM STORE VISIT
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
