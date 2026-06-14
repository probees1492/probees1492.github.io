import HiddenSEO from "@/components/HiddenSEO";
import StageClient from "@/components/StageClient";
import PasswordGate from "@/components/PasswordGate";

export default function Page() {
  return (
    <main>
      <HiddenSEO />
      <PasswordGate>
        <StageClient />
      </PasswordGate>
    </main>
  );
}
