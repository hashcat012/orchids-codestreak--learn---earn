export interface Lesson {
  id: string;
  title: string;
  theory: {
    title: string;
    content: string;
    example?: string;
  };
  quizzes: {
    question: string;
    options: string[];
    correctIndex: number;
    hint1: string;
    hint2: string;
  }[];
  challenges: {
    instruction: string;
    initialCode: string;
    solution: string;
    hint: string;
    language: string;
  }[];
}

export type LanguageCurriculum = Record<string, Lesson>;

const getGenericQuizzes = (topic: string, level: number) => [
  { 
    question: `What is the primary purpose of ${topic} in Level ${level}?`, 
    options: ["Processing Data", "Instructions", "Displaying UI", "Hardware"], 
    correctIndex: 1,
    hint1: "Think about how code gives commands.",
    hint2: "The answer starts with 'I'."
  },
  { 
    question: `How do we typically define ${topic}?`, 
    options: ["Syntax", "Keywords", "Functions", "All of above"], 
    correctIndex: 3,
    hint1: "It involves multiple elements.",
    hint2: "It's the most comprehensive option."
  },
  { 
    question: `Is ${topic} essential for professional development?`, 
    options: ["Yes", "No", "Sometimes", "Only in legacy code"], 
    correctIndex: 0,
    hint1: "Most definitely.",
    hint2: "It's a positive answer."
  },
  { 
    question: `Which environment is best for ${topic}?`, 
    options: ["Production", "Staging", "Development", "Any of above"], 
    correctIndex: 3,
    hint1: "Context matters.",
    hint2: "Every environment has its use."
  },
  { 
    question: "What should you do after mastering this?", 
    options: ["Stop", "Continue learning", "Delete code", "Nothing"], 
    correctIndex: 1,
    hint1: "The journey never ends.",
    hint2: "Growth is key."
  }
];

const getGenericChallenges = (topic: string, lang: string, level: number) => [
  { instruction: `Mastery Challenge Part 1: Implement ${topic} for Level ${level}`, initialCode: "", solution: `// Level ${level} solution`, hint: "Apply what you learned in theory", language: lang },
  { instruction: `Mastery Challenge Part 2: Refine ${topic} for Level ${level}`, initialCode: "", solution: `// Level ${level} final`, hint: "Focus on efficiency", language: lang }
];

export const LANGUAGE_LESSONS: Record<string, LanguageCurriculum> = {};

const LANGUAGES_LIST = [
  "JavaScript", "Python", "HTML", "TypeScript", "Java", "C", "C++", "C#", 
  "CSS", "SQL", "React", "Go", "Rust", "PHP", "Bash", "Next.js"
];

// Initialize all languages with 50 levels
LANGUAGES_LIST.forEach(lang => {
  const curriculum: LanguageCurriculum = {};
  
  for (let i = 1; i <= 50; i++) {
    const levelId = i === 1 ? "start" : `level-${i}`;
    const topic = i === 1 ? "Introduction" : `Advanced Concept ${i}`;
    
    curriculum[levelId] = {
      id: levelId,
      title: `${topic} (${i}/50)`,
      theory: {
        title: `Learning ${lang} - Level ${i}`,
        content: i === 1 
          ? `Welcome to ${lang}! In this level, we will cover the absolute basics. ${lang} is widely used in modern software engineering. We'll explore syntax, basic structure, and why it's powerful. Pay close attention because we will ask 5 questions about this!`
          : `Level ${i} of ${lang} focuses on ${topic}. By now, you are becoming a pro. We will dive deeper into professional patterns, optimization, and real-world application of ${lang}. Professional developers use these techniques every day to build scalable systems.`,
        example: i === 1 
          ? `// Basic Hello World in ${lang}\nconsole.log("Welcome to ${lang}!");`
          : `// Professional Level ${i} pattern in ${lang}\nfunction master${i}() {\n  return "Level ${i} Complete";\n}`
      },
      quizzes: getGenericQuizzes(`${lang} ${topic}`, i),
      challenges: getGenericChallenges(topic, lang.toLowerCase().replace('.', ''), i)
    };
  }
  
  LANGUAGE_LESSONS[lang] = curriculum;
});

// Specific overrides for start lessons to make them better
LANGUAGE_LESSONS["JavaScript"]["start"].theory.content = "JavaScript is the world's most popular programming language. It is the language of the Web. In this lesson, we will learn how to output data using console.log(), understand basic variables, and see why JS is essential for every developer.";
LANGUAGE_LESSONS["Python"]["start"].theory.content = "Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant indentation. It's the #1 choice for AI and Data Science.";
LANGUAGE_LESSONS["HTML"]["start"].theory.content = "HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages. It describes the structure of a Web page and consists of a series of elements.";
LANGUAGE_LESSONS["PHP"]["start"].theory.content = "PHP is a popular general-purpose scripting language that is especially suited to web development. It is fast, flexible and pragmatic, powering everything from your blog to the most popular websites in the world.";
LANGUAGE_LESSONS["Bash"]["start"].theory.content = "Bash is a Unix shell and command language. It's the default shell on many Linux distributions and macOS. Mastering Bash allows you to automate tasks and navigate systems like a pro.";
LANGUAGE_LESSONS["Next.js"]["start"].theory.content = "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.";
