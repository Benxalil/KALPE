import React from 'react';
import { Shield, Globe2, Zap, PiggyBank, Users, Clock } from 'lucide-react';

const features = [
  {
    name: 'Instant Transfers',
    description: 'Send money instantly to anyone, anywhere in the world.',
    icon: Zap,
  },
  {
    name: 'Secure Transactions',
    description: 'Bank-level encryption and security for all your transfers.',
    icon: Shield,
  },
  {
    name: 'Global Coverage',
    description: 'Send money to over 150 countries worldwide.',
    icon: Globe2,
  },
  {
    name: 'Low Fees',
    description: 'Competitive rates and transparent pricing.',
    icon: PiggyBank,
  },
  {
    name: 'Group Payments',
    description: 'Split bills and share expenses easily with friends.',
    icon: Users,
  },
  {
    name: '24/7 Support',
    description: 'Round-the-clock customer support when you need it.',
    icon: Clock,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to transfer money
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Send money securely and easily with our comprehensive set of features.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}