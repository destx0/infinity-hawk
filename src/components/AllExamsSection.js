import { MagicCard } from "@/components/magicui/magic-card";
import Image from "next/image";

const allExams = [
  { name: "SSC CGL", icon: "/ssc.png", category: "SSC" },
  { name: "SSC GD", icon: "/ssc.png", category: "SSC" },
  { name: "SSC Selection Post", icon: "/ssc.png", category: "SSC" },
  // ... Add all other exams here
  { name: "RRB ALP", icon: "/ssc.png", category: "RAILWAY" },
  { name: "RRB Group D", icon: "/ssc.png", category: "RAILWAY" },
  // ... Add all other Railway exams
  { name: "Kolkata Police", icon: "/ssc.png", category: "WB" },
  { name: "Kolkata SI", icon: "/ssc.png", category: "WB" },
  // ... Add all other WB exams
  { name: "SBI PO", icon: "/ssc.png", category: "BANKING" },
  { name: "SBI Clerk", icon: "/ssc.png", category: "BANKING" },
  // ... Add all other Banking exams
];

const ExamCard = ({ examName, iconSrc }) => {
  return (
    <MagicCard
      className="flex-shrink-0 cursor-pointer flex flex-col items-center justify-center shadow-2xl p-4 h-48 w-48"
      gradientColor="#D9D9D955"
    >
      <div className="flex justify-center w-full">
        <Image src={iconSrc} alt={examName} width={64} height={64} />
      </div>
      <h3 className="mt-4 text-lg  text-center">{examName}</h3>
    </MagicCard>
  );
};

export default function AllExamsSection() {
  return (
    <section className="py-16 bg-slate-50 ">
      <div className=" ">
        <h2 className="text-3xl font-bold text-center mb-8">All Exams</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-20">
            {allExams.map((exam) => (
              <ExamCard key={exam.name} examName={exam.name} iconSrc={exam.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}