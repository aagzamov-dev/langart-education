import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const createLocalized = (text: string):any => ({ en: text, ru: text, uz: text });
const createLocalizedArray = (texts: string[]):any => ({ en: texts, ru: texts, uz: texts });

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✅ Created admin user');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.siteConfig.deleteMany();

  // Seed Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        slug: 'young-learners-english',
        title: createLocalized('Young Learners English'),
        shortTag: createLocalized('Ages 7-10'),
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
        ages: createLocalized('7-10'),
        rating: 5,
        overview: createLocalized('LangArt - the ultimate destination for young knowledge seekers aged 7-10. Our Young Learners English program follows the Cambridge framework to help students master English with confidence.'),
        whatYouWillLearn: createLocalizedArray([
          'Build strong vocabulary foundation',
          'Develop reading and writing skills',
          'Practice speaking with native-like pronunciation',
          'Prepare for Cambridge YLE exams',
          'Interactive games and activities'
        ]),
        reviews: {
          create: {
            name: 'Sarah Johnson',
            userImage: '/images/testimonials/user1.png',
            rating: 5,
            review: 'My daughter loves the classes! The teachers are amazing and make learning fun.'
          }
        }
      }
    }),
    prisma.course.create({
      data: {
        slug: 'english-for-school',
        title: createLocalized('English for School'),
        shortTag: createLocalized('Ages 11-17'),
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
        ages: createLocalized('11-17'),
        rating: 5,
        overview: createLocalized("LangArt's English for School follows the Cambridge framework to help students master English with confidence. Confidence in class starts here."),
        whatYouWillLearn: createLocalizedArray([
          'Academic English skills',
          'Essay and report writing',
          'Critical thinking in English',
          'Exam preparation strategies',
          'Group discussions and presentations'
        ])
      }
    }),
    prisma.course.create({
      data: {
        slug: 'general-english',
        title: createLocalized('General English'),
        shortTag: createLocalized('All Ages'),
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
        ages: createLocalized('18+'),
        rating: 5,
        overview: createLocalized('Grow your learning with LangArt. Our General English program is designed for adult learners who want to improve their overall English proficiency.'),
        whatYouWillLearn: createLocalizedArray([
          'Conversational fluency',
          'Grammar and vocabulary expansion',
          'Listening comprehension',
          'Reading skills development',
          'Writing for everyday purposes'
        ])
      }
    }),
    prisma.course.create({
      data: {
        slug: 'english-for-exams',
        title: createLocalized('English for Exams'),
        shortTag: createLocalized('IELTS/TOEFL'),
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
        ages: createLocalized('16+'),
        rating: 5,
        overview: createLocalized("Every lesson moves you closer to your target score. LangArt's English for Exams combines professional teaching and proven strategies to help you achieve top scores in IELTS, TOEFL, and Duolingo."),
        whatYouWillLearn: createLocalizedArray([
          'IELTS preparation (all 4 modules)',
          'TOEFL test strategies',
          'Duolingo English Test prep',
          'Time management techniques',
          'Mock tests with feedback'
        ])
      }
    }),
    prisma.course.create({
      data: {
        slug: 'business-english',
        title: createLocalized('Business English'),
        shortTag: createLocalized('Professional'),
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
        ages: createLocalized('20+'),
        rating: 5,
        overview: createLocalized("Your edge in global business. LangArt's English for Business Learners equips professionals with expert, practical English skills to succeed in meetings, presentations and international communication."),
        whatYouWillLearn: createLocalizedArray([
          'Business communication skills',
          'Presentation techniques',
          'Negotiation in English',
          'Business writing (emails, reports)',
          'Industry-specific vocabulary'
        ])
      }
    })
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // Seed Instructors
  const instructors = await Promise.all([
    prisma.instructor.create({
      data: {
        slug: 'john-smith',
        name: createLocalized('John Smith'),
        image: '/images/instructors/instructor1.png',
        experience: 8,
        students: 450,
        about: createLocalized('John is a certified English teacher with over 8 years of experience teaching students of all ages. He specializes in exam preparation and has helped hundreds of students achieve their target IELTS scores.')
      }
    }),
    prisma.instructor.create({
      data: {
        slug: 'emily-johnson',
        name: createLocalized('Emily Johnson'),
        image: '/images/instructors/instructor2.png',
        experience: 6,
        students: 320,
        about: createLocalized('Emily is passionate about teaching young learners. With her creative teaching methods and engaging activities, she makes learning English fun and effective for children aged 7-12.')
      }
    }),
    prisma.instructor.create({
      data: {
        slug: 'michael-brown',
        name: createLocalized('Michael Brown'),
        image: '/images/instructors/instructor3.png',
        experience: 10,
        students: 580,
        about: createLocalized('Michael brings 10 years of corporate training experience to LangArt. He specializes in Business English and has trained professionals from leading multinational companies.')
      }
    }),
    prisma.instructor.create({
      data: {
        slug: 'sarah-wilson',
        name: createLocalized('Sarah Wilson'),
        image: '/images/instructors/instructor4.png',
        experience: 5,
        students: 280,
        about: createLocalized('Sarah is a dynamic teacher who focuses on conversational English. Her classes are known for their lively discussions and practical real-world scenarios.')
      }
    }),
    prisma.instructor.create({
      data: {
        slug: 'david-martinez',
        name: createLocalized('David Martinez'),
        image: '/images/instructors/instructor5.png',
        experience: 7,
        students: 390,
        about: createLocalized('David specializes in academic English and school curriculum support. He helps students excel in their school English classes while building a strong foundation for future success.')
      }
    }),
    prisma.instructor.create({
      data: {
        slug: 'lisa-anderson',
        name: createLocalized('Lisa Anderson'),
        image: '/images/instructors/instructor6.png',
        experience: 9,
        students: 500,
        about: createLocalized('Lisa has a background in linguistics and brings a unique perspective to language learning. She is our lead trainer for General English courses.')
      }
    })
  ]);

  console.log(`✅ Created ${instructors.length} instructors`);

  // Seed Testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: createLocalized('Anjelina Watson'),
        role: createLocalized('Student'),
        image: '/images/testimonials/user1.png',
        title: createLocalized('Impressive Learning!'),
        content: createLocalized('LangArt has transformed my English learning journey. The teachers are incredibly supportive and the learning environment is perfect for growth.'),
        rating: 5
      }
    }),
    prisma.testimonial.create({
      data: {
        name: createLocalized('David Alexon'),
        role: createLocalized('Business Professional'),
        image: '/images/testimonials/user2.png',
        title: createLocalized('Great Instructor!'),
        content: createLocalized('The Business English course helped me communicate confidently with international clients. Highly recommend LangArt for professionals.'),
        rating: 5
      }
    }),
    prisma.testimonial.create({
      data: {
        name: createLocalized('Maria Santos'),
        role: createLocalized('Parent'),
        image: '/images/testimonials/user3.png',
        title: createLocalized('Perfect for Kids!'),
        content: createLocalized('My children love attending classes at LangArt. The teachers make learning fun and engaging. Great progress in just a few months!'),
        rating: 5
      }
    }),
    prisma.testimonial.create({
      data: {
        name: createLocalized('Ahmed Hassan'),
        role: createLocalized('IELTS Student'),
        image: '/images/testimonials/user4.png',
        title: createLocalized('Achieved My Target Score!'),
        content: createLocalized("Thanks to LangArt's exam preparation course, I achieved my target IELTS score. The strategies and practice tests were invaluable."),
        rating: 5
      }
    })
  ]);

  console.log(`✅ Created ${testimonials.length} testimonials`);

  // Seed Pricing Plans
  const pricingPlans = await Promise.all([
    prisma.pricingPlan.create({
      data: {
        title: createLocalized('Young Learners'),
        icon: '🎓',
        ages: createLocalized('7-10 Years'),
        features: createLocalizedArray([
          'Cambridge YLE Framework',
          'Native-level Pronunciation',
          'Interactive Games',
          'Progress Reports',
          'Certificate Upon Completion'
        ]),
        standardMonthly: 590000,
        standardPerLesson: 60000,
        standardStudents: '10-12',
        focusedMonthly: 690000,
        focusedPerLesson: 70000,
        focusedStudents: '5-6',
        duoMonthly: 790000,
        duoPerLesson: 80000,
        duoStudents: '2',
        order: 1
      }
    }),
    prisma.pricingPlan.create({
      data: {
        title: createLocalized('English for School'),
        icon: '📚',
        ages: createLocalized('11-17 Years'),
        features: createLocalizedArray([
          'Academic English Skills',
          'Essay & Report Writing',
          'Critical Thinking',
          'Exam Preparation',
          'Group Discussions'
        ]),
        standardMonthly: 650000,
        standardPerLesson: 65000,
        standardStudents: '10-12',
        focusedMonthly: 750000,
        focusedPerLesson: 75000,
        focusedStudents: '5-6',
        duoMonthly: 850000,
        duoPerLesson: 85000,
        duoStudents: '2',
        order: 2
      }
    }),
    prisma.pricingPlan.create({
      data: {
        title: createLocalized('Exam Preparation'),
        icon: '🎯',
        ages: createLocalized('16+ Years'),
        features: createLocalizedArray([
          'IELTS Preparation',
          'TOEFL Strategies',
          'Duolingo Test Prep',
          'Mock Tests & Feedback',
          'Time Management'
        ]),
        standardMonthly: 800000,
        standardPerLesson: 85000,
        standardStudents: '6-8',
        focusedMonthly: 950000,
        focusedPerLesson: 100000,
        focusedStudents: '3-4',
        duoMonthly: 1100000,
        duoPerLesson: 120000,
        duoStudents: '2',
        order: 3
      }
    }),
    prisma.pricingPlan.create({
      data: {
        title: createLocalized('Business English'),
        icon: '💼',
        ages: createLocalized('20+ Years'),
        features: createLocalizedArray([
          'Business Communication',
          'Presentation Skills',
          'Negotiation English',
          'Email & Report Writing',
          'Industry Vocabulary'
        ]),
        standardMonthly: 900000,
        standardPerLesson: 95000,
        standardStudents: '4-6',
        focusedMonthly: 1050000,
        focusedPerLesson: 110000,
        focusedStudents: '2-3',
        duoMonthly: 1200000,
        duoPerLesson: 130000,
        duoStudents: '2',
        order: 4
      }
    })
  ]);

  console.log(`✅ Created ${pricingPlans.length} pricing plans`);

  // Seed Site Config
  await prisma.siteConfig.create({
    data: {
      id: 1,
      phoneNumber: '+998 99 123 45 67',
      email: 'info@langart.uz',
      locations: ['Tashkent, Yunusabad district, Amir Temur street 108'],
      workingHours: '09:00 - 18:00',
      facebook: 'https://www.facebook.com/share/17njmqGe3R/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/langart_edu_gr',
      telegram: 'https://t.me/LangArt_Educational_Group'
    }
  });

  console.log('✅ Created site config');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
