import { useEffect, useState } from "react"
import { Card } from "./components/Card"
import { GameHeader } from "./components/GameHeader"
import { WinMessage } from "./components/WinMessage"

const cardValues = [
  "🥝",
  "🍒",
  "🍇",
  "🍓",
  "🍌",
  "🍉",
  "🍊",
  "🍐",
  "🥝",
  "🍒",
  "🍇",
  "🍓",
  "🍌",
  "🍉",
  "🍊",
  "🍐"
]

function App() {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchCards , setMatchCards] = useState([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isLocked , setIsLocked] = useState(false)

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeGame =()=>{
    // shuffle the cards

    const shuffledCards = shuffleArray(cardValues)

    const finalCards = shuffledCards.map((value,index)=>({
      id:index,
      value,
      isFlipped:false,
      isMatched:false
    }))

    setCards(finalCards)
    setIsLocked(false)
    setMoves(0)
    setScore(0)
    setFlippedCards([])
    setMatchCards([])
  }

  useEffect(()=>{
    initializeGame()
  },[])

  const handleCardClick = (card)=>{
    if(card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2){
      return
    }
    const newCards = cards.map((c)=>{
      if(c.id === card.id){
        return{
          ...c,
          isFlipped:true
        }
      }else{
        return c
      }
    })

    setCards(newCards)

    const newFlippedCards = [...flippedCards, card.id]
    setFlippedCards(newFlippedCards)


    if(flippedCards.length === 1){
      setIsLocked(true)
      const firstCard = cards[flippedCards[0]]
      if(firstCard.value === card.value){
        setTimeout(()=>{
          setMatchCards((prev)=>[...prev,firstCard.id,card.id])
          setScore((prev)=>prev+1)
        setCards((prev)=>
        prev.map((c)=>{
          if(c.id === card.id || c.id === firstCard.id){
            return{
              ...c,
              isMatched:true
            }
          }else{
            return c
          }
        }))
        setFlippedCards([])
        setIsLocked(false)
        },500)
        
      }else{
        setTimeout(()=>{
          const flippedBackCard = newCards.map((c)=>{
            if(newFlippedCards.includes(c.id) || c.id === card.id){
              return{...c,isFlipped:false}
            }else{
              return c;
            }
          })
          setCards(flippedBackCard)
          setIsLocked(false)
          setFlippedCards([])
        },1000)
      }
      setMoves((prev)=>prev+1)
    }
  }

  const isGameComplete = matchCards.length === cards.length

  return (
    <div className="app">
      <GameHeader score={score} moves={moves} OnReset={initializeGame}/>
      {isGameComplete && <WinMessage moves={moves}/>}
      <div className="cards-grid">
        {cards.map((card)=>(
          <Card card={card} onClick={handleCardClick}/>
        ))}
      </div>
    </div>
  )
}

export default App
