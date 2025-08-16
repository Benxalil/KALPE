import React from 'react';

const favorites = [
  {
    id: 'canal',
    name: 'Canal+',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4a/Logo_Canal%2B.svg/1200px-Logo_Canal%2B.svg.png',
  },
  {
    id: 'rapido',
    name: 'Rapido',
    logo: 'https://play-lh.googleusercontent.com/yPOIQqR5yHw0Jc_wZoQk_Q9sTvV1qXNTWQiVtHHAD8vW0YsTCQz_Cx5PyOxT1rSZ0vk',
  },
  {
    id: 'seneau',
    name: 'SEN\'EAU',
    logo: 'https://www.sde.sn/sites/default/files/seneau_0.png',
  },
  {
    id: 'senelec',
    name: 'Senelec',
    logo: 'https://www.senelec.sn/wp-content/uploads/2020/04/logo-senelec.png',
  },
  {
    id: 'woyofal',
    name: 'Woyofal',
    logo: 'https://play-lh.googleusercontent.com/yPOIQqR5yHw0Jc_wZoQk_Q9sTvV1qXNTWQiVtHHAD8vW0YsTCQz_Cx5PyOxT1rSZ0vk',
  },
];

export default function FavoriteServices() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Favoris</h2>
      <div className="space-y-4">
        {favorites.map((service) => (
          <button
            key={service.id}
            className="flex items-center space-x-4 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={service.logo}
                alt={service.name}
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-gray-700">{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}