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
  name: 'Cactus Cove',
  location: '[City], Arizona',
  description: 'A keyless desert rental in [City], Arizona.',
  email: 'hello@cactuscove.casa',
  portalUrl: 'https://stay.cactuscove.casa',

  booking: {
    airbnb: 'https://airbnb.com', // TODO: real listing URL
    vrbo: 'https://vrbo.com' // TODO: real listing URL
  },
  githubUrl: 'https://github.com', // TODO: real repository URL

  hero: {
    title: 'Kick off your boots at Cactus Cove',
    blurb: "[One or two sentences about the place — the vibe, the view, what's nearby.]",
    photo: { alt: 'Front of house at sunset' } as Photo
  },

  facts: [
    { value: '[#]', label: 'Guests' },
    { value: '[#]', label: 'Bedrooms' },
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
      'Garage parking',
      'Self check-in',
      'Fast Wi-Fi',
      'Full kitchen',
      'Five smart TVs',
      '[Pool / hot tub?]',
      '[Washer & dryer]',
      '[Patio & grill]'
    ]
  },

  underTheHood: {
    eyebrow: 'Under the hood',
    title: 'Curious how the place runs itself?',
    body: "Home Assistant, Z-Wave relays, a keypad and this website — it's all open source."
  }
};

export const nav = [
  { href: '#photos', label: 'Photos' },
  { href: '#about', label: 'The place' },
  { href: '#nerds', label: 'How it works' }
];
