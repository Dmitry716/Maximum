import { FiCpu, FiDribbble, FiFacebook, FiGithub, FiGitlab, FiInstagram, FiLinkedin, FiMail, FiTwitter, FiYoutube } from 'react-icons/fi'
import { LiaHtml5, LiaLaptopCodeSolid, LiaUserCogSolid } from 'react-icons/lia'
import { FaBehance, FaChalkboardTeacher, FaLayerGroup, FaMapMarkedAlt, FaSmile } from "react-icons/fa";
import { LuNetwork } from "react-icons/lu";

import { MdOutlineSettingsInputAntenna } from "react-icons/md";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { TbCube } from "react-icons/tb";

export const partnerData = [
  '/images/client/amazon.svg', '/images/client/google.svg', '/images/client/lenovo.svg', '/images/client/paypal.svg', '/images/client/shopify.svg', '/images/client/spotify.svg'
]

export const featureData = [
  {
    icon: FaLayerGroup,
    title: 'Разнообразие',
    desc: [
      'Широкий спектр направлений дополнительного образования.',
      'Групповые и индивидуальные занятия.',
      'Работа с детьми с ограниченными возможностями здоровья.',
      'Постоянное обновление и расширение услуг.'
    ]
  },
  {
    icon: FaChalkboardTeacher,
    title: 'Современный центр',
    desc: [
      'Комфортные классы с новейшим техническим оборудованием.',
      'Просторные и светлые залы.',
      'Качественный спортивный инвентарь.'
    ]
  },
  {
    icon: FaSmile,
    title: 'Профессиональная команда',
    desc: [
      'Опытные, мотивирующие тренеры.',
      'Квалифицированные преподаватели, любящие свое дело.',
      'Индивидуальный подход к каждому ребенку.'
    ]
  },
  {
    icon: FaSmile,
    title: 'Дружелюбная атмосфера',
    desc: [
      'Благоприятная обстановка.',
      'Мероприятия и праздники для всех.',
      'Поддержка и мотивация на каждом этапе.'
    ]
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Удобное расположение',
    desc: [
      'Пр-т.Московский, 66-108 (Студенческий сквер)',
      'Удобная транспортная доступность.',
      'Парковка.'
    ]
  }
];

export const coursesData = [
  {
    id: 1,
    image: '/images/course/1.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 0,
    lessons: 10,
    students: 49,
    title: 'The Ultimate Course Bundle',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 2,
    image: '/images/course/2.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 19,
    lessons: 10,
    students: 49,
    title: 'App Development Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/2.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 3,
    image: '/images/course/3.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Spoken English Popular Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/3.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 4,
    image: '/images/course/4.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Back-end Development Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/4.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 5,
    image: '/images/course/5.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Front-end Development Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/5.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 6,
    image: '/images/course/6.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Full stack Project in Nextjs Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/6.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 7,
    image: '/images/course/7.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Why Is Education So Famous?',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/7.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 8,
    image: '/images/course/8.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Difficult Things About Education.',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/8.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 9,
    image: '/images/course/9.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Online Courses from Maximum',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 10,
    image: '/images/course/10.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Financial Investing Course',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/2.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 11,
    image: '/images/course/11.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Learning Digital Marketing',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/3.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 12,
    image: '/images/course/12.jpg',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Master the Fundamentals of Math',
    desc: 'The phrasal sequence of the is now so many campaign',
    user: '/images/team/4.jpg',
    name: 'Calvin Carlo'
  },
]

export const teamData = [
  {
    image: '/images/team/1.jpg',
    name: 'Megan Cade',
    position: 'UI/UX Expert',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/2.jpg',
    name: 'Ramon Gibson',
    position: 'Science Teacher',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/3.jpg',
    name: 'Stella Robinson',
    position: 'Math Specialist',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/4.jpg',
    name: 'Paul Phelan',
    position: 'Assistant Teacher',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/5.jpg',
    name: 'Nancy Hall',
    position: 'UI/UX Expert',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/6.jpg',
    name: 'Wendy Buckley',
    position: 'Science Teacher',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/7.jpg',
    name: 'Sammy Adkins',
    position: 'Math Specialist',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
  {
    image: '/images/team/8.jpg',
    name: 'Cornelia Jefferson',
    position: 'Assistant Teacher',
    social: [FiFacebook, FiInstagram, FiLinkedin]
  },
]

export const blogData = [
  {
    id: 1,
    image: '/images/course/1.jpg',
    tag: 'Degree',
    date: '13th Sep 25',
    title: 'The Future of Remote Work: Trending Now'
  },
  {
    id: 2,
    image: '/images/course/2.jpg',
    tag: 'University',
    date: '29th Nov 25',
    title: 'The Psychology of Learning: How Cognitive'
  },
  {
    id: 3,
    image: '/images/course/3.jpg',
    tag: 'Developer',
    date: '29th Dec 25',
    title: 'Crafting Compelling Presentations: Design'
  },
  {
    id: 4,
    image: '/images/course/4.jpg',
    tag: 'HTML5',
    date: '13th March 25',
    title: 'Demystifying Data Science: A Beginner’s'
  },
  {
    id: 5,
    image: '/images/course/5.jpg',
    tag: 'Institution',
    date: '5th May 25',
    title: 'The Art of Effective Online Collaboration'
  },
  {
    id: 6,
    image: '/images/course/6.jpg',
    tag: 'Graduation',
    date: '19th June 25',
    title: 'Student Success Stories: From Learning'
  },
  {
    id: 7,
    image: '/images/course/7.jpg',
    tag: 'Certification',
    date: '20th June 25',
    title: 'Instructor Spotlight: Meet the Faces Behind'
  },
  {
    id: 8,
    image: '/images/course/8.jpg',
    tag: 'Frontend',
    date: '31st Aug 25',
    title: 'Navigating the Job Market: Career Tips'
  },
  {
    id: 9,
    image: '/images/course/9.jpg',
    tag: 'Mobile',
    date: '1st Sep 25',
    title: 'Building a Growth Mindset: Strategies'
  },
]

export const footerSocial = [
  {
    link: 'https://dribbble.com/shreethemes',
    icon: FiDribbble
  },
  {
    link: 'https://www.behance.net/shreethemes',
    icon: FaBehance
  },
  {
    link: 'http://linkedin.com/company/shreethemes',
    icon: FiLinkedin
  },
  {
    link: 'https://www.facebook.com/shreethemes',
    icon: FiFacebook
  },
  {
    link: 'https://www.instagram.com/shreethemes',
    icon: FiInstagram
  },
  {
    link: 'https://twitter.com/shreethemes',
    icon: FiTwitter
  },
  {
    link: 'mailto:support@shreethemes.in',
    icon: FiMail
  },
]

export const footerLink1 = [
  'Course', 'Mission & Vision', 'Join a Career', 'Zoom Meeting', 'Pricing Plan'
]
export const footerLink = [
  {
    link: '/courses',
    title: 'Направления'
  },
  {
    link: '/blog',
    title: 'Блог'
  },
  {
    link: '/news',
    title: 'Новости'
  },
  {
    link: '/contact',
    title: 'Контакты'
  }
]

export const footerLink2 = [
  'Contact Us', 'Technology', 'Instructors', 'Pricing', 'Services'
]

export const categories = [
  {
    icon: LiaLaptopCodeSolid,
    title: 'Art & Design'
  },
  {
    icon: MdOutlineSettingsInputAntenna,
    title: 'Web Development'
  },
  {
    icon: LuNetwork,
    title: 'Digital Marketing'
  },
  {
    icon: LiaHtml5,
    title: 'HTML CSS'
  },
  {
    icon: TbCube,
    title: 'Leadership'
  },
  {
    icon: FiCpu,
    title: 'Data Science'
  },
  {
    icon: IoMdCheckmarkCircleOutline,
    title: 'ChatGPT'
  },
  {
    icon: LiaUserCogSolid,
    title: 'Deep Learning'
  },
]

export const counterData = [
  {
    value: 50,
    symbol: '+',
    title: 'развивающих занятий'
  },
  {
    value: 500,
    symbol: '+',
    title: 'учащихся'
  },
  {
    value: 20,
    symbol: '+',
    title: 'опытных преподавателей'
  }
]

export const clientData = [
  {
    image: '/images/team/1.jpg',
    name: 'Megan Cade',
    position: 'Student',
    desc: `" Online education has allowed me to balance work and study easily. The flexibility of choosing when to study has made it a perfect fit for my busy schedule! "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
  {
    image: '/images/team/2.jpg',
    name: 'Ramon Gibson',
    position: 'Student',
    desc: `" I was surprised by how interactive online courses can be. The live discussions and group projects kept me engaged, and I felt connected to my classmates. "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
  {
    image: '/images/team/3.jpg',
    name: 'Stella Robinson',
    position: 'Student',
    desc: `" Studying online saved me a lot of money, and I didn't have to commute. The quality of the courses was fantastic, and I could learn at my own pace. "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
  {
    image: '/images/team/4.jpg',
    name: 'Paul Phelan',
    position: 'Student',
    desc: `" Online learning requires discipline, but it’s worth it. I had to work on time management, but the flexibility and quality of the content made it rewarding. "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
  {
    image: '/images/team/5.jpg',
    name: 'Christa Smith',
    position: 'Student',
    desc: `" Taking online courses has helped me grow professionally. I could apply what I learned immediately at work, and the knowledge I gained was practical and up-to-date. "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
  {
    image: '/images/team/6.jpg',
    name: 'Calvin Carlo',
    position: 'Student',
    desc: `" The biggest advantage of online education is convenience, but it requires self-motivation. If you're committed, it’s a great way to advance your skills. "`,
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star']
  },
]

export const faqData = [
  {
    id: 1,
    title: 'How does it work ?',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.'
  },
  {
    id: 2,
    title: 'Do I need a designer to use Maximum ?',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.'
  },
  {
    id: 3,
    title: 'What do I need to do to start selling ?',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.'
  },
  {
    id: 4,
    title: 'What happens when I receive an order ?',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.'
  },
]

export const youtubeList = [
  {
    id: 1,
    video: 'https://www.youtube.com/embed/yba7hPeTSjk?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 0,
    lessons: 10,
    students: 49,
    title: 'The Ultimate Course Bundle',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 2,
    video: 'https://www.youtube.com/embed/cWIxnvW4YJs?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 19,
    lessons: 10,
    students: 49,
    title: 'App Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/2.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 3,
    video: 'https://www.youtube.com/embed/S_CGed6E610?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Spoken English Popular Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/3.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 4,
    video: 'https://www.youtube.com/embed/SGrnFOdEiTM?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Back-end Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/4.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 5,
    video: 'https://www.youtube.com/embed/xVVyXI7Opv4?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Front-end Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/5.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 6,
    video: 'https://www.youtube.com/embed/sL8QHyzWtuI?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Full stack Project in Nextjs Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/6.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 7,
    video: 'https://www.youtube.com/embed/qzR62JJCMBQ?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Why Is Education So Famous?',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/7.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 8,
    video: 'https://www.youtube.com/embed/arj7oStGLkU?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Difficult Things About Education.',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/8.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 9,
    video: 'https://www.youtube.com/embed/U6FvJ6jMGHU?feature=oembed',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Online Courses from Maximum',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
]
export const videoList = [
  {
    id: 1,
    video: '/images/course/video/1.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 0,
    lessons: 10,
    students: 49,
    title: 'The Ultimate Course Bundle',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 2,
    video: '/images/course/video/2.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 19,
    lessons: 10,
    students: 49,
    title: 'App Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/2.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 3,
    video: '/images/course/video/3.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Spoken English Popular Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/3.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 4,
    video: '/images/course/video/4.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Back-end Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/4.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 5,
    video: '/images/course/video/5.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Front-end Development Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/5.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 6,
    video: '/images/course/video/6.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Full stack Project in Nextjs Course',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/6.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 7,
    video: '/images/course/video/7.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 15,
    lessons: 10,
    students: 49,
    title: 'Why Is Education So Famous?',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/7.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 8,
    video: '/images/course/video/8.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 24,
    lessons: 10,
    students: 49,
    title: 'Difficult Things About Education.',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/8.jpg',
    name: 'Calvin Carlo'
  },
  {
    id: 9,
    video: '/images/course/video/9.mp4',
    tag1: 'Free',
    tag2: 'Event',
    amount: 29,
    lessons: 10,
    students: 49,
    title: 'Online Courses from Maximum',
    desc: `The phrasal sequence of the is now so many campaign`,
    user: '/images/team/1.jpg',
    name: 'Calvin Carlo'
  },
]

export const blogRecentPost = [
  {
    image: '/images/course/6.jpg',
    title: '10 Things You About Real Estate',
    date: '19th June 25'
  },
  {
    image: '/images/course/7.jpg',
    title: 'Why We Love Real Estate',
    date: '20th June 25'
  },
  {
    image: '/images/course/8.jpg',
    title: '110 Quick Tips About Real Estate',
    date: '13th March 25'
  },
]

export const blogSocial = [
  FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiGithub, FiYoutube, FiGitlab
]

export const termsData = [
  'Digital Marketing Solutions for Tomorrow',
  'Our Talented & Experienced Marketing Agency',
  'Create your own skin to match your brand',
  'Digital Marketing Solutions for Tomorrow',
  'Our Talented & Experienced Marketing Agency',
  'Create your own skin to match your brand',
]
