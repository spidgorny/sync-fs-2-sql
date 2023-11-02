import FinderView from "@/components/finder-view/finder-view";
import { Onboarding } from "@/components/onboarding/onboarding";

export default function Home() {
	return (
		<main className="h-full p-1">
			<Onboarding>
				<FinderView />
			</Onboarding>
		</main>
	);
}
