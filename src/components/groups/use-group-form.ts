import { useState } from "react";
import { useRouter } from "next/navigation";

export function useGroupForm(sectionCode: string, initialData?: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [groupName, setGroupName] = useState(initialData?.groupName || "");
  const [leaderName, setLeaderName] = useState(
    initialData?.leaderName || initialData?.members?.[0]?.fullName || ""
  );
  const [leaderReg, setLeaderReg] = useState(
    initialData?.leaderReg || initialData?.members?.[0]?.regNumber || ""
  );
  const [m2Name, setM2Name] = useState(
    initialData?.m2Name || initialData?.members?.[1]?.fullName || ""
  );
  const [m2Reg, setM2Reg] = useState(
    initialData?.m2Reg || initialData?.members?.[1]?.regNumber || ""
  );
  const [optionals, setOptionals] = useState<{ fullName: string; regNumber: string }[]>(
    initialData?.members?.slice(2) || []
  );
  const [ideaName, setIdeaName] = useState(initialData?.project?.ideaName || "");
  const [description, setDescription] = useState(initialData?.project?.description || "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.project?.projectPdfUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.project?.githubUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.project?.websiteUrl || "");

  const addOptional = () => {
    if (optionals.length < 5) setOptionals([...optionals, { fullName: "", regNumber: "" }]);
  };
  const updateOptional = (idx: number, field: "fullName" | "regNumber", val: string) => {
    const updated = [...optionals];
    updated[idx][field] = val;
    setOptionals(updated);
  };
  const removeOptional = (idx: number) => {
    setOptionals(optionals.filter((_, i) => i !== idx));
  };

  return {
    state: { groupName, leaderName, leaderReg, m2Name, m2Reg, optionals, ideaName, description, pdfUrl, githubUrl, websiteUrl, loading, errorMsg },
    setters: { setGroupName, setLeaderName, setLeaderReg, setM2Name, setM2Reg, setIdeaName, setDescription, setPdfUrl, setGithubUrl, setWebsiteUrl, setLoading, setErrorMsg },
    handlers: { addOptional, updateOptional, removeOptional, router },
  };
}
