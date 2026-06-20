import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageLayout } from "@/components/layout/Navbar";
import { Dashboard } from "@/pages/Dashboard";
import { SentenceBuilder } from "@/pages/SentenceBuilder";
import { PronunciationLab } from "@/pages/PronunciationLab";
import { Classroom } from "@/pages/Classroom";
import { Lexicon } from "@/pages/Lexicon";
import { Students } from "@/pages/Students";
import { Courses } from "@/pages/Courses";
import { Records } from "@/pages/Records";

export default function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<SentenceBuilder />} />
          <Route path="/pronunciation" element={<PronunciationLab />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/lexicon" element={<Lexicon />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/records" element={<Records />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}
