import "finderjs/example/finderjs.css";
import {ReactFinder} from "./react-finder";
import FinderView from "@/app/finder-view";

export default function Home() {
    return (
        <main className="p-3 bg-white">
            <FinderView/>
        </main>
    );
}
