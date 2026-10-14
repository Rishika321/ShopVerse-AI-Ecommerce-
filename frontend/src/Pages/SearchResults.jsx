import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Item from '../Components/Item/Item'
import './CSS/SearchResults.css'
import { API_URL } from '../config';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    if(!query){
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    fetch(`${API_URL}/aisearch`,{
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ query })
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.success){
        setResults(data.results);
      }else{
        setError(data.errors || "Search failed");
      }
      setLoading(false);
    })
    .catch((err)=>{
      console.log(err);
      setError("Couldn't reach the search service. Is the backend running?");
      setLoading(false);
    })
  },[query])

  return (
    <div className="searchresults">
      <h1>AI Search Results for "{query}"</h1>
      {loading && <p className="searchresults-status">Asking the AI to find the best matches...</p>}
      {error && <p className="searchresults-status searchresults-error">{error}</p>}
      {!loading && !error && results.length===0 && (
        <p className="searchresults-status">No matching products found. Try a different description.</p>
      )}
      <div className="searchresults-items">
        {results.map((item,i)=>(
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        ))}
      </div>
    </div>
  )
}
export default SearchResults
