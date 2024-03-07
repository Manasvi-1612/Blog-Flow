import { useEffect } from "react"

const Landing = ({children}) => {

  useEffect(()=>{
    console.log(children.ref.current)

    const heading=children.ref.current
    
    const spans = Array.from(heading.querySelectorAll("span"));


    function setAnimation() {
      this.classList.add("h1-hover");
    }

  function deleteAnimation() {
      const spanElement = this;
      setTimeout(() => {
          spanElement.classList.remove("h1-hover");
      }, 150);
  }
  
  spans.forEach((span) => span.addEventListener("mouseenter", setAnimation));
  spans.forEach((span) => span.addEventListener("mouseleave", deleteAnimation));

  })

  return (
    <div>
      {children}
    </div>
  )
}

export default Landing