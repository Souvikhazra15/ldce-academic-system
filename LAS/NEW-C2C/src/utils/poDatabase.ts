// Comprehensive PO-Competency-PI Database based on AICTE Examination Reform Policy
// This ensures accurate CO-PO mapping based on subject competencies

export interface PI {
  code: string;
  description: string;
  keywords: string[];
}

export interface Competency {
  code: string;
  description: string;
  pis: PI[];
}

export interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
  competencies: Competency[];
  keywords: string[];
}

export const PROGRAM_OUTCOMES: ProgramOutcome[] = [
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
      },
      {
        code: "1.4",
        description: "Demonstrate competence in specialized engineering knowledge to the program",
        pis: [
          { code: "1.4.1", description: "Apply specialized engineering concepts to solve engineering problems", keywords: ["specialized", "domain knowledge", "apply"] }
        ]
      }
    ]
  },
  {
    id: "PO2",
    code: "PO2",
    description: "Problem analysis: Identify, formulate, research literature, and analyse complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.",
    keywords: ["problem analysis", "identify", "formulate", "research", "analyze", "complex problems", "conclusions"],
    competencies: [
      {
        code: "2.1",
        description: "Demonstrate an ability to identify and formulate complex engineering problem",
        pis: [
          { code: "2.1.1", description: "Articulate problem statements and identify objectives", keywords: ["identify", "problem statement", "objectives", "formulate"] },
          { code: "2.1.2", description: "Identify engineering systems, variables, and parameters to solve the problems", keywords: ["identify", "systems", "variables", "parameters"] },
          { code: "2.1.3", description: "Identify the mathematical, engineering and other relevant knowledge that applies to a given problem", keywords: ["identify", "knowledge", "relevant", "application"] }
        ]
      },
      {
        code: "2.2",
        description: "Demonstrate an ability to formulate a solution plan and methodology for an engineering problem",
        pis: [
          { code: "2.2.1", description: "Reframe complex problems into interconnected sub-problems", keywords: ["formulate", "methodology", "plan", "complex", "sub-problems"] },
          { code: "2.2.2", description: "Identify, assemble and evaluate information and resources", keywords: ["identify", "evaluate", "resources", "information"] },
          { code: "2.2.3", description: "Identify existing processes/solution methods for solving the problem", keywords: ["identify", "existing solutions", "methods", "research"] },
          { code: "2.2.4", description: "Compare and contrast alternative solution processes to select the best process", keywords: ["compare", "contrast", "analyze", "select", "best"] }
        ]
      },
      {
        code: "2.3",
        description: "Demonstrate an ability to formulate and interpret a model's suitability",
        pis: [
          { code: "2.3.1", description: "Combine scientific principles and engineering concepts to formulate models", keywords: ["formulate", "model", "combine", "principles"] },
          { code: "2.3.2", description: "Identify assumptions (mathematical and physical) necessary to allow modeling of a system", keywords: ["assumptions", "modeling", "identify"] }
        ]
      },
      {
        code: "2.4",
        description: "Demonstrate an ability to execute a solution process and analyze results",
        pis: [
          { code: "2.4.1", description: "Apply engineering mathematics and computations to solve mathematical models", keywords: ["apply", "mathematics", "computations", "solve"] },
          { code: "2.4.2", description: "Produce and validate results through skilful use of contemporary engineering tools and models", keywords: ["validate", "results", "tools", "analyze"] },
          { code: "2.4.3", description: "Identify sources of error in the solution process, and limitations of the solution", keywords: ["error analysis", "limitations", "identify"] },
          { code: "2.4.4", description: "Extract desired understanding and conclusions consistent with objectives and limitations", keywords: ["conclusions", "analyze", "extract", "understand"] }
        ]
      }
    ]
  },
  {
    id: "PO3",
    code: "PO3",
    description: "Design/Development of Solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health and safety, and the cultural, societal, and environmental considerations.",
    keywords: ["design", "solutions", "development", "requirements", "specifications", "health", "safety", "environmental"],
    competencies: [
      {
        code: "3.1",
        description: "Demonstrate an ability to define a complex open-ended problem in engineering terms",
        pis: [
          { code: "3.1.1", description: "Recognize that need analysis is key to good problem definition", keywords: ["design", "define", "problem", "analysis", "requirements"] },
          { code: "3.1.2", description: "Elicit and document engineering requirements from stakeholders", keywords: ["design", "requirements", "stakeholders", "document"] },
          { code: "3.1.3", description: "Synthesize engineering requirements from a review of the state-of-the-art", keywords: ["design", "requirements", "synthesis", "review"] },
          { code: "3.1.4", description: "Extract engineering requirements from relevant engineering Codes and Standards", keywords: ["design", "standards", "requirements", "codes"] },
          { code: "3.1.5", description: "Explore and synthesize engineering requirements considering health, safety risks, environmental, cultural and societal issues", keywords: ["design", "health", "safety", "environmental", "societal"] },
          { code: "3.1.6", description: "Determine design objectives, functional requirements and arrive at specifications", keywords: ["design", "objectives", "specifications", "functional"] }
        ]
      },
      {
        code: "3.2",
        description: "Demonstrate an ability to generate a diverse set of alternative design solutions",
        pis: [
          { code: "3.2.1", description: "Apply formal idea generation tools to develop multiple engineering design solutions", keywords: ["design", "solutions", "generate", "alternatives"] },
          { code: "3.2.2", description: "Build models/prototypes to develop a diverse set of design solutions", keywords: ["design", "prototype", "model", "develop"] },
          { code: "3.2.3", description: "Identify suitable criteria for the evaluation of alternate design solutions", keywords: ["design", "evaluation", "criteria", "alternatives"] }
        ]
      },
      {
        code: "3.3",
        description: "Demonstrate an ability to select an optimal design scheme for further development",
        pis: [
          { code: "3.3.1", description: "Apply formal decision-making tools to select optimal engineering design solutions for further development", keywords: ["design", "select", "optimal", "decision-making"] },
          { code: "3.3.2", description: "Consult with domain experts and stakeholders to select candidate engineering design solution for further development", keywords: ["design", "select", "consult", "stakeholders"] }
        ]
      },
      {
        code: "3.4",
        description: "Demonstrate an ability to advance an engineering design to the defined end state",
        pis: [
          { code: "3.4.1", description: "Refine a conceptual design into a detailed design within the existing constraints (of the resources)", keywords: ["design", "refine", "detailed", "constraints"] },
          { code: "3.4.2", description: "Generate information through appropriate tests to improve or revise the design", keywords: ["design", "test", "improve", "revise"] }
        ]
      }
    ]
  },
  {
    id: "PO4",
    code: "PO4",
    description: "Conduct Investigations of Complex Problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.",
    keywords: ["conduct", "investigations", "research", "experiments", "data analysis", "conclusions", "methods"],
    competencies: [
      {
        code: "4.1",
        description: "Demonstrate an ability to conduct investigations of technical issues consistent with their level of knowledge and understanding",
        pis: [
          { code: "4.1.1", description: "Define a problem, its scope and importance for purposes of investigation", keywords: ["investigate", "define", "research", "problem"] },
          { code: "4.1.2", description: "Examine the relevant methods, tools and techniques of experiment design, system calibration, data acquisition, analysis and presentation", keywords: ["investigate", "methods", "data", "experiment", "analysis"] },
          { code: "4.1.3", description: "Apply appropriate instrumentation and/or software tools to make measurements of physical quantities", keywords: ["investigate", "measurements", "instruments", "tools"] },
          { code: "4.1.4", description: "Establish a relationship between measured data and underlying physical principles", keywords: ["investigate", "data", "analysis", "principles"] }
        ]
      },
      {
        code: "4.2",
        description: "Demonstrate an ability to design experiments to solve open-ended problems",
        pis: [
          { code: "4.2.1", description: "Design and develop an experimental approach, specify appropriate equipment and procedures", keywords: ["design", "experiment", "procedure", "approach"] },
          { code: "4.2.2", description: "Understand the importance of the statistical design of experiments and choose an appropriate experimental design plan based on the study objectives", keywords: ["design", "experiment", "statistical", "plan"] }
        ]
      },
      {
        code: "4.3",
        description: "Demonstrate an ability to analyze data and reach a valid conclusion",
        pis: [
          { code: "4.3.1", description: "Use appropriate procedures, tools and techniques to conduct experiments and collect data", keywords: ["analyze", "data", "techniques", "collect"] },
          { code: "4.3.2", description: "Analyze data for trends and correlations, stating possible errors and limitations", keywords: ["analyze", "data", "trends", "error analysis"] },
          { code: "4.3.3", description: "Represent data (in tabular and/or graphical forms) so as to facilitate analysis and explanation of the data", keywords: ["analyze", "data", "represent", "visualize"] },
          { code: "4.3.4", description: "Synthesize information and knowledge about the problem from the raw data to reach appropriate conclusions", keywords: ["analyze", "synthesis", "conclusions", "interpret"] }
        ]
      }
    ]
  },
  {
    id: "PO5",
    code: "PO5",
    description: "Modern Tool Usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling, to complex engineering activities, with an understanding of the limitations.",
    keywords: ["tools", "modern", "technology", "software", "simulation", "modeling", "CAD", "limitation"],
    competencies: [
      {
        code: "5.1",
        description: "Demonstrate an ability to identify modern engineering tools, techniques and resources for engineering activities",
        pis: [
          { code: "5.1.1", description: "Identify modern engineering tools such as computer-aided drafting, modeling and analysis, techniques and resources for engineering activities", keywords: ["tools", "modern", "CAD", "simulation", "software"] },
          { code: "5.1.2", description: "Create/adapt/modify existing tools/techniques to solve engineering problems", keywords: ["tools", "create", "adapt", "solve"] }
        ]
      },
      {
        code: "5.2",
        description: "Demonstrate an ability to select and apply discipline-specific tools, techniques and resources",
        pis: [
          { code: "5.2.1", description: "Identify the strengths and limitations of tools for: (i) acquiring information, (ii) modeling and simulating, (iii) monitoring system performance, and (iv) creating engineering designs", keywords: ["tools", "select", "limitations", "strengths", "application"] },
          { code: "5.2.2", description: "Demonstrate proficiency in using discipline-specific tools", keywords: ["tools", "proficiency", "discipline-specific", "apply"] }
        ]
      },
      {
        code: "5.3",
        description: "Demonstrate an ability to evaluate the suitability and limitations of tools used to solve an engineering problem",
        pis: [
          { code: "5.3.1", description: "Discuss limitations and validate tools, techniques and resources", keywords: ["tools", "evaluate", "limitations", "validate"] },
          { code: "5.3.2", description: "Verify the credibility of results from tool use with reference to the accuracy and limitations, and the assumptions inherent in their use", keywords: ["tools", "verify", "limitations", "accuracy"] }
        ]
      }
    ]
  },
  {
    id: "PO6",
    code: "PO6",
    description: "The Engineer and Society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.",
    keywords: ["society", "societal", "health", "safety", "legal", "cultural", "ethics", "responsibility"],
    competencies: [
      {
        code: "6.1",
        description: "Demonstrate an ability to describe engineering roles in a broader context, e.g. pertaining to the environment, health, safety, legal and public welfare",
        pis: [
          { code: "6.1.1", description: "Identify and describe various engineering roles; particularly as pertains to protection of the public and public interest at the global, regional and local level", keywords: ["society", "engineer", "public", "safety", "welfare"] }
        ]
      },
      {
        code: "6.2",
        description: "Demonstrate an understanding of professional engineering regulations, legislation and standards",
        pis: [
          { code: "6.2.1", description: "Interpret legislation, regulations, codes, and standards relevant to your discipline and explain its contribution to the protection of the public", keywords: ["society", "regulations", "standards", "legal", "codes"] }
        ]
      }
    ]
  },
  {
    id: "PO7",
    code: "PO7",
    description: "Environment and Sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.",
    keywords: ["environment", "sustainability", "sustainable", "impact", "ecological", "green"],
    competencies: [
      {
        code: "7.1",
        description: "Demonstrate an understanding of the impact of engineering and industrial practices on social, environmental and in economic contexts",
        pis: [
          { code: "7.1.1", description: "Identify risks/impacts in the life-cycle of an engineering product or activity", keywords: ["environment", "sustainability", "impact", "life-cycle"] },
          { code: "7.1.2", description: "Understand the relationship between the technical, socio-economic and environmental dimensions of sustainability", keywords: ["sustainability", "environment", "economic", "social"] }
        ]
      },
      {
        code: "7.2",
        description: "Demonstrate an ability to apply principles of sustainable design and development",
        pis: [
          { code: "7.2.1", description: "Describe management techniques for sustainable development", keywords: ["sustainability", "development", "management", "green"] },
          { code: "7.2.2", description: "Apply principles of preventive engineering and sustainable development to an engineering activity or product relevant to the discipline", keywords: ["sustainability", "development", "apply", "sustainable"] }
        ]
      }
    ]
  },
  {
    id: "PO8",
    code: "PO8",
    description: "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.",
    keywords: ["ethics", "ethical", "professional", "responsibility", "norms", "principles"],
    competencies: [
      {
        code: "8.1",
        description: "Demonstrate an ability to recognize ethical dilemmas",
        pis: [
          { code: "8.1.1", description: "Identify situations of unethical professional conduct and propose ethical alternatives", keywords: ["ethics", "ethical", "professional", "conduct"] }
        ]
      },
      {
        code: "8.2",
        description: "Demonstrate an ability to apply the Code of Ethics",
        pis: [
          { code: "8.2.1", description: "Identify tenets of the ASME professional code of ethics", keywords: ["ethics", "code", "professional", "principles"] },
          { code: "8.2.2", description: "Examine and apply moral & ethical principles to known case studies", keywords: ["ethics", "principles", "apply", "case study"] }
        ]
      }
    ]
  },
  {
    id: "PO9",
    code: "PO9",
    description: "Individual and Team Work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.",
    keywords: ["teamwork", "team", "collaboration", "leadership", "communication", "individual", "multidisciplinary"],
    competencies: [
      {
        code: "9.1",
        description: "Demonstrate an ability to form a team and define a role for each member",
        pis: [
          { code: "9.1.1", description: "Recognize a variety of working and learning preferences; appreciate the value of diversity on a team", keywords: ["teamwork", "collaboration", "diversity", "team"] },
          { code: "9.1.2", description: "Implement the norms of practice (e.g. rules, roles, charters, agendas, etc.) of effective team work, to accomplish a goal", keywords: ["teamwork", "norms", "team", "leadership"] }
        ]
      },
      {
        code: "9.2",
        description: "Demonstrate effective individual and team operations--communication, problem-solving, conflict resolution and leadership skills",
        pis: [
          { code: "9.2.1", description: "Demonstrate effective communication, problem-solving, conflict resolution and leadership skills", keywords: ["teamwork", "communication", "problem-solving", "leadership"] },
          { code: "9.2.2", description: "Treat other team members respectfully", keywords: ["teamwork", "respect", "collaboration"] },
          { code: "9.2.3", description: "Listen to other members", keywords: ["teamwork", "communication", "listen"] },
          { code: "9.2.4", description: "Maintain composure in difficult situations", keywords: ["teamwork", "leadership", "composure"] }
        ]
      },
      {
        code: "9.3",
        description: "Demonstrate success in a team-based project",
        pis: [
          { code: "9.3.1", description: "Present results as a team, with smooth integration of contributions from all individual efforts", keywords: ["teamwork", "collaboration", "team", "project"] }
        ]
      }
    ]
  },
  {
    id: "PO10",
    code: "PO10",
    description: "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
    keywords: ["communication", "report", "presentation", "writing", "documentation", "oral", "written"],
    competencies: [
      {
        code: "10.1",
        description: "Demonstrate an ability to comprehend technical literature and document project work",
        pis: [
          { code: "10.1.1", description: "Read, understand and interpret technical and non-technical information", keywords: ["communication", "writing", "documentation", "read", "understand"] },
          { code: "10.1.2", description: "Produce clear, well-constructed, and well-supported written engineering documents", keywords: ["communication", "writing", "documentation", "reports"] },
          { code: "10.1.3", description: "Create flow in a document or presentation - a logical progression of ideas so that the main point is clear", keywords: ["communication", "writing", "documentation", "presentation"] }
        ]
      },
      {
        code: "10.2",
        description: "Demonstrate competence in listening, speaking, and presentation",
        pis: [
          { code: "10.2.1", description: "Listen to and comprehend information, instructions, and viewpoints of others", keywords: ["communication", "oral", "presentation", "listen"] },
          { code: "10.2.2", description: "Deliver effective oral presentations to technical and non-technical audiences", keywords: ["communication", "oral", "presentation", "speak"] }
        ]
      },
      {
        code: "10.3",
        description: "Demonstrate the ability to integrate different modes of communication",
        pis: [
          { code: "10.3.1", description: "Create engineering-standard figures, reports and drawings to complement writing and presentations", keywords: ["communication", "documentation", "drawings", "figures"] },
          { code: "10.3.2", description: "Use a variety of media effectively to convey a message in a document or a presentation", keywords: ["communication", "presentation", "media", "visual"] }
        ]
      }
    ]
  },
  {
    id: "PO11",
    code: "PO11",
    description: "Project Management and Finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's work, as a member and leader in a team, to manage projects and in multidisciplinary environments.",
    keywords: ["project management", "management", "finance", "leadership", "planning", "budget", "time management"],
    competencies: [
      {
        code: "11.1",
        description: "Demonstrate an ability to evaluate the economic and financial performance of an engineering activity",
        pis: [
          { code: "11.1.1", description: "Describe various economic and financial costs/benefits of an engineering activity", keywords: ["management", "finance", "project", "economic"] },
          { code: "11.1.2", description: "Analyze different forms of financial statements to evaluate the financial status of an engineering project", keywords: ["management", "finance", "project", "analyze"] }
        ]
      },
      {
        code: "11.2",
        description: "Demonstrate an ability to compare and contrast the costs/benefits of alternate proposals for an engineering activity",
        pis: [
          { code: "11.2.1", description: "Analyze and select the most appropriate proposal based on economic and financial considerations", keywords: ["management", "project", "planning", "decisions"] }
        ]
      },
      {
        code: "11.3",
        description: "Demonstrate an ability to plan/manage an engineering activity within time and budget constraints",
        pis: [
          { code: "11.3.1", description: "Identify the tasks required to complete an engineering activity, and the resources required to complete the tasks", keywords: ["project management", "planning", "resources", "tasks"] },
          { code: "11.3.2", description: "Use project management tools to schedule an engineering project, so it is completed on time and on budget", keywords: ["project management", "planning", "schedule", "timeline"] }
        ]
      }
    ]
  }
];

// Function to intelligently match CO to PO based on competencies and keywords (Fallback/Local matching)
export function matchCOToPO(coDescription: string, coKeywords: string[] = []): { poId: string; justification: string }[] {
  const matches: { poId: string; justification: string }[] = [];
  const textToAnalyze = (coDescription + " " + coKeywords.join(" ")).toLowerCase();

  PROGRAM_OUTCOMES.forEach((po) => {
    let relevanceScore = 0;
    const matchedCompetencies: string[] = [];

    // Check if any PO keywords match
    const poKeywordMatches = po.keywords.filter(kw => textToAnalyze.includes(kw.toLowerCase()));
    relevanceScore += poKeywordMatches.length * 2;

    // Check competencies and PIs for keyword matches
    po.competencies.forEach((comp) => {
      let compScore = 0;

      const compKeywordMatches = comp.pis.flatMap(pi => pi.keywords).filter(kw => textToAnalyze.includes(kw.toLowerCase()));
      compScore += compKeywordMatches.length;

      if (compScore > 0) {
        matchedCompetencies.push(`${comp.code}: ${comp.description}`);
        relevanceScore += compScore;
      }
    });

    if (relevanceScore > 3) {  // Threshold for meaningful match
      const justification = matchedCompetencies.length > 0
        ? `Addresses competencies: ${matchedCompetencies.slice(0, 2).join("; ")}`
        : `Aligns with ${po.code} keywords and objectives`;
      matches.push({ poId: po.id, justification });
    }
  });

  return matches;
}

// Get PO by ID
export function getPOById(poId: string): ProgramOutcome | undefined {
  return PROGRAM_OUTCOMES.find(po => po.id === poId);
}

// Get all PO IDs
export function getAllPOIds(): string[] {
  return PROGRAM_OUTCOMES.map(po => po.id);
}
