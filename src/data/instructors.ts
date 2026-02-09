// Mock instructor data for LangArt Education Group

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  image: string;
  experience: number;
  students: number;
  about: string;
}

export const instructors: Instructor[] = [
  {
    id: '1',
    slug: 'john-smith',
    name: 'John Smith',
    image: '/images/instructors/instructor1.png',
    experience: 8,
    students: 450,
    about: 'John is a certified English teacher with over 8 years of experience teaching students of all ages. He specializes in exam preparation and has helped hundreds of students achieve their target IELTS scores.'
  },
  {
    id: '2',
    slug: 'emily-johnson',
    name: 'Emily Johnson',
    image: '/images/instructors/instructor2.png',
    experience: 6,
    students: 320,
    about: 'Emily is passionate about teaching young learners. With her creative teaching methods and engaging activities, she makes learning English fun and effective for children aged 7-12.'
  },
  {
    id: '3',
    slug: 'michael-brown',
    name: 'Michael Brown',
    image: '/images/instructors/instructor3.png',
    experience: 10,
    students: 580,
    about: 'Michael brings 10 years of corporate training experience to LangArt. He specializes in Business English and has trained professionals from leading multinational companies.'
  },
  {
    id: '4',
    slug: 'sarah-wilson',
    name: 'Sarah Wilson',
    image: '/images/instructors/instructor4.png',
    experience: 5,
    students: 280,
    about: 'Sarah is a dynamic teacher who focuses on conversational English. Her classes are known for their lively discussions and practical real-world scenarios.'
  },
  {
    id: '5',
    slug: 'david-martinez',
    name: 'David Martinez',
    image: '/images/instructors/instructor5.png',
    experience: 7,
    students: 390,
    about: 'David specializes in academic English and school curriculum support. He helps students excel in their school English classes while building a strong foundation for future success.'
  },
  {
    id: '6',
    slug: 'lisa-anderson',
    name: 'Lisa Anderson',
    image: '/images/instructors/instructor6.png',
    experience: 9,
    students: 500,
    about: 'Lisa has a background in linguistics and brings a unique perspective to language learning. She is our lead trainer for General English courses.'
  }
];

export function getInstructorBySlug(slug: string): Instructor | undefined {
  return instructors.find(instructor => instructor.slug === slug);
}

export function getAllInstructors(): Instructor[] {
  return instructors;
}
