import React from 'react';
import { CreditCard } from 'lucide-react';

export default function CardView() {
  return (
    <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUgNTAgNTApIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <CreditCard className="h-10 w-10" />
          <p className="text-lg font-bold">CARTE KALPE</p>
        </div>

        <div className="space-y-6">
          <div className="text-2xl tracking-wider font-mono">
            1234 4568 1234 4568
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-75">TITULAIRE</p>
              <p className="font-medium">JOHN DOE</p>
            </div>
            <div>
              <p className="text-xs opacity-75">EXPIRE</p>
              <p className="font-medium">12/25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}