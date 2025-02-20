import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ClientLayout } from "./ClientLayout";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "infinity mock",
	description: "infinity mock",
	viewport: {
		// ... your existing viewport settings
	},
	links: [
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
		},
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
	],
};

export default function RootLayout({ children }) {
	const headersList = headers();
	const isExamPage = headersList.get("x-is-exam-page") === "1";

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ClientLayout isExamPage={isExamPage}>{children}</ClientLayout>
			</body>
		</html>
	);
}
