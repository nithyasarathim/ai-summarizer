'use client'

import {useParams,useRouter} from 'next/navigation'
import {useEffect,useState} from 'react'

const SummaryPage=()=>{
  const {id}=useParams()
  const router=useRouter()
  const [summaryData,setSummaryData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    loadSummary()
  },[id])

  const loadSummary=()=>{
    try{
      const savedHistory=localStorage.getItem('summaryHistory')
      if(savedHistory){
        const history=JSON.parse(savedHistory)
        const foundItem=history.find(item=>item.id===id)

        if(foundItem){
          setSummaryData(foundItem)
        }else{
          setError('Summary not found')
        }
      }else{
        setError('No history found')
      }
    }catch(err){
      console.error('Error loading summary:',err)
      setError('Failed to load summary')
    }finally{
      setLoading(false)
    }
  }

  const handleDelete=()=>{
    if(!confirm('Are you sure you want to delete this summary?')) return

    try{
      const savedHistory=localStorage.getItem('summaryHistory')
      if(savedHistory){
        const history=JSON.parse(savedHistory)
        const updatedHistory=history.filter(item=>item.id!==id)
        localStorage.setItem('summaryHistory',JSON.stringify(updatedHistory))
        router.push('/')
      }
    }catch(err){
      console.error('Error deleting summary:',err)
      alert('Failed to delete summary')
    }
  }

  if(loading){
    return(
      <div className="min-h-screen text-white p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if(error){
    return(
      <div className="min-h-screen text-white p-6 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if(!summaryData){
    return(
      <div className="min-h-screen text-white p-6 flex items-center justify-center">
        <p>Summary data not available</p>
      </div>
    )
  }

  return(
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Summary Details</h1>
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="bg-gray-700 border hover:bg-gray-900 text-white px-4 py-2 rounded"
            >
              Delete Summary
            </button>
            <a
              href="/"
              className="bg-gray-700 border hover:bg-gray-900 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              ← Back to Summarizer
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 bg-[#1e2a3a] rounded border border-gray-600 col-span-2">
            <h2 className="text-xl font-semibold mb-4">Original Text</h2>
            <div className="h-[calc(100vh-250px)] overflow-y-auto">
              <p className="whitespace-pre-wrap">{summaryData.input}</p>
            </div>
          </div>

          <div className="p-4 bg-[#1e2a3a] rounded border border-gray-600">
            <h2 className="text-xl font-semibold mb-4">Generated Summary</h2>
            <div className="h-[calc(100vh-250px)] overflow-y-auto">
              <p className="whitespace-pre-wrap">{summaryData.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPage
