import { useEffect, useState } from "react"
import { API } from "../api/api"
import { useParams, useNavigate } from "react-router-dom"

function Stories(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [stories,setStories] = useState([])
  const [index,setIndex] = useState(0)

  useEffect(()=>{
    API.get(`/story/user/${id}`).then(res=> setStories(res.data.stories))
  },[id])

  useEffect(()=>{
    if(!stories.length) return
    const timer = setTimeout(()=>{
      if(index < stories.length-1) setIndex(i=>i+1)
      else navigate(-1)
    },5000)
    return ()=> clearTimeout(timer)
  },[index,stories])

  if(!stories.length) return null

  return (
    <div className="fixed inset-0 bg-black flex flex-col">

      {/* progress bar */}
      <div className="flex gap-1 p-2">
        {stories.map((_,i)=>(
          <div key={i} className="flex-1 h-1 bg-gray-600">
            <div className={`h-1 bg-white ${i<=index?"w-full":"w-0"}`} />
          </div>
        ))}
      </div>

      {/* story media */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={`http://localhost:5000/upload/story/${stories[index].media}`}
          className="max-h-full max-w-full"
        />
      </div>

      {/* navigation tap zones */}
      <div className="absolute inset-0 flex">
        <div onClick={()=> setIndex(i=> Math.max(i-1,0))} className="flex-1" />
        <div onClick={()=> {
          if(index < stories.length-1) setIndex(i=>i+1)
          else navigate(-1)
        }} className="flex-1" />
      </div>
    </div>
  )
}

export default Stories
