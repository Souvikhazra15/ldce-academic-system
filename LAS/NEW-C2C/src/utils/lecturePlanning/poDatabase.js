// Comprehensive PO-Competency-PI Database based on AICTE Examination Reform Policy
// This ensures accurate CO-PO mapping based on subject competencies

export const PROGRAM_OUTCOMES = [
  {
    id: "PO1",
    code: "PO1",
    description: "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization for the solution of complex engineering problems.",
    keywords: ["mathematics", "science", "engineering fundamentals", "knowledge", "apply", "modeling", "analysis"],
    competencies: [
      {
        code: "1.1",
        description: "Demonstrate competence in mathematical modeling",
        pis: [
          { code: "1.1.1", description: "Apply mathematical techniques such as calculus, linear algebra, and statistics to solve problems", keywords: ["mathematics", "calculus", "algebra", "statistics", "solve", "model"] },
          { code: "1.1.2", description: "Apply advanced mathematical techniques to model and solve mechanical engineering problems", keywords: ["advanced mathematics", "modeling", "solve", "problems"] }
        ]
      },
      {
        code: "1.2",
        description: "Demonstrate competence in basic sciences",
        pis: [
          { code: "1.2.1", description: "Apply laws of natural science to an engineering problem", keywords: ["physics", "chemistry", "natural science", "laws", "apply"] }
        ]
      },
      {
        code: "1.3",
        description: "Demonstrate competence in engineering fundamentals",
        pis: [
          { code: "1.3.1", description: "Apply fundamental engineering concepts to solve engineering problems", keywords: ["fundamentals", "engineering concepts", "apply", "solve"] }
        ]
      }
    ]
  },
  {
    id: "PO2",
    code: "PO2",
    description: "Problem analysis: Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences.",
    keywords: ["problem analysis", "identify", "formulate", "research", "analyze", "conclusions", "first principles"],
    competencies: [
      {
        code: "2.1",
        description: "Demonstrate competence in problem identification and formulation",
        pis: [
          { code: "2.1.1", description: "Identify and formulate complex engineering problems", keywords: ["identify", "formulate", "complex problems"] },
          { code: "2.1.2", description: "Research literature and analyze problems using first principles", keywords: ["research", "literature", "analyze", "first principles"] }
        ]
      }
    ]
  },
  {
    id: "PO3",
    code: "PO3",
    description: "Design/development of solutions: Design solutions for complex engineering problems and design systems, components or processes that meet specified needs with appropriate consideration for public health and safety, cultural, societal, and environmental considerations.",
    keywords: ["design", "development", "solutions", "complex problems", "systems", "components", "processes", "public health", "safety", "cultural", "societal", "environmental"],
    competencies: [
      {
        code: "3.1",
        description: "Demonstrate competence in design and development",
        pis: [
          { code: "3.1.1", description: "Design solutions for complex engineering problems", keywords: ["design", "solutions", "complex problems"] },
          { code: "3.1.2", description: "Design systems, components or processes with consideration for safety and environment", keywords: ["systems", "components", "processes", "safety", "environment"] }
        ]
      }
    ]
  },
  {
    id: "PO4",
    code: "PO4",
    description: "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.",
    keywords: ["investigations", "complex problems", "research", "knowledge", "research methods", "design of experiments", "analysis", "interpretation", "data", "synthesis", "information", "conclusions"],
    competencies: [
      {
        code: "4.1",
        description: "Demonstrate competence in research and investigation",
        pis: [
          { code: "4.1.1", description: "Use research methods including design of experiments", keywords: ["research methods", "design of experiments"] },
          { code: "4.1.2", description: "Analyze and interpret data to provide valid conclusions", keywords: ["analyze", "interpret", "data", "conclusions"] }
        ]
      }
    ]
  },
  {
    id: "PO5",
    code: "PO5",
    description: "Modern tool usage: Create, select and apply appropriate techniques, resources, and modern engineering and IT tools, including prediction and modeling, to complex engineering activities, with an understanding of the limitations.",
    keywords: ["modern tool usage", "techniques", "resources", "engineering tools", "IT tools", "prediction", "modeling", "complex activities", "limitations"],
    competencies: [
      {
        code: "5.1",
        description: "Demonstrate competence in modern tool usage",
        pis: [
          { code: "5.1.1", description: "Select and apply appropriate techniques and modern tools", keywords: ["select", "apply", "techniques", "modern tools"] },
          { code: "5.1.2", description: "Use prediction and modeling tools with understanding of limitations", keywords: ["prediction", "modeling", "limitations"] }
        ]
      }
    ]
  },
  {
    id: "PO6",
    code: "PO6",
    description: "The engineer and society: Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to professional engineering practice.",
    keywords: ["engineer and society", "reasoning", "contextual knowledge", "societal", "health", "safety", "legal", "cultural", "issues", "responsibilities", "professional practice"],
    competencies: [
      {
        code: "6.1",
        description: "Demonstrate competence in societal and ethical responsibility",
        pis: [
          { code: "6.1.1", description: "Assess societal, health, safety, legal and cultural issues", keywords: ["assess", "societal", "health", "safety", "legal", "cultural", "issues"] },
          { code: "6.1.2", description: "Apply reasoning for professional engineering responsibilities", keywords: ["reasoning", "professional", "responsibilities"] }
        ]
      }
    ]
  },
  {
    id: "PO7",
    code: "PO7",
    description: "Environment and sustainability: Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of and need for sustainable development.",
    keywords: ["environment", "sustainability", "impact", "professional engineering", "societal", "environmental", "contexts", "sustainable development"],
    competencies: [
      {
        code: "7.1",
        description: "Demonstrate competence in environmental sustainability",
        pis: [
          { code: "7.1.1", description: "Understand impact of engineering solutions on environment", keywords: ["understand", "impact", "engineering solutions", "environment"] },
          { code: "7.1.2", description: "Demonstrate knowledge of sustainable development", keywords: ["knowledge", "sustainable development"] }
        ]
      }
    ]
  },
  {
    id: "PO8",
    code: "PO8",
    description: "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of engineering practice.",
    keywords: ["ethics", "ethical principles", "professional ethics", "responsibilities", "norms", "engineering practice"],
    competencies: [
      {
        code: "8.1",
        description: "Demonstrate competence in professional ethics",
        pis: [
          { code: "8.1.1", description: "Apply ethical principles in engineering practice", keywords: ["apply", "ethical principles", "engineering practice"] },
          { code: "8.1.2", description: "Commit to professional ethics and responsibilities", keywords: ["commit", "professional ethics", "responsibilities"] }
        ]
      }
    ]
  },
  {
    id: "PO9",
    code: "PO9",
    description: "Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.",
    keywords: ["individual", "team work", "function", "member", "leader", "diverse teams", "multidisciplinary"],
    competencies: [
      {
        code: "9.1",
        description: "Demonstrate competence in teamwork",
        pis: [
          { code: "9.1.1", description: "Function effectively as individual and team member", keywords: ["function", "individual", "team member"] },
          { code: "9.1.2", description: "Function as leader in diverse and multidisciplinary teams", keywords: ["leader", "diverse teams", "multidisciplinary"] }
        ]
      }
    ]
  },
  {
    id: "PO10",
    code: "PO10",
    description: "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
    keywords: ["communication", "complex engineering", "engineering community", "society", "reports", "documentation", "presentations", "instructions"],
    competencies: [
      {
        code: "10.1",
        description: "Demonstrate competence in communication",
        pis: [
          { code: "10.1.1", description: "Write effective reports and design documentation", keywords: ["write", "reports", "documentation"] },
          { code: "10.1.2", description: "Make effective presentations and communicate clearly", keywords: ["presentations", "communicate", "clearly"] }
        ]
      }
    ]
  },
  {
    id: "PO11",
    code: "PO11",
    description: "Project management and finance: Demonstrate knowledge and understanding of engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.",
    keywords: ["project management", "finance", "engineering", "management principles", "apply", "work", "team", "leader", "manage projects", "multidisciplinary"],
    competencies: [
      {
        code: "11.1",
        description: "Demonstrate competence in project management",
        pis: [
          { code: "11.1.1", description: "Apply engineering and management principles", keywords: ["apply", "engineering", "management principles"] },
          { code: "11.1.2", description: "Manage projects in multidisciplinary environments", keywords: ["manage projects", "multidisciplinary"] }
        ]
      }
    ]
  },
  {
    id: "PO12",
    code: "PO12",
    description: "Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
    keywords: ["life-long learning", "recognize", "need", "preparation", "ability", "independent", "learning", "technological change"],
    competencies: [
      {
        code: "12.1",
        description: "Demonstrate competence in lifelong learning",
        pis: [
          { code: "12.1.1", description: "Recognize need for lifelong learning", keywords: ["recognize", "need", "lifelong learning"] },
          { code: "12.1.2", description: "Engage in independent learning in technological change", keywords: ["engage", "independent learning", "technological change"] }
        ]
      }
    ]
  }
];