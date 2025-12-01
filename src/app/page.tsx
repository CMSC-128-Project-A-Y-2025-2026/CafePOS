import SelectionMenu from "@/components/SelectionMenu";
import { Montserrat } from "next/font/google";
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function Home() {
  return (
    <main>
      <SelectionMenu />
    </main>
  );
}
