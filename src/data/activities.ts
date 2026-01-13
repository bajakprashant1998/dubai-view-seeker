import burjKhalifa from "@/assets/burj-khalifa.jpg";
import desertSafari from "@/assets/desert-safari.jpg";
import yachtTour from "@/assets/yacht-tour.jpg";
import dubaiFountain from "@/assets/dubai-fountain.jpg";
import atlantisPalm from "@/assets/atlantis-palm.jpg";

export interface Activity {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  location: string;
  category: string;
  tags: string[];
  openingHours: string;
  instantConfirmation: boolean;
  bestTime: string;
  whatToExpect: string[];
  inclusions: string[];
  exclusions: string[];
  dressCode: string;
  ageRequirements: string;
  cancellationPolicy: string;
}

export const activities: Activity[] = [
  {
    id: "burj-khalifa-at-the-top",
    title: "Burj Khalifa At The Top",
    description: "Experience breathtaking 360-degree views from the world's tallest building. Visit the iconic observation decks on levels 124, 125, and 148 for an unforgettable panoramic view of Dubai's stunning skyline, the Arabian Gulf, and the surrounding desert.",
    shortDescription: "World's tallest building observation deck experience",
    image: burjKhalifa,
    price: 149,
    originalPrice: 189,
    rating: 4.9,
    reviewCount: 12847,
    duration: "2-3 hours",
    location: "Downtown Dubai",
    category: "Attractions",
    tags: ["Iconic", "Family-Friendly", "Photography"],
    openingHours: "8:00 AM - 11:00 PM",
    instantConfirmation: true,
    bestTime: "Sunset (5:30 PM - 7:00 PM) for the most spectacular views",
    whatToExpect: [
      "High-speed elevator journey reaching observation deck in 60 seconds",
      "Interactive multimedia presentations about Dubai's history",
      "Outdoor terrace access with 360-degree views",
      "Photo opportunities at world's highest observation deck",
      "Café with refreshments available"
    ],
    inclusions: [
      "Entry ticket to At The Top observation decks",
      "Multimedia tour guide",
      "Commemorative photo opportunity"
    ],
    exclusions: [
      "Food and beverages",
      "Hotel pickup and drop-off",
      "Private guide"
    ],
    dressCode: "Smart casual recommended. Shoulders and knees should be covered.",
    ageRequirements: "Open to all ages. Children under 4 enter free.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience"
  },
  {
    id: "dubai-desert-safari",
    title: "Premium Desert Safari Adventure",
    description: "Embark on an exhilarating journey into the golden dunes of Dubai. Experience heart-pounding dune bashing, camel riding, sandboarding, and a magical evening under the stars with authentic BBQ dinner and live entertainment.",
    shortDescription: "Ultimate desert adventure with BBQ dinner & entertainment",
    image: desertSafari,
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewCount: 8934,
    duration: "6-7 hours",
    location: "Dubai Desert Conservation Reserve",
    category: "Adventure",
    tags: ["Adventure", "Cultural", "Family-Friendly"],
    openingHours: "Pickup at 3:00 PM",
    instantConfirmation: true,
    bestTime: "October to April for comfortable temperatures",
    whatToExpect: [
      "Pickup from your hotel in luxury 4x4 Land Cruiser",
      "30-minute thrilling dune bashing experience",
      "Camel riding across the desert",
      "Sandboarding on pristine dunes",
      "Henna painting and traditional Arabic attire",
      "Lavish BBQ dinner under the stars",
      "Live belly dancing and Tanoura show"
    ],
    inclusions: [
      "Hotel pickup and drop-off",
      "Professional safari guide",
      "All activities mentioned",
      "Unlimited soft drinks and water",
      "BBQ dinner with vegetarian options",
      "Traditional Arabic coffee and dates"
    ],
    exclusions: [
      "Alcoholic beverages",
      "Quad biking (available at extra cost)",
      "Professional photography"
    ],
    dressCode: "Comfortable, loose-fitting clothes. Closed-toe shoes recommended.",
    ageRequirements: "Minimum age 3 years. Dune bashing not recommended for pregnant women.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience"
  },
  {
    id: "luxury-yacht-cruise",
    title: "Luxury Yacht Cruise Marina",
    description: "Sail through Dubai's glittering Marina on a private luxury yacht. Enjoy stunning views of iconic skyscrapers, Ain Dubai, JBR Beach, and Palm Jumeirah while indulging in gourmet refreshments and world-class service.",
    shortDescription: "Private yacht experience with stunning skyline views",
    image: yachtTour,
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 3421,
    duration: "2-3 hours",
    location: "Dubai Marina",
    category: "Luxury",
    tags: ["Luxury", "Romantic", "Photography"],
    openingHours: "Multiple departures daily",
    instantConfirmation: true,
    bestTime: "Sunset cruise for magical golden hour photography",
    whatToExpect: [
      "Welcome aboard with sparkling refreshments",
      "Cruise past Dubai Marina's stunning architecture",
      "Views of Ain Dubai, the world's largest observation wheel",
      "Sail around Palm Jumeirah",
      "Swimming and water activities (optional)",
      "Professional crew at your service"
    ],
    inclusions: [
      "Private yacht charter",
      "Welcome drinks and canapes",
      "Professional captain and crew",
      "Swimming equipment",
      "Fishing equipment",
      "Bluetooth music system"
    ],
    exclusions: [
      "Alcoholic beverages",
      "Full meal packages",
      "Water sports equipment"
    ],
    dressCode: "Resort casual. Swimwear recommended. Bring sunscreen.",
    ageRequirements: "All ages welcome. Life jackets provided for children.",
    cancellationPolicy: "Free cancellation up to 72 hours before departure"
  },
  {
    id: "dubai-fountain-show",
    title: "Dubai Fountain Show & Lake Ride",
    description: "Witness the world's largest choreographed fountain system from an exclusive traditional Abra boat. Get up close to the spectacular water, music, and light show set against the backdrop of Burj Khalifa.",
    shortDescription: "Magical fountain show from traditional boat ride",
    image: dubaiFountain,
    price: 79,
    originalPrice: 99,
    rating: 4.7,
    reviewCount: 15632,
    duration: "30 minutes",
    location: "Downtown Dubai, Burj Lake",
    category: "Attractions",
    tags: ["Romantic", "Family-Friendly", "Evening"],
    openingHours: "Shows every 30 mins from 6:00 PM - 11:00 PM",
    instantConfirmation: true,
    bestTime: "8:00 PM or 9:00 PM for best ambiance",
    whatToExpect: [
      "Board a traditional Abra boat",
      "Front-row seats to the fountain spectacle",
      "Water jets reaching up to 150 meters",
      "Choreographed to world music",
      "Stunning Burj Khalifa backdrop",
      "Professional photography moments"
    ],
    inclusions: [
      "30-minute lake ride",
      "One fountain show viewing",
      "Traditional Abra boat experience",
      "Bottled water"
    ],
    exclusions: [
      "Food and beverages",
      "Transportation",
      "Burj Khalifa tickets"
    ],
    dressCode: "Casual attire suitable for outdoor activity.",
    ageRequirements: "Suitable for all ages.",
    cancellationPolicy: "Free cancellation up to 24 hours before the show"
  },
  {
    id: "atlantis-aquaventure",
    title: "Atlantis Aquaventure Waterpark",
    description: "Dive into the ultimate water adventure at the Middle East's largest waterpark. With record-breaking slides, a private beach, and The Lost Chambers Aquarium, Aquaventure offers endless thrills for the whole family.",
    shortDescription: "Middle East's largest waterpark adventure",
    image: atlantisPalm,
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviewCount: 21456,
    duration: "Full Day",
    location: "Palm Jumeirah",
    category: "Theme Parks",
    tags: ["Family-Friendly", "Adventure", "Beach"],
    openingHours: "10:00 AM - 6:00 PM",
    instantConfirmation: true,
    bestTime: "Weekdays for shorter queues",
    whatToExpect: [
      "Access to 105 slides and attractions",
      "Private beach access",
      "The Lost Chambers Aquarium entry",
      "Lazy river adventure",
      "World's largest waterslide",
      "Kids' splash zones"
    ],
    inclusions: [
      "Full-day park access",
      "Private beach access",
      "The Lost Chambers Aquarium",
      "Locker and towel",
      "Free parking"
    ],
    exclusions: [
      "Food and beverages",
      "Cabana rentals",
      "Dolphin experiences"
    ],
    dressCode: "Swimwear required for water attractions. Cover-ups for dining areas.",
    ageRequirements: "Height restrictions apply for certain slides. Children under 3 free.",
    cancellationPolicy: "Free cancellation up to 24 hours before visit"
  }
];

export const categories = [
  "All",
  "Attractions",
  "Adventure", 
  "Luxury",
  "Theme Parks",
  "Cultural"
];

export const getActivityById = (id: string): Activity | undefined => {
  return activities.find(activity => activity.id === id);
};
