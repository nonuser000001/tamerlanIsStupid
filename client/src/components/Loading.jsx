import '../styles/Loading.css'
import { LoaderCircle } from 'lucide-react'
export const Loading = () => {
  return (
    <div className='loading'>
        <LoaderCircle className='Loading-icon'>
            <p> Loading...</p>
        </LoaderCircle>
    </div>
  )
}