"use client";

import StellarPayment from "@/components/StellarPayment";
import { useState } from "react";

interface Event {
  id: string;
  name: string;
  description: string;
  price: string;
  destinationAddress: string;
  date: string;
}

const events: Event[] = [
  {
    id: "stellar-workshop-2024",
    name: "Stellar Workshop",
    description: "Learn how to build on Stellar blockchain.",
    price: "10",
    destinationAddress:
      "GD5QJLOJ3Z2K5VX7Y3ZK3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    date: "2024-03-15",
  },
  {
    id: "lumentix-hackathon-2024",
    name: "Lumentix Hackathon",
    description: "Join our first community hackathon.",
    price: "25",
    destinationAddress:
      "GD5QJLOJ3Z2K5VX7Y3ZK3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    date: "2024-04-20",
  },
  {
    id: "web3-meetup-2024",
    name: "Web3 Meetup",
    description: "Networking event for blockchain enthusiasts.",
    price: "5",
    destinationAddress:
      "GD5QJLOJ3Z2K5VX7Y3ZK3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    date: "2024-03-25",
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handlePaymentSuccess = (transactionId: string) => {
    console.log("Payment successful:", transactionId);
    // Here you could update the UI, show a success message, etc.
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment failed:", error);
    // Here you could show an error notification
  };

  if (selectedEvent) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-black via-gray-900 to-indigo-950 text-white">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setSelectedEvent(null)}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Events
          </button>

          <StellarPayment
            eventId={selectedEvent.id}
            eventName={selectedEvent.name}
            amount={selectedEvent.price}
            destinationAddress={selectedEvent.destinationAddress}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-black via-gray-900 to-indigo-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-center mb-8">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">{event.name}</h2>
              <p className="text-gray-400 mb-4">{event.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">{event.date}</span>
                <span className="text-lg font-semibold text-blue-400">
                  {event.price} XLM
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(event)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
