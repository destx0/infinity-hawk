import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

export default function ExamCard({ quiz }) {
	const router = useRouter();

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
		>
			<Card className="hover:shadow-xl transition-all duration-300 border-[hsl(var(--sidebar-border))] hover:border-[hsl(var(--sidebar-primary))]">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center justify-between">
						<span className="text-lg line-clamp-1 text-[hsl(var(--sidebar-background))]">
							{quiz.title.replace(/\.json$/, "")}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground line-clamp-2">
							{quiz.description || "Exam Paper"}
						</p>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center">
								<Clock className="h-4 w-4 mr-1" />
								<span>{quiz.duration || 45} mins</span>
							</div>
						</div>
						<Button
							className="w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] 
              hover:bg-[hsl(var(--sidebar-primary))] transition-all duration-300"
							onClick={() => router.push(`/exams/${quiz.id}`)}
						>
							Start Quiz
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
