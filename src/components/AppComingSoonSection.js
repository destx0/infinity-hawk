import Iphone15Pro from "@/components/magicui/iphone-15-pro";

export default function AppComingSoonSection() {
	return (
		<section className="py-16 bg-gray-100">
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="md:w-1/2 mb-8 md:mb-0">
						<div className="relative w-64 h-[500px] mx-auto">
							<Iphone15Pro
								className="w-full h-full"
								src="https://via.placeholder.com/430x880"
							/>
						</div>
					</div>
					<div className="md:w-1/2 text-center md:text-left">
						<h2 className="text-3xl font-bold mb-4">
							Our App is Coming Soon!
						</h2>
						<p className="text-xl mb-8">
							Stay tuned for our mobile app launch!
						</p>
						<div className="flex flex-col sm:flex-row justify-start md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
							<a
								href="#"
								className="inline-flex items-center justify-center w-64 h-14 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
							>
								<svg
									className="w-6 h-6 m-2 -ml-4"
									viewBox="0 0 384 512"
									fill="currentColor"
								>
									<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
								</svg>
								<span>Download on the App Store</span>
							</a>
							<a
								href="#"
								className="inline-flex items-center justify-start w-64 h-14 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
							>
								<svg
									className="w-5 h-5 m-4 ml-6"
									viewBox="0 0 512 512"
									fill="currentColor"
								>
									<path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
								</svg>
								<span>Download on Google Play</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
