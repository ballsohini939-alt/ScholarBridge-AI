import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Wallet,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Brain,
  Code2,
} from "lucide-react";
import "./App.css";

const STORAGE_KEYS = {
  student: "scholarbridge-student",
  saved: "scholarbridge-saved",
  tasks: "scholarbridge-tasks",
  applications: "scholarbridge-applications",
};

const defaultStudent = {
  name: "",
  degree: "B.Tech Computer Science",
  semester: "3rd Semester",
  location: "West Bengal, India",
  cgpa: "",
  interests: ["Software Development", "AI", "Data Science"],
  skills: ["Python", "JavaScript", "React"],
};

const initialOpportunities = [
  {
    id: 1,
    category: "Scholarship",
    title: "AICTE Pragati Scholarship — Technical Degree",
    organization: "All India Council for Technical Education (AICTE)",

    description:
      "A government scholarship scheme supporting eligible girl students pursuing technical degree programmes. Applicants must satisfy the official eligibility and family-income conditions.",

    amount: "As specified in the official scheme",
    tags: [
      "Scholarship",
      "Girl Students",
      "B.Tech",
      "Technical Education",
      "Financial Aid",
    ],

    icon: GraduationCap,
    color: "violet",

    deadline: "Check official notice for current deadline",

    officialUrl: "https://scholarships.gov.in/All-Scholarships",

    requirements: {
      degreeKeywords: [
        "undergraduate",
        "b.tech",
        "bachelor",
        "engineering",
        "technical degree",
      ],

      minimumCgpa: null,
      requiredSkills: [],
      requiredInterests: [],

      note:
        "Important: This scheme is specifically for eligible girl students pursuing technical degree programmes. Other eligibility conditions, including family income and admission requirements, apply. The profile-match score does not establish official eligibility. Check the AICTE Pragati Technical Degree scheme on the National Scholarship Portal.",
    },
  },

  {
    id: 2,
    category: "Scholarship",
    title: "AICTE Swanath Scholarship — Technical Degree",
    organization: "All India Council for Technical Education (AICTE)",

    description:
      "A welfare-based scholarship for eligible technical degree students who meet the scheme's specific personal and family circumstances criteria.",

    amount: "As specified in the official scheme",
    tags: [
      "Scholarship",
      "B.Tech",
      "Technical Education",
      "Welfare",
      "Financial Aid",
    ],

    icon: GraduationCap,
    color: "blue",

    deadline: "Check official notice for current deadline",

    officialUrl: "https://scholarships.gov.in/All-Scholarships",

    requirements: {
      degreeKeywords: [
        "undergraduate",
        "b.tech",
        "bachelor",
        "engineering",
        "technical degree",
      ],

      minimumCgpa: null,
      requiredSkills: [],
      requiredInterests: [],

      note:
        "Important: This is a welfare-based scheme with specific eligibility conditions. Studying B.Tech alone does not establish eligibility. Review the official AICTE Swanath Technical Degree scheme and its requirements before applying.",
    },
  },

  {
    id: 3,
    category: "Scholarship",
    title: "AICTE Saksham Scholarship — Technical Degree",
    organization: "All India Council for Technical Education (AICTE)",

    description:
      "A welfare-based scholarship scheme for eligible specially abled students pursuing technical degree programmes.",

    amount: "As specified in the official scheme",
    tags: [
      "Scholarship",
      "Technical Education",
      "Accessibility",
      "Financial Aid",
    ],

    icon: GraduationCap,
    color: "green",

    deadline: "Check official notice for current deadline",

    officialUrl: "https://scholarships.gov.in/All-Scholarships",

    requirements: {
      degreeKeywords: [
        "undergraduate",
        "b.tech",
        "bachelor",
        "engineering",
        "technical degree",
      ],

      minimumCgpa: null,
      requiredSkills: [],
      requiredInterests: [],

      note:
        "Important: This scheme has specific disability-related and other eligibility requirements. A technical degree alone is not sufficient. Check the official AICTE Saksham Technical Degree scheme for the current rules and required documentation.",
    },
  },

  {
    id: 4,
    category: "Internship",
    title: "AICTE National Internship Portal",
    organization: "All India Council for Technical Education (AICTE)",

    description:
      "Discover internship opportunities in software development, web development, computer science, AI, machine learning, and data analytics through the official AICTE portal. This listing links to the internship discovery portal, not a specific vacancy. Availability, eligibility, deadlines, selection processes, and stipends vary by internship. Review each vacancy's details on the official website before applying.",

    amount: "Varies by internship",
    tags: [
      "Internship",
      "Software Development",
      "Python",
      "React",
      "AI",
      "Data Science",
    ],

    icon: BriefcaseBusiness,
    color: "blue",

    deadline: "Varies by listing — check the individual posting",

    officialUrl: "https://internship.aicte-india.org/",

    requirements: {
      degreeKeywords: [
        "computer science",
        "engineering",
        "b.tech",
        "undergraduate",
      ],

      minimumCgpa: null,
      requiredSkills: [],
      requiredInterests: [
        "Software Development",
        "AI",
        "Data Science",
      ],

      note:
        "This link opens the official AICTE National Internship Portal. Eligibility, skills, location, stipend, duration, and application deadlines vary by internship. Open the individual posting and verify that applications are still open before applying.",
    },
  },
];

const initialTasks = [
  {
    id: 1,
    title: "Complete your student profile",
    completed: false,
    category: "Profile",
  },
  {
    id: 2,
    title: "Explore relevant opportunities",
    completed: false,
    category: "Explore",
  },
  {
    id: 3,
    title: "Save opportunities you like",
    completed: false,
    category: "Planning",
  },
  {
    id: 4,
    title: "Update your resume",
    completed: false,
    category: "Career",
  },
];

const applicationStatuses = [
  "Planning",
  "Applied",
  "Shortlisted",
  "Accepted",
  "Rejected",
];

const skillOptions = [
  "Python",
  "C",
  "Java",
  "JavaScript",
  "React",
  "Node.js",
  "HTML/CSS",
  "SQL",
  "Data Analysis",
  "Machine Learning",
  "Git/GitHub",
];

const interestOptions = [
  "Software Development",
  "AI",
  "Data Science",
  "Web Development",
  "Cybersecurity",
  "Cloud Computing",
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null && item !== undefined)
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeStudent(savedStudent) {
  const source =
    savedStudent && typeof savedStudent === "object"
      ? savedStudent
      : {};

  return {
    ...defaultStudent,
    ...source,
    name:
      typeof source.name === "string" ? source.name : defaultStudent.name,
    degree:
      typeof source.degree === "string"
        ? source.degree
        : defaultStudent.degree,
    semester:
      typeof source.semester === "string"
        ? source.semester
        : defaultStudent.semester,
    location:
      typeof source.location === "string"
        ? source.location
        : defaultStudent.location,
    cgpa: source.cgpa ?? "",
    skills: toArray(source.skills ?? defaultStudent.skills),
    interests: toArray(source.interests ?? defaultStudent.interests),
  };
}

function getInitialState() {
  return {
    student: normalizeStudent(
      readStorage(STORAGE_KEYS.student, defaultStudent)
    ),

    saved: toArray(
      readStorage(STORAGE_KEYS.saved, [])
    ).map(Number).filter(Number.isFinite),

    tasks: (() => {
      const storedTasks = readStorage(STORAGE_KEYS.tasks, null);

      if (!Array.isArray(storedTasks)) {
        return initialTasks;
      }

      const mergedTasks = initialTasks.map((defaultTask) => {
        const savedTask = storedTasks.find(
          (task) => task && task.id === defaultTask.id
        );

        return savedTask
          ? { ...defaultTask, ...savedTask }
          : defaultTask;
      });

      const customTasks = storedTasks.filter(
        (task) =>
          task &&
          !initialTasks.some((defaultTask) => defaultTask.id === task.id)
      );

      return [...mergedTasks, ...customTasks];
    })(),

    applications: readStorage(STORAGE_KEYS.applications, []),
  };
}

/*
  Eligibility matching is informational and uses only the
  criteria entered in ScholarBridge AI.
  A profile match does not establish official eligibility.
  Always verify requirements and deadlines with the provider.
*/
function evaluateEligibility(opportunity, student) {
  const requirements = opportunity.requirements || {};

  const skills = toArray(student.skills);
  const interests = toArray(student.interests);
  const degree = normalize(student.degree);

  const degreeKeywords = toArray(requirements.degreeKeywords);
  const requiredSkills = toArray(requirements.requiredSkills);
  const requiredInterests = toArray(requirements.requiredInterests);

  const minimumCgpa = requirements.minimumCgpa;

  const cgpaProvided =
    student.cgpa !== "" &&
    student.cgpa !== null &&
    student.cgpa !== undefined &&
    Number.isFinite(Number(student.cgpa));

  // Check whether the student's degree matches the listed criteria.
  const degreeMatches =
    degreeKeywords.length === 0 ||
    degreeKeywords.some((keyword) =>
      degree.includes(normalize(keyword))
    );

  // A missing CGPA is unknown, not a failed requirement.
  const hasMinimumCgpa =
    minimumCgpa !== null &&
    minimumCgpa !== undefined &&
    minimumCgpa !== "";

  const cgpaMatches =
    !hasMinimumCgpa ||
    (cgpaProvided &&
      Number(student.cgpa) >= Number(minimumCgpa));

  // Identify skills that are not listed on the student's profile.
  const missingSkills = requiredSkills.filter(
    (required) =>
      !skills.some(
        (skill) =>
          normalize(skill) === normalize(required)
      )
  );

  // Identify interests that are not listed on the student's profile.
  const missingInterests = requiredInterests.filter(
    (required) =>
      !interests.some((interest) =>
        normalize(interest).includes(normalize(required))
      )
  );

  const checks = [
    {
      label: "Degree requirement",
      passed: degreeMatches,
      unknown: !student.degree,
      category: "eligibility",
      detail: !student.degree
        ? "Add your degree to your profile so it can be compared with the listed criteria."
        : degreeMatches
          ? "Your degree matches the listed degree criteria. Other eligibility conditions may still apply."
          : "Your degree does not match the degree keywords in this listing. Verify the official degree requirements.",
    },

    {
      label: "Minimum CGPA",
      passed: cgpaMatches,
      unknown: hasMinimumCgpa && !cgpaProvided,
      category: "eligibility",
      detail: !hasMinimumCgpa
        ? "No minimum CGPA is specified in this listing. This does not mean the official scheme has no academic requirements."
        : !cgpaProvided
          ? `Enter your CGPA to compare it with the listed minimum of ${minimumCgpa}.`
          : cgpaMatches
            ? `Your CGPA meets the listed minimum of ${minimumCgpa}. Verify any other academic conditions in the official notice.`
            : `Your CGPA is below the listed minimum of ${minimumCgpa}. This may be an eligibility barrier if the official scheme requires this minimum.`,
    },

    {
      label: "Required skills",
      passed: missingSkills.length === 0,
      unknown: false,
      category: "profile",
      detail:
        missingSkills.length === 0
          ? requiredSkills.length === 0
            ? "No specific skills are listed as profile-matching criteria."
            : "Your profile includes the listed skills."
          : `Your profile does not currently list: ${missingSkills.join(", ")}. Add these skills only after developing them. Missing profile skills do not automatically make you ineligible for a scholarship.`,
    },

    {
      label: "Relevant interests",
      passed: missingInterests.length === 0,
      unknown: false,
      category: "profile",
      detail:
        missingInterests.length === 0
          ? requiredInterests.length === 0
            ? "No specific interests are listed as profile-matching criteria."
            : "Your interests match the listed preferences."
          : `Your profile does not currently list these interests: ${missingInterests.join(", ")}. Update your interests if appropriate. This is a profile comparison, not an official eligibility condition.`,
    },

    
{
  label: "Official eligibility verification",
  passed: false,
  unknown: true,
  category: "verification",
  detail:
    "Not verified by ScholarBridge AI. This app has not checked all scheme-specific conditions against your personal circumstances or the latest official notice. Depending on the scheme, conditions may include family income, admission status, personal or family circumstances, disability criteria, required documents, and application dates. Review the official scheme guidelines before applying.",
},


  ];

  // Calculate a profile-match score using available degree, CGPA,
  // skills, and interests checks. Unknown checks are excluded.
  // This score is NOT an official eligibility percentage.
  const profileChecks = checks.filter(
    (check) =>
      check.category === "eligibility" ||
      check.category === "profile"
  );

  const applicableChecks = profileChecks.filter(
    (check) => !check.unknown
  );

  const passedCount = applicableChecks.filter(
    (check) => check.passed
  ).length;

  const score = applicableChecks.length
    ? Math.round(
        (passedCount / applicableChecks.length) * 100
      )
    : 0;

  // Only degree and CGPA mismatches are treated as potential
  // eligibility barriers. Missing skills or interests alone
  // are not enough to establish ineligibility.
  const eligibilityChecks = checks.filter(
    (check) => check.category === "eligibility"
  );

  const hasPotentialBarrier = eligibilityChecks.some(
    (check) => !check.unknown && !check.passed
  );

  const hasUnknownEligibility = eligibilityChecks.some(
    (check) => check.unknown
  );



const hasListedEligibilityCriteria =
  degreeKeywords.length > 0 || hasMinimumCgpa;

const hasIncompleteEligibilityData =
  eligibilityChecks.some((check) => check.unknown);



let status;

if (hasPotentialBarrier) {
  status = "Potential eligibility barrier";
} else if (hasUnknownEligibility) {
  status = "Needs more information";
} else if (!hasListedEligibilityCriteria) {
  status = "Insufficient listed criteria";
} else {
  status = "Partial profile match — eligibility unverified";
}



  return {
    checks,
    score,
    status,
    missingSkills,
    missingInterests,
    note:
      requirements.note ||
      "This is an informational profile comparison, not an official eligibility decision. Verify the current requirements with the official provider.",
  };
}

function App() {
  const [initialState] = useState(getInitialState);

  const [student, setStudent] = useState(initialState.student);
  const [saved, setSaved] = useState(initialState.saved);
  const [tasks, setTasks] = useState(
    Array.isArray(initialState.tasks) ? initialState.tasks : initialTasks
  );
  const [applications, setApplications] = useState(
    Array.isArray(initialState.applications)
      ? initialState.applications
      : []
  );

  const [activePage, setActivePage] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newApplicationTitle, setNewApplicationTitle] = useState("");
  const [newApplicationOrganization, setNewApplicationOrganization] =
    useState("");
  const [newApplicationStatus, setNewApplicationStatus] =
    useState("Planning");

  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! I'm your ScholarBridge guide. Ask me about scholarships, internships, eligibility matching, student profiles, or skills to learn. I use rule-based demo guidance, not a generative AI model.",
    },
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.student,
      JSON.stringify(normalizeStudent(student))
    );
  }, [student]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.applications,
      JSON.stringify(applications)
    );
  }, [applications]);

  useEffect(() => {
    const openProfile = () => setActivePage("My Profile");

    window.addEventListener("scholarbridge-open-profile", openProfile);

    return () => {
      window.removeEventListener(
        "scholarbridge-open-profile",
        openProfile
      );
    };
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const categories = ["All", "Scholarship", "Internship", "Learning"];

  const filteredOpportunities = useMemo(() => {
    return initialOpportunities.filter((opportunity) => {
      const categoryMatches =
        activeCategory === "All" ||
        opportunity.category === activeCategory;

      const searchableText = [
        opportunity.title,
        opportunity.organization,
        opportunity.description,
        opportunity.category,
        ...opportunity.tags,
      ]
        .join(" ")
        .toLowerCase();

      return (
        categoryMatches &&
        searchableText.includes(searchQuery.toLowerCase())
      );
    });
  }, [activeCategory, searchQuery]);

  const savedOpportunities = initialOpportunities.filter((opportunity) =>
    saved.includes(opportunity.id)
  );

  const initials =
    student.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SB";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function goTo(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSelectedOpportunity(null);
  }

  function updateStudent(field, value) {
    setStudent((current) => ({
      ...normalizeStudent(current),
      [field]: value,
    }));
  }

  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

  function toggleSkill(skill) {
    setStudent((current) => {
      const currentSkills = toArray(current.skills);
      const exists = currentSkills.some(
        (item) => normalize(item) === normalize(skill)
      );

      return {
        ...current,
        skills: exists
          ? currentSkills.filter(
              (item) => normalize(item) !== normalize(skill)
            )
          : [...currentSkills, skill],
      };
    });
  }

  function toggleInterest(interest) {
    setStudent((current) => {
      const currentInterests = toArray(current.interests);
      const exists = currentInterests.some(
        (item) => normalize(item) === normalize(interest)
      );

      return {
        ...current,
        interests: exists
          ? currentInterests.filter(
              (item) => normalize(item) !== normalize(interest)
            )
          : [...currentInterests, interest],
      };
    });
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function addTask(event) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        completed: false,
        category: "Personal",
      },
    ]);

    setNewTask("");
  }

  function addApplication(opportunity = null) {
    const title = opportunity
      ? opportunity.title
      : newApplicationTitle.trim();

    const organization = opportunity
      ? opportunity.organization
      : newApplicationOrganization.trim();

    if (!title) return;

    const exists = applications.some(
      (application) =>
        normalize(application.title) === normalize(title) &&
        normalize(application.organization) === normalize(organization)
    );

    if (exists) {
      window.alert("This opportunity is already in your application tracker.");
      return;
    }

    setApplications((current) => [
      {
        id: Date.now(),
        title,
        organization: organization || "Not specified",
        status: opportunity ? "Planning" : newApplicationStatus,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setNewApplicationTitle("");
    setNewApplicationOrganization("");
    setNewApplicationStatus("Planning");
    setSelectedOpportunity(null);
    setActivePage("My Applications");
  }

  function updateApplicationStatus(id, status) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application
      )
    );
  }

  function deleteApplication(id) {
    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  }

  function answerAssistant(question) {
    const q = normalize(question);

    if (
      q.includes("scholarship") ||
      q.includes("financial aid") ||
      q.includes("financial support")
    ) {
return "Scholarship opportunities: ScholarBridge AI lists links to official scholarship portals, including the National Scholarship Portal. The current listings include AICTE Pragati, Swanath, and Saksham scholarship schemes. Each scheme has specific eligibility conditions, which may include academic requirements, family income, admission status, category, or disability criteria. Check the latest official scheme guidelines, application dates, and required documents before applying. A profile match in ScholarBridge AI does not confirm official eligibility.";
}

    if (
      q.includes("internship") ||
      q.includes("job") ||
      (q.includes("work") && !q.includes("how does eligibility matching"))
    ) {
return "To find internships, explore the official AICTE National Internship Portal and review each vacancy's role description, eligibility, application deadline, stipend, and selection process. Check the organization and application link before applying. Never pay someone simply to receive an offer letter. ScholarBridge AI links to the portal but does not retrieve or verify live vacancies, so confirm all details on the official website.";    }

    if (
      q.includes("eligib") ||
      q.includes("match") ||
      q.includes("cgpa") ||
      q.includes("criteria")
    ) {
return "Open Find Opportunities and select Check Eligibility on a scholarship card to review how its listed criteria compare with your profile. This is an informational comparison, not official eligibility confirmation. For internships, use Visit Official Portal to review individual vacancies and their requirements.";    }

    if (
      q.includes("resume") ||
      q.includes("profile") ||
      q.includes("skill")
    ) {
      return "Keep your profile accurate and highlight skills you can demonstrate. For a CSE student, useful foundations include Python or C, data structures and algorithms, Git/GitHub, and one or two complete projects. Add measurable results only when you can support them.";
    }

    if (
      q.includes("project") ||
      q.includes("learn") ||
      q.includes("roadmap")
    ) {
return "For a student project, start with a clearly defined problem and build a small working solution. Choose technologies you are learning, such as Python, JavaScript, or React. Test the main features, write a clear README with setup instructions, and publish the code on GitHub. For AI projects, explain which features actually work and whether they use a real AI model or rule-based logic. Focus on a complete, demonstrable project rather than adding unnecessary features.";    }

    if (q.includes("deadline") || q.includes("date")) {
return "ScholarBridge AI does not currently verify live application deadlines. For scholarships, check the latest notice on the National Scholarship Portal or the relevant official scheme website. For internships, check the official vacancy page for its application deadline and status. Do not rely on a date displayed in the app without confirming it with the provider.";    }

    return "I can help with scholarship discovery, internship preparation, eligibility matching, profile improvement, project ideas, and learning plans. Ask a more specific question and I'll provide rule-based guidance. This prototype does not currently use a generative AI model or live opportunity database.";
  }

  function sendAssistantMessage(event) {
    event.preventDefault();

    const question = assistantInput.trim();
    if (!question) return;

    setAssistantMessages((current) => [
      ...current,
      { role: "user", text: question },
      { role: "assistant", text: answerAssistant(question) },
    ]);

    setAssistantInput("");
  }

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, section: "WORKSPACE" },
    { label: "Find Opportunities", icon: Search, section: "WORKSPACE" },
    { label: "Saved Opportunities", icon: Bookmark, section: "WORKSPACE" },
    { label: "My Applications", icon: ClipboardList, section: "WORKSPACE" },
    { label: "AI Assistant", icon: Sparkles, section: "TOOLS" },
    { label: "My Profile", icon: UserRound, section: "TOOLS" },
    { label: "Learning Hub", icon: BookOpen, section: "TOOLS" },
  ];

  function PageHeader({ eyebrow, title, description, children }) {
    return (
      <div className="sb-page-heading">
        <div>
          <div className="sb-eyebrow">{eyebrow}</div>
          <h1 className="sb-heading">{title}</h1>
          {description && <p className="sb-subheading">{description}</p>}
        </div>
        {children}
      </div>
    );
  }

  function OpportunityCard({ opportunity }) {
    const Icon = opportunity.icon;
    const isSaved = saved.includes(opportunity.id);

    return (
      <article className="sb-opportunity">
        <div className="sb-opportunity-top">
          <div className={`sb-opportunity-icon ${opportunity.color}`}>
            <Icon size={21} />
          </div>

          <button
            className="sb-icon-button"
            title={isSaved ? "Remove saved opportunity" : "Save opportunity"}
            onClick={() => toggleSaved(opportunity.id)}
          >
            {isSaved ? <Check size={17} /> : <Bookmark size={17} />}
          </button>
        </div>

        <div>
          <div className="sb-category">{opportunity.category}</div>
          <h3>{opportunity.title}</h3>
          <div className="sb-org">{opportunity.organization}</div>
        </div>

        <p className="sb-description">{opportunity.description}</p>

        <div className="sb-tags">
          {opportunity.tags.map((tag) => (
            <span className="sb-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="sb-opportunity-meta">
          <span>{opportunity.amount}</span>
          <span>{opportunity.deadline}</span>
        </div>

        
<div className="sb-opportunity-actions">
  {opportunity.category === "Internship" ? (
    <a
      className="sb-button secondary"
      href={opportunity.officialUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <ExternalLink size={14} />
      Visit Official Portal
    </a>
  ) : (
    <button
      className="sb-button secondary"
      onClick={() => setSelectedOpportunity(opportunity)}
    >
      <Target size={14} />
      Check Eligibility
    </button>
  )}

  <button
    className="sb-button primary"
    onClick={() => addApplication(opportunity)}
  >
    Track
    <ArrowRight size={14} />
  </button>
</div>


      </article>
    );
  }

  function EmptyState({ icon: Icon = Search, title, description, children }) {
    return (
      <div className="sb-empty">
        <Icon size={29} />
        <h3>{title}</h3>
        <p>{description}</p>
        {children}
      </div>
    );
  }

  function EligibilityModal({ opportunity }) {
    const result = evaluateEligibility(opportunity, student);

    return (
      <div
        className="sb-modal-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedOpportunity(null);
          }
        }}
      >
        <section
          className="sb-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="eligibility-title"
        >
          <div className="sb-modal-header">
            <div>
              <div className="sb-eyebrow">ELIGIBILITY MATCHER</div>
              <h2 id="eligibility-title">{opportunity.title}</h2>
              <p>
               <p>
                  Compare your student profile with the available opportunity criteria.
                  Official eligibility must be verified with the provider.
               </p>
              </p>
            </div>

            <button
              className="sb-icon-button"
              onClick={() => setSelectedOpportunity(null)}
              aria-label="Close eligibility checker"
            >
              <X size={18} />
            </button>
          </div>

          <div className="sb-match-score">
            <div
  className="sb-score-circle"
  style={{ "--sb-score": "0deg" }}
>
  <span>—</span>
</div>
<div className="sb-score-label">Not verified</div>

            <div>
              <h3>{result.status}</h3>
              <p>
                This score reflects how your profile matches the criteria
  entered in ScholarBridge AI. It is not a percentage chance
  of receiving a scholarship or proof of official eligibility.
  Always verify the complete requirements with the provider.
              </p>
            </div>
          </div>

          <div className="sb-result-section">
            <h4>
              <ShieldCheck size={16} />
              Profile comparison
            </h4>

            <div className="sb-result-list">
              {result.checks.map((check) => (
                <div className="sb-result-item" key={check.label}>
                  {check.unknown ? (
                    <CircleHelpIcon />
                  ) : check.passed ? (
                    <CheckCircle2 size={16} color="#5ee0a0" />
                  ) : (
                    <AlertCircle size={16} color="#ffbf78" />
                  )}

                  <div>
                    <strong>{check.label}</strong>
                    <div>{check.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sb-disclaimer">
            <AlertCircle size={16} />
            <span>{result.note}</span>
          </div>

          <div className="sb-modal-actions">
            <button
              className="sb-button secondary"
              onClick={() => {
                setSelectedOpportunity(null);
                setActivePage("My Profile");
              }}
            >
              <UserRound size={15} />
              Review Profile
            </button>

            <button
              className="sb-button primary"
              onClick={() => addApplication(opportunity)}
            >
              Add to Application Tracker
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  function CircleHelpIcon() {
    return <AlertCircle size={16} color="#ffbf78" />;
  }

  const pageContent = (() => {
    if (activePage === "Overview") {
      return (
        <>
          <section className="sb-hero">
            <div>
              <div className="sb-eyebrow">
                <Sparkles size={14} />
                YOUR FUTURE, CONNECTED
              </div>
              <h1>
                {student.name
                  ? `Welcome back, ${student.name.split(" ")[0]}.`
                  : "Build your next opportunity."}
              </h1>
              <p>
  Explore scholarship and internship portals, compare your profile
  with available criteria, organize applications, and plan your
  learning journey in one place. Verify eligibility and deadlines
  with official providers before applying.
</p>

              <button
                className="sb-button primary sb-hero-button"
                onClick={() => goTo("Find Opportunities")}
              >
                Explore Opportunities
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="sb-hero-art">
              <GraduationCap size={56} />
            </div>
          </section>

          <div className="sb-stats">
            <StatCard
              icon={Search}
              label="Opportunities"
              value={initialOpportunities.length}
              foot="Official opportunity portals"
              color="violet"
            />
            <StatCard
              icon={Bookmark}
              label="Saved"
              value={saved.length}
              foot="Your saved listings"
              color="blue"
            />
            <StatCard
              icon={ClipboardList}
              label="Applications"
              value={applications.length}
              foot="Items in your tracker"
              color="green"
            />
            <StatCard
              icon={CheckCircle2}
              label="Tasks completed"
              value={`${completedTasks}/${tasks.length}`}
              foot="Your personal checklist"
              color="orange"
            />
          </div>

          <div className="sb-grid">
            <section className="sb-panel">
              <PanelHeader
                title="Explore opportunities"
                description="Explore scholarship schemes and internship portals. Verify eligibility and deadlines on the official websites."
                action="View all"
                onAction={() => goTo("Find Opportunities")}
              />

              <div className="sb-opportunities">
                {initialOpportunities.slice(0, 2).map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </div>
            </section>

            <section className="sb-panel">
              <PanelHeader
                title="Your action plan"
                description={`${completedTasks} of ${tasks.length} tasks completed`}
              />

              <div className="sb-progress">
                <div
                  className="sb-progress-fill"
                  style={{
                    width: `${
                      tasks.length
                        ? (completedTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

           
<div className="sb-task-list">
  {tasks.length > 0 ? (
    tasks.map((task) => (
      <div className="sb-task" key={task.id}>
        <input
          className="sb-checkbox"
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => toggleTask(task.id)}
          aria-label={`Mark ${task.title} as completed`}
        />

        <span
          className={`sb-task-title ${task.completed ? "done" : ""}`}
        >
          {task.title}
        </span>
      </div>
    ))
  ) : (
    <p>No tasks available. Add a task below to get started.</p>
  )}
</div>



              <form className="sb-inline-form" onSubmit={addTask}>
                <input
                  className="sb-input"
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="Add a personal task..."
                  aria-label="New task"
                />
                <button className="sb-button primary" type="submit">
                  <Plus size={15} />
                </button>
              </form>
            </section>
          </div>
        </>
      );
    }

    if (activePage === "Find Opportunities") {
      return (
        <>
          <PageHeader
            eyebrow="OPPORTUNITY DISCOVERY"
            title="Find opportunities"
            description="Explore scholarship schemes and internship opportunities from official portals. Compare requirements with your student profile and verify details before applying."
          />

          <div className="sb-disclaimer">
            <AlertCircle size={16} />
            <span>
              These listings link to official scholarship and internship portals. Eligibility, application status, and deadlines vary by scheme or vacancy. Always verify the latest details on the official website before applying.
            </span>
          </div>

          <div className="sb-search-row">
            <div className="sb-search">
              <Search size={17} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search scholarships, internships, skills..."
              />
            </div>
          </div>

          <div className="sb-category-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`sb-category-pill ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredOpportunities.length ? (
            <div className="sb-opportunities">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching opportunities"
              description="Try another search phrase or select a different category."
            />
          )}
        </>
      );
    }

    if (activePage === "Saved Opportunities") {
      return (
        <>
          <PageHeader
            eyebrow="YOUR SHORTLIST"
            title="Saved opportunities"
            description="Keep interesting listings together while you explore your options."
          />

          {savedOpportunities.length ? (
            <div className="sb-opportunities">
              {savedOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved opportunities yet"
              description="Save a listing from Find Opportunities and it will appear here."
            >
              <button
                className="sb-button primary sb-empty-button"
                onClick={() => goTo("Find Opportunities")}
              >
                Explore opportunities
                <ArrowRight size={14} />
              </button>
            </EmptyState>
          )}
        </>
      );
    }

    if (activePage === "My Applications") {
      return (
        <>
          <PageHeader
            eyebrow="APPLICATION TRACKER"
            title="My applications"
            description="Track your progress from planning through application outcomes."
          />

          <section className="sb-panel">
            <PanelHeader
              title="Add an application"
              description="Enter an opportunity you want to track."
            />

            <form
              className="sb-form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                addApplication();
              }}
            >
              <Field label="Opportunity title">
                <input
                  className="sb-input"
                  required
                  value={newApplicationTitle}
                  onChange={(event) =>
                    setNewApplicationTitle(event.target.value)
                  }
                  placeholder="e.g. Software Development Internship"
                />
              </Field>

              <Field label="Organization">
                <input
                  className="sb-input"
                  value={newApplicationOrganization}
                  onChange={(event) =>
                    setNewApplicationOrganization(event.target.value)
                  }
                  placeholder="Organization name"
                />
              </Field>

              <Field label="Current status">
                <select
                  className="sb-select"
                  value={newApplicationStatus}
                  onChange={(event) =>
                    setNewApplicationStatus(event.target.value)
                  }
                >
                  {applicationStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>

              <div className="sb-field sb-field-action">
                <label>&nbsp;</label>
                <button className="sb-button primary" type="submit">
                  <Plus size={15} />
                  Add to tracker
                </button>
              </div>
            </form>
          </section>

          <section className="sb-panel sb-applications-panel">
            <PanelHeader
              title="Tracked applications"
              description={`${applications.length} item(s)`}
            />

            {applications.length ? (
              applications.map((application) => (
                <div className="sb-application-row" key={application.id}>
                  <div>
                    <div className="sb-application-name">
                      {application.title}
                    </div>
                    <div className="sb-application-org">
                      {application.organization || "Not specified"}
                    </div>
                  </div>

                  <select
                    className="sb-select"
                    value={application.status}
                    onChange={(event) =>
                      updateApplicationStatus(
                        application.id,
                        event.target.value
                      )
                    }
                    aria-label={`Status for ${application.title}`}
                  >
                    {applicationStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <button
                    className="sb-icon-button"
                    onClick={() => deleteApplication(application.id)}
                    title="Delete application"
                    aria-label={`Delete ${application.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Your tracker is empty"
                description="Add an application above or track one from Find Opportunities."
              />
            )}
          </section>
        </>
      );
    }

    if (activePage === "My Profile") {
      return (
        <>
          <PageHeader
            eyebrow="STUDENT PROFILE"
            title="My profile"
            description="Keep your academic details, skills, and interests accurate to improve your example eligibility matches."
          />

          <section className="sb-panel sb-profile-panel">
            <div className="sb-profile-heading">
              <div className="sb-avatar sb-profile-avatar">{initials}</div>
              <div>
                <h2>{student.name || "Your student profile"}</h2>
                <p>
                  {student.degree || "Degree not specified"} ·{" "}
                  {student.semester || "Semester not specified"}
                </p>
              </div>
            </div>

            <div className="sb-form-grid">
              <Field label="Full name">
                <input
                  className="sb-input"
                  value={student.name}
                  onChange={(event) =>
                    updateStudent("name", event.target.value)
                  }
                  placeholder="Enter your name"
                />
              </Field>

              <Field label="Degree / course">
                <input
                  className="sb-input"
                  value={student.degree}
                  onChange={(event) =>
                    updateStudent("degree", event.target.value)
                  }
                  placeholder="e.g. B.Tech Computer Science"
                />
              </Field>

              <Field label="Current semester">
                <select
                  className="sb-select"
                  value={student.semester}
                  onChange={(event) =>
                    updateStudent("semester", event.target.value)
                  }
                >
                  {[
                    "1st Semester",
                    "2nd Semester",
                    "3rd Semester",
                    "4th Semester",
                    "5th Semester",
                    "6th Semester",
                    "7th Semester",
                    "8th Semester",
                  ].map((semester) => (
                    <option key={semester}>{semester}</option>
                  ))}
                </select>
              </Field>

              <Field label="Location">
                <input
                  className="sb-input"
                  value={student.location}
                  onChange={(event) =>
                    updateStudent("location", event.target.value)
                  }
                  placeholder="City, state"
                />
              </Field>

              <Field label="CGPA (out of 10)">
                <input
                  className="sb-input"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={student.cgpa}
                  onChange={(event) =>
                    updateStudent("cgpa", event.target.value)
                  }
                  placeholder="Enter your CGPA"
                />
              </Field>
            </div>

            <div className="sb-profile-section">
              <h3>
                <Code2 size={16} />
                Skills
              </h3>
              <p className="sb-panel-desc">
                Select skills you genuinely have. Add others as you learn them.
              </p>

              <div className="sb-chip-row">
                {skillOptions.map((skill) => {
                  const active = toArray(student.skills).some(
                    (item) => normalize(item) === normalize(skill)
                  );

                  return (
                    <button
                      type="button"
                      key={skill}
                      className={`sb-chip-button ${active ? "active" : ""}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {active && <Check size={12} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sb-profile-section">
              <h3>
                <Target size={16} />
                Interests
              </h3>
              <p className="sb-panel-desc">
                Choose the areas you want to explore.
              </p>

              <div className="sb-chip-row">
                {interestOptions.map((interest) => {
                  const active = toArray(student.interests).some(
                    (item) => normalize(item) === normalize(interest)
                  );

                  return (
                    <button
                      type="button"
                      key={interest}
                      className={`sb-chip-button ${active ? "active" : ""}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {active && <Check size={12} />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sb-disclaimer sb-profile-notice">
              <CheckCircle2 size={16} />
              <span>
                Your profile is saved automatically in this browser using
                localStorage. It is not being sent to a server.
              </span>
            </div>
          </section>
        </>
      );
    }

    if (activePage === "AI Assistant") {
      return (
        <>
          <PageHeader
            eyebrow="STUDENT SUPPORT"
            title="ScholarBridge Assistant"
            description="Ask for guidance on scholarships, internships, eligibility matching, projects, or skill development."
          />

          <div className="sb-disclaimer">
            <AlertCircle size={16} />
            <span>
              This is a rule-based prototype, not a connected generative AI
              model. It does not retrieve live opportunities.
            </span>
          </div>

          <section className="sb-panel sb-assistant">
            <div className="sb-chat-messages">
              {assistantMessages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`sb-chat-message ${message.role}`}
                >
                  <div className="sb-chat-avatar">
                    {message.role === "assistant" ? (
                      <Sparkles size={15} />
                    ) : (
                      <UserRound size={15} />
                    )}
                  </div>

                  <div className="sb-chat-bubble">{message.text}</div>
                </div>
              ))}
            </div>

            <div className="sb-quick-prompts">
              {[
                "How do I find scholarships?",
                "How can I improve my profile?",
                "How does eligibility matching work?",
                "How do I prepare for internships?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setAssistantMessages((current) => [
                      ...current,
                      { role: "user", text: prompt },
                      {
                        role: "assistant",
                        text: answerAssistant(prompt),
                      },
                    ]);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="sb-chat-form"
              onSubmit={sendAssistantMessage}
            >
              <input
                value={assistantInput}
                onChange={(event) =>
                  setAssistantInput(event.target.value)
                }
                placeholder="Ask your question..."
                aria-label="Ask the ScholarBridge assistant"
              />
              <button type="submit" aria-label="Send message">
                <Send size={17} />
              </button>
            </form>
          </section>
        </>
      );
    }

    if (activePage === "Learning Hub") {
      const learningCards = [
        {
          icon: Code2,
          title: "Programming foundations",
          description:
            "Strengthen Python or C, practice problem solving, and understand functions, arrays, strings, and basic data structures.",
          steps: ["Practice coding basics", "Solve beginner problems", "Build a small project"],
        },
        {
          icon: Brain,
          title: "AI & Data Science",
          description:
            "Start with Python, data handling, statistics basics, and small projects using datasets.",
          steps: ["Learn Python", "Explore pandas", "Analyze a dataset"],
        },
        {
          icon: BriefcaseBusiness,
          title: "Internship preparation",
          description:
            "Prepare a clear resume, organize GitHub projects, and learn to explain your own code and decisions.",
          steps: ["Improve your resume", "Document projects", "Practice explaining code"],
        },
      ];

      return (
        <>
          <PageHeader
            eyebrow="LEARNING PATHS"
            title="Learning hub"
            description="Explore practical learning plans that help you build demonstrable skills."
          />

          <div className="sb-learning-grid">
            {learningCards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="sb-learning-card" key={card.title}>
                  <div className="sb-opportunity-icon violet">
                    <Icon size={22} />
                  </div>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>

                  <ul>
                    {card.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>

                  <button
                    className="sb-button secondary"
                    onClick={() => {
                      const taskTitle = `Learning goal: ${card.title}`;

                      if (
                        !tasks.some(
                          (task) => normalize(task.title) === normalize(taskTitle)
                        )
                      ) {
                        setTasks((current) => [
                          ...current,
                          {
                            id: Date.now(),
                            title: taskTitle,
                            completed: false,
                            category: "Learning",
                          },
                        ]);
                      }

                      goTo("Overview");
                    }}
                  >
                    Add learning goal
                    <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </>
      );
    }

    return (
      <EmptyState
        title="Page not found"
        description="Choose a page from the navigation menu."
      >
        <button
          className="sb-button primary sb-empty-button"
          onClick={() => goTo("Overview")}
        >
          Go to overview
        </button>
      </EmptyState>
    );
  })();

  return (
    <div className="sb-app">
      <style>{`
        :root {
          color-scheme: dark;
          --sb-bg: #0b0b10;
          --sb-panel: #12121a;
          --sb-border: rgba(255,255,255,.09);
          --sb-text: #f4f2fa;
          --sb-muted: #9b98ab;
          --sb-purple: #a78bfa;
        }

        * { box-sizing: border-box; }
        body { margin: 0; background: var(--sb-bg); }
        button, input, select { font: inherit; }
        button { cursor: pointer; }

        .sb-app {
          min-height: 100vh;
          background: radial-gradient(ellipse at 75% -10%, rgba(124,58,237,.13), transparent 35%), var(--sb-bg);
          color: var(--sb-text);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 14px;
        }

        .sb-layout { display: flex; min-height: 100vh; }

        .sb-sidebar {
          width: 250px; flex-shrink: 0; padding: 25px 15px;
          background: rgba(15,15,22,.97); border-right: 1px solid var(--sb-border);
          display: flex; flex-direction: column; gap: 25px;
        }

        .sb-brand { display: flex; align-items: center; gap: 11px; padding: 0 10px; }
        .sb-brand-mark {
          width: 39px; height: 39px; border-radius: 13px;
          display: grid; place-items: center; color: white;
          background: linear-gradient(135deg,#a78bfa,#6d28d9);
        }
        .sb-brand-name { font-size: 16px; font-weight: 800; letter-spacing: -.5px; }
        .sb-brand-sub { margin-top: 3px; color: var(--sb-muted); font-size: 9px; letter-spacing: 1px; }

        .sb-nav-section { color: #6f6b80; font-size: 10px; letter-spacing: 1.7px; padding: 0 12px; margin: 4px 0 9px; }
        .sb-nav { display: grid; gap: 5px; }
        .sb-nav button {
          display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
          color: #a7a3b5; background: transparent; border: 1px solid transparent;
          padding: 11px 12px; border-radius: 11px; font-size: 12px;
        }
        .sb-nav button:hover { color: white; background: rgba(255,255,255,.04); }
        .sb-nav button.active { color: #e4d9ff; background: rgba(139,92,246,.14); border-color: rgba(167,139,250,.18); }
        .sb-nav button.active svg { color: var(--sb-purple); }

        .sb-sidebar-bottom { margin-top: auto; }
        .sb-side-note { padding: 15px; border: 1px solid var(--sb-border); border-radius: 14px; background: rgba(139,92,246,.08); }
        .sb-side-note h4 { margin: 9px 0 5px; font-size: 12px; }
        .sb-side-note p { color: var(--sb-muted); font-size: 11px; line-height: 1.65; margin: 0; }

        .sb-main { flex: 1; min-width: 0; }
        .sb-topbar {
          min-height: 76px; padding: 17px 34px; display: flex; justify-content: space-between;
          align-items: center; border-bottom: 1px solid var(--sb-border); gap: 15px;
          background: rgba(12,12,18,.72);
        }
        .sb-topbar-left { display: flex; align-items: center; gap: 12px; }
        .sb-page-kicker { color: var(--sb-muted); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
        .sb-page-title { font-size: 17px; font-weight: 700; margin-top: 5px; }
        .sb-top-actions { display: flex; align-items: center; gap: 15px; }
        .sb-date { color: var(--sb-muted); font-size: 11px; }

        .sb-icon-button {
          border: 1px solid var(--sb-border); background: var(--sb-panel);
          width: 35px; height: 35px; border-radius: 11px; color: #c8c4d6;
          display: grid; place-items: center;
        }
        .sb-avatar {
          width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%;
          background: linear-gradient(145deg,#c4b5fd,#7c3aed); color: #171024;
          font-size: 11px; font-weight: 800;
        }

        .sb-content { padding: 29px 34px 45px; max-width: 1500px; margin: 0 auto; }
        .sb-page-heading {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 20px; margin-bottom: 22px;
        }
        .sb-eyebrow {
          display: inline-flex; align-items: center; gap: 7px; color: #c4b5fd;
          font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
        }
        .sb-heading { font-size: 26px; letter-spacing: -.8px; line-height: 1.25; margin: 11px 0 8px; }
        .sb-subheading { color: var(--sb-muted); line-height: 1.7; font-size: 12px; max-width: 700px; margin: 0; }

        .sb-hero {
          display: flex; align-items: center; justify-content: space-between; gap: 25px;
          padding: 27px 29px; border: 1px solid rgba(167,139,250,.2); border-radius: 19px;
          background: radial-gradient(circle at 85% 20%,rgba(139,92,246,.16),transparent 30%), linear-gradient(115deg,#191624,#12121a 70%);
        }
        .sb-hero h1 { font-size: 29px; letter-spacing: -1px; margin: 12px 0 9px; }
        .sb-hero p { max-width: 590px; color: #aaa5bb; font-size: 12px; line-height: 1.8; margin: 0 0 17px; }
        .sb-hero-art {
          width: 120px; height: 120px; flex-shrink: 0; display: grid; place-items: center;
          color: #c4b5fd; border-radius: 34px; transform: rotate(-7deg);
          background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.23);
        }

        .sb-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          border: 1px solid transparent; border-radius: 10px; padding: 10px 13px;
          font-size: 11px; font-weight: 700; transition: .2s;
        }
        .sb-button.primary { background: #a78bfa; color: #1b1230; }
        .sb-button.primary:hover { background: #c4b5fd; }
        .sb-button.secondary { color: #d4d0df; background: #1b1a25; border-color: var(--sb-border); }
        .sb-button.secondary:hover { background: #242232; }
        .sb-button.danger { color: #ff9d9d; background: rgba(239,68,68,.08); }

        .sb-stats { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin: 21px 0 28px; }
        .sb-stat { padding: 18px; border: 1px solid var(--sb-border); border-radius: 15px; background: rgba(18,18,26,.9); }
        .sb-stat-top { display: flex; align-items: center; justify-content: space-between; color: var(--sb-muted); font-size: 11px; gap: 5px; }
        .sb-stat-icon { width: 33px; height: 33px; border-radius: 10px; display: grid; place-items: center; }
        .sb-stat-value { font-size: 26px; font-weight: 750; margin: 15px 0 5px; letter-spacing: -.7px; }
        .sb-stat-foot { color: #89859a; font-size: 10px; }

        .sb-grid { display: grid; grid-template-columns: minmax(0,1.5fr) minmax(270px,1fr); gap: 18px; }
        .sb-panel { border: 1px solid var(--sb-border); border-radius: 16px; padding: 19px; background: rgba(18,18,26,.9); min-width: 0; margin-bottom: 18px; }
        .sb-panel-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 17px; }
        .sb-panel-title { font-size: 14px; font-weight: 750; margin: 0; }
        .sb-panel-desc { color: var(--sb-muted); font-size: 11px; margin-top: 5px; line-height: 1.6; }
        .sb-text-button { border: 0; background: transparent; color: #c4b5fd; font-size: 11px; display: inline-flex; align-items: center; gap: 5px; }

        .sb-opportunities { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
        .sb-opportunity {
          display: flex; flex-direction: column; gap: 12px; padding: 17px;
          border: 1px solid var(--sb-border); border-radius: 15px;
          background: linear-gradient(145deg,rgba(25,24,36,.85),rgba(18,18,26,.9));
          min-width: 0; transition: border-color .2s,transform .2s;
        }
        .sb-opportunity:hover { border-color: rgba(167,139,250,.3); transform: translateY(-2px); }
        .sb-opportunity-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .sb-opportunity-icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0; }
        .sb-opportunity-icon.violet { background: rgba(167,139,250,.13); color: #c4b5fd; }
        .sb-opportunity-icon.blue { background: rgba(96,165,250,.13); color: #93c5fd; }
        .sb-opportunity-icon.green { background: rgba(74,222,128,.12); color: #86efac; }
        .sb-category { color: #b8b1ca; font-size: 9px; letter-spacing: 1.1px; text-transform: uppercase; }
        .sb-opportunity h3 { font-size: 13px; margin: 7px 0 5px; line-height: 1.5; }
        .sb-org { color: var(--sb-muted); font-size: 10px; }
        .sb-description { color: #a29eb0; font-size: 11px; line-height: 1.7; margin: 0; }
        .sb-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .sb-tag { border: 1px solid var(--sb-border); background: rgba(255,255,255,.025); color: #aaa6b9; border-radius: 6px; padding: 5px 7px; font-size: 9px; }
        .sb-opportunity-meta { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; color: var(--sb-muted); font-size: 10px; margin-top: auto; }
        .sb-opportunity-actions { display: flex; gap: 7px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid var(--sb-border); }
        .sb-opportunity-actions .sb-button { flex: 1; }

        .sb-search-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 21px 0; }
        .sb-search { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--sb-border); background: #13131c; border-radius: 11px; color: var(--sb-muted); }
        .sb-search input { width: 100%; padding: 12px 0; border: 0; outline: 0; background: transparent; color: var(--sb-text); font-size: 12px; }

        .sb-select, .sb-input {
          width: 100%; background: #13131c; border: 1px solid var(--sb-border);
          color: var(--sb-text); border-radius: 10px; padding: 11px 12px; outline: 0; font-size: 12px;
        }
        .sb-select:focus, .sb-input:focus { border-color: rgba(167,139,250,.55); }
        .sb-category-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 18px; }
        .sb-category-pill { padding: 8px 12px; border-radius: 9px; border: 1px solid var(--sb-border); color: #aaa6b9; background: #13131c; font-size: 10px; }
        .sb-category-pill.active { color: #e9ddff; background: rgba(139,92,246,.16); border-color: rgba(167,139,250,.3); }

        .sb-task-list { display: grid; gap: 8px; margin-top: 15px; }
        .sb-task { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(255,255,255,.02); border: 1px solid var(--sb-border); border-radius: 10px; }
        .sb-checkbox { width: 17px; height: 17px; accent-color: #a78bfa; flex-shrink: 0; }
        .sb-task-title { flex: 1; font-size: 11px; line-height: 1.5; }
        .sb-task-title.done { color: #777386; text-decoration: line-through; }
        .sb-progress { height: 5px; border-radius: 10px; background: #292635; overflow: hidden; margin-top: 12px; }
        .sb-progress-fill { height: 100%; background: linear-gradient(90deg,#7c3aed,#c4b5fd); border-radius: 10px; }
        .sb-inline-form { display: flex; gap: 7px; margin-top: 13px; }

        .sb-empty { text-align: center; padding: 35px 18px; border: 1px dashed rgba(255,255,255,.13); border-radius: 14px; color: var(--sb-muted); }
        .sb-empty svg { color: #a78bfa; margin-bottom: 10px; }
        .sb-empty h3 { color: #e5e1ee; font-size: 13px; margin: 0 0 7px; }
        .sb-empty p { font-size: 11px; line-height: 1.7; margin: 0 auto; max-width: 390px; }
        .sb-empty-button { margin-top: 16px; }

        .sb-disclaimer { display: flex; align-items: flex-start; gap: 9px; padding: 12px 13px; background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.15); color: #d6c39c; border-radius: 10px; font-size: 10px; line-height: 1.7; margin-bottom: 17px; }
        .sb-disclaimer svg { flex-shrink: 0; margin-top: 1px; color: #fbbf24; }

        .sb-form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 15px; }
        .sb-field { display: grid; gap: 7px; }
        .sb-field label { font-size: 11px; color: #c9c4d5; }
        .sb-field-action { align-content: start; }
        .sb-field small { color: var(--sb-muted); font-size: 10px; line-height: 1.5; }

        .sb-chip-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .sb-chip-button { display: inline-flex; align-items: center; gap: 5px; padding: 8px 10px; border: 1px solid var(--sb-border); border-radius: 8px; background: #171722; color: #a7a3b5; font-size: 10px; }
        .sb-chip-button.active { color: #e7ddff; border-color: rgba(167,139,250,.45); background: rgba(139,92,246,.15); }
        .sb-profile-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .sb-profile-avatar { width: 52px; height: 52px; font-size: 15px; }
        .sb-profile-heading h2 { margin: 0 0 5px; font-size: 17px; }
        .sb-profile-heading p { margin: 0; color: var(--sb-muted); font-size: 11px; }
        .sb-profile-section { margin-top: 25px; }
        .sb-profile-section h3 { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 5px; }
        .sb-profile-notice { margin-top: 25px; margin-bottom: 0; }
        .sb-applications-panel { margin-top: 18px; }
        .sb-application-row { display: grid; grid-template-columns: minmax(0,1fr) 150px 35px; gap: 12px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--sb-border); }
        .sb-application-row:last-child { border-bottom: 0; }
        .sb-application-name { font-size: 12px; font-weight: 650; line-height: 1.5; }
        .sb-application-org { color: var(--sb-muted); font-size: 10px; margin-top: 4px; }

        .sb-match-score { display: flex; gap: 16px; align-items: center; padding: 17px; border: 1px solid var(--sb-border); border-radius: 13px; background: rgba(255,255,255,.02); margin-bottom: 19px; }
        .sb-score-circle { width: 68px; height: 68px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; background: conic-gradient(#a78bfa var(--sb-score),#2a2736 0); position: relative; }
        .sb-score-circle::before { content: ""; position: absolute; inset: 6px; background: #171622; border-radius: 50%; }
        .sb-score-circle span { position: relative; font-weight: 800; font-size: 15px; }
        .sb-match-score h3 { margin: 0 0 6px; font-size: 13px; }
        .sb-match-score p { color: var(--sb-muted); font-size: 10px; line-height: 1.6; margin: 0; }
        .sb-result-section { margin: 16px 0; }
        .sb-result-section h4 { display: flex; align-items: center; gap: 7px; margin: 0 0 10px; font-size: 11px; }
        .sb-result-list { display: grid; gap: 12px; }
        .sb-result-item { display: flex; align-items: flex-start; gap: 8px; color: #bcb7c9; font-size: 10px; line-height: 1.7; }
        .sb-result-item svg { flex-shrink: 0; margin-top: 2px; }
        .sb-modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); }
        .sb-modal { width: min(760px,100%); max-height: 90vh; overflow: auto; background: #12121a; border: 1px solid rgba(255,255,255,.13); border-radius: 18px; padding: 23px; box-shadow: 0 25px 100px rgba(0,0,0,.5); }
        .sb-modal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; margin-bottom: 20px; }
        .sb-modal-header h2 { margin: 7px 0 5px; font-size: 19px; }
        .sb-modal-header p { margin: 0; color: var(--sb-muted); font-size: 11px; line-height: 1.6; }
        .sb-modal-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-top: 20px; }

        .sb-assistant { display: flex; flex-direction: column; min-height: 440px; }
        .sb-chat-messages { flex: 1; display: grid; align-content: start; gap: 13px; padding: 6px 0 20px; }
        .sb-chat-message { display: flex; gap: 9px; align-items: flex-start; }
        .sb-chat-message.user { flex-direction: row-reverse; }
        .sb-chat-avatar { width: 29px; height: 29px; border-radius: 9px; display: grid; place-items: center; background: rgba(139,92,246,.15); color: #c4b5fd; flex-shrink: 0; }
        .sb-chat-bubble { max-width: 83%; padding: 12px; border: 1px solid var(--sb-border); border-radius: 4px 12px 12px 12px; background: #191822; color: #c9c4d5; font-size: 11px; line-height: 1.8; white-space: pre-wrap; }
        .sb-chat-message.user .sb-chat-bubble { border-radius: 12px 4px 12px 12px; background: rgba(139,92,246,.13); color: #e4dafa; }
        .sb-chat-form { display: flex; gap: 8px; border-top: 1px solid var(--sb-border); padding-top: 14px; }
        .sb-chat-form input { flex: 1; min-width: 0; border: 1px solid var(--sb-border); border-radius: 10px; padding: 12px; background: #13131c; color: white; outline: 0; font-size: 11px; }
        .sb-chat-form button { width: 42px; border: 0; border-radius: 10px; background: #a78bfa; color: #1b1230; display: grid; place-items: center; }
        .sb-quick-prompts { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .sb-quick-prompts button { background: #191822; border: 1px solid var(--sb-border); color: #b6b0c7; border-radius: 8px; padding: 8px 10px; font-size: 10px; }

        .sb-learning-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
        .sb-learning-card { display: flex; flex-direction: column; padding: 18px; border: 1px solid var(--sb-border); background: var(--sb-panel); border-radius: 14px; }
        .sb-learning-card h3 { font-size: 13px; margin: 13px 0 7px; }
        .sb-learning-card p { color: var(--sb-muted); font-size: 11px; line-height: 1.7; margin: 0 0 12px; }
        .sb-learning-card ul { color: #bcb7c9; font-size: 11px; line-height: 1.9; padding-left: 18px; margin: 0 0 18px; }
        .sb-learning-card .sb-button { width: 100%; margin-top: auto; }

        .sb-footer { padding-top: 20px; margin-top: 30px; border-top: 1px solid var(--sb-border); color: #777386; font-size: 10px; line-height: 1.7; }
        .sb-mobile-menu { display: none; }

        @media (max-width: 1100px) {
          .sb-sidebar { width: 220px; }
          .sb-content { padding: 24px; }
          .sb-topbar { padding: 15px 24px; }
          .sb-stats { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .sb-learning-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }

        @media (max-width: 800px) {
          .sb-sidebar { position: fixed; z-index: 90; top: 0; bottom: 0; left: 0; transform: translateX(-105%); transition: transform .25s; box-shadow: 20px 0 60px rgba(0,0,0,.3); }
          .sb-sidebar.open { transform: translateX(0); }
          .sb-mobile-menu { display: grid; }
          .sb-topbar { padding: 13px 17px; }
          .sb-content { padding: 20px 16px 35px; }
          .sb-grid, .sb-matcher { grid-template-columns: 1fr; }
          .sb-opportunities { grid-template-columns: 1fr; }
          .sb-hero { padding: 22px; }
          .sb-hero h1 { font-size: 24px; }
          .sb-hero-art { width: 80px; height: 80px; border-radius: 23px; }
          .sb-date { display: none; }
          .sb-learning-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .sb-stats { gap: 9px; }
          .sb-stat { padding: 13px; }
          .sb-stat-value { font-size: 22px; }
          .sb-stat-foot { line-height: 1.6; }
          .sb-hero-art { display: none; }
          .sb-heading { font-size: 23px; }
          .sb-form-grid { grid-template-columns: 1fr; }
          .sb-application-row { grid-template-columns: minmax(0,1fr) 110px 30px; gap: 6px; }
          .sb-modal { padding: 17px; }
        }
      `}</style>

      <div className="sb-layout">
        <aside className={`sb-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sb-brand">
            <div className="sb-brand-mark">
              <GraduationCap size={21} />
            </div>
            <div>
              <div className="sb-brand-name">ScholarBridge AI</div>
              <div className="sb-brand-sub">YOUR FUTURE, CONNECTED</div>
            </div>
          </div>

          <nav className="sb-nav">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const previous = navItems[index - 1];

              return (
                <div key={item.label}>
                  {(!previous || previous.section !== item.section) && (
                    <div className="sb-nav-section">{item.section}</div>
                  )}

                  <button
                    className={activePage === item.label ? "active" : ""}
                    onClick={() => goTo(item.label)}
                  >
                    <Icon size={17} />
                    {item.label}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="sb-sidebar-bottom">
            <div className="sb-side-note">
              <Sparkles size={18} color="#c4b5fd" />
              <h4>Keep moving forward</h4>
              <p>
                Small, consistent steps can help you build your skills and
                prepare for future opportunities.
              </p>
            </div>
          </div>
        </aside>

        <main className="sb-main">
          <header className="sb-topbar">
            <div className="sb-topbar-left">
              <button
                className="sb-icon-button sb-mobile-menu"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Toggle navigation"
              >
                <Menu size={18} />
              </button>

              <div>
                <div className="sb-page-kicker">STUDENT WORKSPACE</div>
                <div className="sb-page-title">{activePage}</div>
              </div>
            </div>

            <div className="sb-top-actions">
              <span className="sb-date">{currentDate}</span>

              <button
                className="sb-icon-button"
                title="Go to your action plan"
                onClick={() => goTo("Overview")}
              >
                <Bell size={16} />
              </button>

              <button
                className="sb-avatar"
                title="Open your profile"
                onClick={() => goTo("My Profile")}
              >
                {initials}
              </button>
            </div>
          </header>

          <div className="sb-content">
            {pageContent}

            <footer className="sb-footer">
              <strong>ScholarBridge AI · Your Future, Connected.</strong>
              <br />
              Prototype notice: Opportunities link to official portals, but eligibility matching is informational and does not establish official eligibility. Verify current requirements and deadlines before applying. The assistant uses rule-based responses. Profile and tracker data are stored in this browser.

            </footer>
          </div>
        </main>
      </div>

      {selectedOpportunity && (
        <EligibilityModal opportunity={selectedOpportunity} />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, foot, color }) {
  return (
    <div className="sb-stat">
      <div className="sb-stat-top">
        <span>{label}</span>
        <div className={`sb-stat-icon ${color}`}>
          <Icon size={17} />
        </div>
      </div>
      <div className="sb-stat-value">{value}</div>
      <div className="sb-stat-foot">{foot}</div>
    </div>
  );
}

function PanelHeader({ title, description, action, onAction }) {
  return (
    <div className="sb-panel-header">
      <div>
        <h2 className="sb-panel-title">{title}</h2>
        {description && <div className="sb-panel-desc">{description}</div>}
      </div>

      {action && (
        <button className="sb-text-button" onClick={onAction}>
          {action}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="sb-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default App;