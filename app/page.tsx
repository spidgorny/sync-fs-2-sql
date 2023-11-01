import "finderjs/example/finderjs.css";
import { ReactFinder } from "./react-finder";
import FinderView from "@/app/finder-view";
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
