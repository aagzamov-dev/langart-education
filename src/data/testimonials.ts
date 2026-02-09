// Mock testimonial data for LangArt Education Group

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  title: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Anjelina Watson',
    role: 'Student',
    image: '/images/testimonials/user1.png',
    title: 'Impressive Learning!',
    content: 'LangArt has transformed my English learning journey. The teachers are incredibly supportive and the learning environment is perfect for growth.',
    rating: 5
  },
  {
    id: '2',
    name: 'David Alexon',
    role: 'Business Professional',
    image: '/images/testimonials/user2.png',
    title: 'Great Instructor!',
    content: 'The Business English course helped me communicate confidently with international clients. Highly recommend LangArt for professionals.',
    rating: 5
  },
  {
    id: '3',
    name: 'Maria Santos',
    role: 'Parent',
    image: '/images/testimonials/user3.png',
    title: 'Perfect for Kids!',
    content: 'My children love attending classes at LangArt. The teachers make learning fun and engaging. Great progress in just a few months!',
    rating: 5
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    role: 'IELTS Student',
    image: '/images/testimonials/user4.png',
    title: 'Achieved My Target Score!',
    content: 'Thanks to LangArt\'s exam preparation course, I achieved my target IELTS score. The strategies and practice tests were invaluable.',
    rating: 5
  }
];

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}
