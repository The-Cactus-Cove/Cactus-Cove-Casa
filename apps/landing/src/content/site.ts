/**
 * Everything on the landing page that changes per listing lives here.
 * Bracketed values are placeholders to replace before launch.
 */

export interface Photo {
  /** Path under public/, e.g. "/photos/living-room.jpg". Leave empty for a placeholder tile. */
  src?: string;
  alt: string;
  /** Make this tile two rows tall. */
  tall?: boolean;
}

export const site = {
  name: 'The Cactus Cove',
  location: 'Tucson, Arizona',
  description: 'A keyless desert rental in Tucson, Arizona.',
  email: 'hello@cactuscove.casa',
  portalUrl: 'https://stay.cactuscove.casa',

  booking: {
    airbnb: 'https://airbnb.com', // TODO: real listing URL
    vrbo: 'https://vrbo.com' // TODO: real listing URL
  },
  githubUrl: 'https://github.com/The-Cactus-Cove',

  hero: {
    title: 'Kick off your boots at The Cactus Cove',
    blurb: "[One or two sentences about the place — the vibe, the view, what's nearby.]",
    photo: { alt: 'Front of house at sunset' } as Photo
  },

  facts: [
    { value: '[#]', label: 'Guests' },
    { value: '3', label: 'Bedrooms' },
    { value: '[#]', label: 'Bathrooms' },
    { value: 'Keyless', label: 'Smart lock, garage & thermostat' }
  ],

  photos: [
    { alt: 'Living room', tall: true },
    { alt: 'Kitchen' },
    { alt: 'Primary bedroom' },
    { alt: 'Backyard / patio' },
    { alt: 'Desert view' }
  ] as Photo[],
  /** Where "See all photos" goes. */
  allPhotosUrl: 'https://airbnb.com', // TODO: listing photo tour

  about: {
    title: 'The lay of the land',
    paragraphs: [
      '[A paragraph about the house: layout, standout features, the neighborhood, how far it is from the things guests come for.]',
      '[A second paragraph — parking, the patio, nearby trails, restaurants.]'
    ],
    amenities: [
      'Garage Parking',
      'Self Check-in',
      'Fast Wi-Fi',
      'Full Kitchen',
      'Four Smart TVs',
      'Pool',
      'Washer & Dryer',
      '[Patio & grill]'
    ]
  },

  underTheHood: {
    eyebrow: 'Under the hood',
    title: 'Curious how the place runs itself?',
    body: "Home Assistant, Z-Wave relays, and this website — it's all open source."
  }
};

export const nav = [
  { href: '#photos', label: 'Photos' },
  { href: '#about', label: 'The place' },
  { href: '#nerds', label: 'How it works' }
];
