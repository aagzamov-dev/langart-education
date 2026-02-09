// Mock course data for LangArt Education Group

export interface Review {
  id: string;
  name: string;
  userImage: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortTag: string;
  image: string;
  price: number;
  price2: number;
  price3: number;
  dailyPrice: number;
  dailyPrice2: number;
  dailyPrice3: number;
  duration: number;
  lessonDuration: number;
  breaks: number;
  studentsInGroup: number;
  studentsInGroup2: number;
  studentsInGroup3: number;
  certificates: string;
  ages: string;
  rating: number;
  overview: string;
  whatYouWillLearn: string[];
  reviews: Review[];
}

export const courses: Course[] = [
  {
    id: '1',
    slug: 'young-learners-english',
    title: 'Young Learners English',
    shortTag: 'Ages 7-10',
    image: '/images/courses/young-learners.png',
    price: 590000,
    price2: 690000,
    price3: 790000,
    dailyPrice: 60000,
    dailyPrice2: 70000,
    dailyPrice3: 80000,
    duration: 12,
    lessonDuration: 60,
    breaks: 10,
    studentsInGroup: 12,
    studentsInGroup2: 6,
    studentsInGroup3: 2,
    certificates: 'Cambridge YLE Certificate',
    ages: '7-10',
    rating: 5,
    overview: 'LangArt - the ultimate destination for young knowledge seekers aged 7-10. Our Young Learners English program follows the Cambridge framework to help students master English with confidence.',
    whatYouWillLearn: [
      'Build strong vocabulary foundation',
      'Develop reading and writing skills',
      'Practice speaking with native-like pronunciation',
      'Prepare for Cambridge YLE exams',
      'Interactive games and activities'
    ],
    reviews: [
      {
        id: '1',
        name: 'Sarah Johnson',
        userImage: '/images/testimonials/user1.png',
        rating: 5,
        review: 'My daughter loves the classes! The teachers are amazing and make learning fun.',
        createdAt: '2024-01-15'
      }
    ]
  },
  {
    id: '2',
    slug: 'english-for-school',
    title: 'English for School',
    shortTag: 'Ages 11-17',
    image: '/images/placeholder.svg',
    price: 650000,
    price2: 750000,
    price3: 850000,
    dailyPrice: 65000,
    dailyPrice2: 75000,
    dailyPrice3: 85000,
    duration: 12,
    lessonDuration: 80,
    breaks: 10,
    studentsInGroup: 12,
    studentsInGroup2: 6,
    studentsInGroup3: 2,
    certificates: 'School Certificate',
    ages: '11-17',
    rating: 5,
    overview: "LangArt's English for School follows the Cambridge framework to help students master English with confidence. Confidence in class starts here.",
    whatYouWillLearn: [
      'Academic English skills',
      'Essay and report writing',
      'Critical thinking in English',
      'Exam preparation strategies',
      'Group discussions and presentations'
    ],
    reviews: []
  },
  {
    id: '3',
    slug: 'general-english',
    title: 'General English',
    shortTag: 'All Ages',
    image: '/images/placeholder.svg',
    price: 700000,
    price2: 800000,
    price3: 900000,
    dailyPrice: 70000,
    dailyPrice2: 80000,
    dailyPrice3: 90000,
    duration: 12,
    lessonDuration: 90,
    breaks: 10,
    studentsInGroup: 10,
    studentsInGroup2: 5,
    studentsInGroup3: 2,
    certificates: 'General English Certificate',
    ages: '18+',
    rating: 5,
    overview: 'Grow your learning with LangArt. Our General English program is designed for adult learners who want to improve their overall English proficiency.',
    whatYouWillLearn: [
      'Conversational fluency',
      'Grammar and vocabulary expansion',
      'Listening comprehension',
      'Reading skills development',
      'Writing for everyday purposes'
    ],
    reviews: []
  },
  {
    id: '4',
    slug: 'english-for-exams',
    title: 'English for Exams',
    shortTag: 'IELTS/TOEFL',
    image: '/images/placeholder.svg',
    price: 800000,
    price2: 950000,
    price3: 1100000,
    dailyPrice: 85000,
    dailyPrice2: 100000,
    dailyPrice3: 120000,
    duration: 12,
    lessonDuration: 120,
    breaks: 15,
    studentsInGroup: 8,
    studentsInGroup2: 4,
    studentsInGroup3: 2,
    certificates: 'Exam Preparation Certificate',
    ages: '16+',
    rating: 5,
    overview: "Every lesson moves you closer to your target score. LangArt's English for Exams combines professional teaching and proven strategies to help you achieve top scores in IELTS, TOEFL, and Duolingo.",
    whatYouWillLearn: [
      'IELTS preparation (all 4 modules)',
      'TOEFL test strategies',
      'Duolingo English Test prep',
      'Time management techniques',
      'Mock tests with feedback'
    ],
    reviews: []
  },
  {
    id: '5',
    slug: 'business-english',
    title: 'Business English',
    shortTag: 'Professional',
    image: '/images/placeholder.svg',
    price: 900000,
    price2: 1050000,
    price3: 1200000,
    dailyPrice: 95000,
    dailyPrice2: 110000,
    dailyPrice3: 130000,
    duration: 12,
    lessonDuration: 90,
    breaks: 10,
    studentsInGroup: 6,
    studentsInGroup2: 3,
    studentsInGroup3: 2,
    certificates: 'Business English Certificate',
    ages: '20+',
    rating: 5,
    overview: "Your edge in global business. LangArt's English for Business Learners equips professionals with expert, practical English skills to succeed in meetings, presentations and international communication.",
    whatYouWillLearn: [
      'Business communication skills',
      'Presentation techniques',
      'Negotiation in English',
      'Business writing (emails, reports)',
      'Industry-specific vocabulary'
    ],
    reviews: []
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(course => course.slug === slug);
}

export function getAllCourses(): Course[] {
  return courses;
}
