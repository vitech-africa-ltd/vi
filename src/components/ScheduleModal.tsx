import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { OfficeHub } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHub?: OfficeHub | null;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, selectedHub }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('14:30 UTC');
  const [fullName, setFullName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [topic, setTopic] = useState<string>(
    selectedHub ? `Consultation Technique Hub ${selectedHub.city} (${selectedHub.specialization})` : 'Architecture & Estimation Projet'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.displayName || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (selectedHub) {
      setTopic(`Consultation Technique Hub ${selectedHub.city} (${selectedHub.specialization})`);
    }
  }, [selectedHub]);

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 UTC',
    '10:30 UTC',
    '11:45 UTC',
    '14:00 UTC',
    '15:30 UTC',
    '17:00 UTC',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const docId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const path = `bookings/${docId}`;

    const bookingPayload = {
      fullName: fullName.slice(0, 100),
      email: email.slice(0, 150),
      phone: (phone || '').slice(0, 30),
      topic: topic.slice(0, 150),
      date: selectedDate.slice(0, 20),
      timeSlot: selectedTime.slice(0, 20),
      userId: user?.uid || 'guest_user',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'bookings', docId), bookingPayload);
      setIsBooked(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (error: any) {
      console.error('Failed to store booking in Firestore:', error);
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (err: any) {
        setErrorMessage("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base text-white">
              {selectedHub ? `RDV Hub ${selectedHub.city} (30 min)` : 'Appel de Cadrage Technique (30 min)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isBooked ? (
          <form onSubmit={handleBooking} className="space-y-4 text-xs sm:text-sm">
            <p className="text-slate-300 text-xs">
              {selectedHub 
                ? `Échangez directement avec le Lead Architect ${selectedHub.leadArchitect} au Hub de ${selectedHub.city} ou en visio Google Meet.`
                : "Échangez directement avec l'un de nos Lead Architects pour valider la faisabilité, la stack technologique et le dimensionnement de votre projet."}
            </p>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Date souhaitée :</span>
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Créneau horaire disponible :</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      selectedTime === slot
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Nom & Prénom :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ibrahima Sy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Email Professionnel :</label>
                <input
                  type="email"
                  required
                  placeholder="i.sy@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Téléphone / WhatsApp :</label>
              <input
                type="tel"
                placeholder="+221 77 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Sujet principal :</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Confirmation...' : 'Confirmer le RDV (Firestore Sync)'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Rendez-vous Enregistré sur Firestore !</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Un lien Google Meet et l'invitation pour le <span className="text-emerald-400 font-mono font-bold">{selectedDate} à {selectedTime}</span> ont été synchronisés pour <span className="text-white font-semibold">{email || 'votre adresse email'}</span>.
            </p>
            <button
              onClick={() => {
                setIsBooked(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Fermer la fenêtre
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
