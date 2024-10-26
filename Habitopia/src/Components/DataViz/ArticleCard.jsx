import React from 'react'
import Reply from '../Groq/Reply'

const ArticleCard = ({habit}) => {
  return (
    <div>
        <h1 className='text-white text-2xl font-bold'>Description: {habit.desc}</h1>
        <h1 className='text-white text-2xl font-bold'>Purpose: {habit.purpose}</h1>
      <div className='text-white'>
        <Reply prompt={"this is my habit: "+habit.habitName+". This is the description of my habit:"+habit.desc+". This is the purpose of my habit: "+habit.purpose+". Give me a short 300 word article on how I should start and continue this habit, benefits of this habit, how to keep consistency etc. DO NOT DO ANY FORMATTING OR BOLDS OR POINTS OR NUMBERING. SINGLE PARAGRAPH TYPE."} /> 
        </div>
    </div>
  )
}

export default ArticleCard