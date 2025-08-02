'use client'

import {useState,useEffect} from "react";
import {useSession,signIn} from "next-auth/react";
import {getSummaryFromGemini} from "@/app/lib/gemini";
import {useRouter} from 'next/navigation';

const Page=()=>{
  const router=useRouter();
  const {data:session}=useSession();
  const [input,setInput]=useState("");
  const [isTitle,setIsTitle]=useState(false);
  const [isPoint,setIsPoint]=useState(false);
  const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(false);
  const [wordCount,setWordCount]=useState(50);
  const [currentSummary,setCurrentSummary]=useState(null);

  useEffect(()=>{
    const savedHistory=localStorage.getItem('summaryHistory');
    if(savedHistory){
      setHistory(JSON.parse(savedHistory));
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem('summaryHistory',JSON.stringify(history));
  },[history]);

  const handleGenerate=async()=>{
    if(!session){
      signIn();
      return;
    }

    if(!input.trim()) return;

    setLoading(true);

    try{
      const summary=await getSummaryFromGemini(input,wordCount,isTitle,isPoint);
      setCurrentSummary(summary);
    }catch(err){
      console.error("Gemini Error:",err);
      alert("Failed to get summary from Gemini.");
    }finally{
      setLoading(false);
    }
  };

  const handleSave=()=>{
    if(!currentSummary) return;

    const newItem={
      id:Date.now().toString(),
      input,
      summary:currentSummary
    };

    setHistory([newItem,...history]);
    setCurrentSummary(null);
    setInput("");
  };

  return(
    <div className="min-h-screen text-white p-6">
      <div className="flex gap-10 max-w-7xl mx-auto h-full">
        <div className="w-2/3 flex flex-col justify-start space-y-4">
          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Paste or type text to summarize..."
            rows={20}
            className="w-full p-4 rounded text-black bg-white"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 justify-between w-full">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white text-black px-6 py-2 rounded disabled:opacity-50"
              >
                {loading?"Generating...":"Generate Summary"}
              </button>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isTitle}
                    onChange={(e)=>setIsTitle(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Include Title
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPoint}   
                    onChange={(e)=>setIsPoint(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Use Bullet Points
                </label>
              </div>
              <label className="text-sm text-white">
                Word Count:
                <input
                  type="number"
                  min={50}
                  max={300}
                  value={wordCount}
                  onChange={(e)=>setWordCount(Number(e.target.value))}
                  className="ml-2 w-20 rounded text-black bg-white text-center p-2"
                />
              </label>
            </div>
          </div>

          {currentSummary&&(
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-[#1e2a3a] rounded border border-gray-600">
                <h3 className="text-lg font-semibold mb-2">Generated Summary</h3>
                <p>{currentSummary}</p>
              </div>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Summary
              </button>
            </div>
          )}
        </div>

        <div className="w-1/3">
          <h2 className="text-xl font-semibold sticky top-0 p-3">History</h2>
          {
            !session &&
            <div className="space-y-4 overflow-y-auto max-h-[500px] no-scrollbar">
              <p>Login to check saved histories !</p>
          </div>
          }
          {
            session &&
            <div className="space-y-4 overflow-y-auto max-h-[500px] no-scrollbar">
            {history.length===0&&(
              <p className="text-gray-300">No saved summaries yet.</p>
            )}
            {history.map((item)=>(
              <div key={item.id} className="p-4 bg-[#1e2a3a] rounded border border-gray-600 cursor-pointer" onClick={()=>router.push(`/summary/${item.id}`)}>
                <p className="text-sm text-gray-400 mt-2">Input Preview:</p>
                <p className="mb-2 line-clamp-2">{item.input}</p>
                <p className="text-sm text-gray-400">Summary Preview:</p>
                <p className="line-clamp-3">{item.summary}</p>
              </div>
            ))}
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Page;
