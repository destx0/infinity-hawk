import { MagicCard } from "@/components/magicui/magic-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Image from "next/image";

const exams = {
  SSC: {
    icon: "/ssc.png",
    exams: [
      "SSC CGL",
      "SSC GD",
      "SSC Selection Post",
      "SSC CHSL",
      "SSC MTS",
      "SSC JE CE",
      "SSC JE EE",
      "SSC Steno Gd C & D",
      "SSC CPO",
      "Delhi Police",
      "CSIR ASO",
      "SSC UDC Exam",
    ],
  },
  RAILWAY: {
    icon: "/ssc.png",
    exams: [
      "RRB ALP",
      "RRB Group D",
      "RRB Tech",
      "RPF",
      "RPF SI",
      "RPSF",
      "RRB Staff Nurse",
      "RRB JE",
      "RRB NTPC",
    ],
  },
  WB: {
    icon: "/ssc.png",
    exams: [
      "Kolkata Police",
      "Kolkata SI",
      "Kolkata Constable",
      "Kolkata Sergeant",
      "WBPSC Food",
      "WBPSC JE",
    ],
  },
  BANKING: {
    icon: "/ssc.png",
    exams: ["SBI PO", "SBI Clerk", "IBPS PO", "IBPS Clerk"],
  },
};

const ExamCard = ({ examName, iconSrc }) => {
  return (
    <MagicCard
      className="cursor-pointer flex-col items-center justify-center shadow-2xl p-4 h-48 w-48"
      gradientColor="#D9D9D955"
    >
      <Image src={iconSrc} alt={examName} width={64} height={64} />
      <h3 className="mt-4 text-lg font-semibold text-center">{examName}</h3>
    </MagicCard>
  );
};

const ExamGrid = ({ examList, iconSrc }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {examList.map((exam) => (
      <ExamCard key={exam} examName={exam} iconSrc={iconSrc} />
    ))}
  </div>
);

export default function AllExamsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">All Exams</h2>
        <Tabs defaultValue="ssc" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(exams).map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(exams).map(([category, { icon, exams }]) => (
            <TabsContent key={category} value={category.toLowerCase()}>
              <ExamGrid examList={exams} iconSrc={icon} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}