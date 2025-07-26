export async function getSummaryFromGemini(input,wordCount){
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      contents:[{
        parts:[{
          text:`Summarize the following content with a title in around ${wordCount} words & strictly no other text:\n\n${input}`
        }]
      }]
    })
  });

  const data=await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text||"Failed to generate summary.";
}
