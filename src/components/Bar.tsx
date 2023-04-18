function Bar({ value = 0, highlight}) {
  return (
    <div style={{height: `${value}px`}} className={`bar ${(highlight)? 'highlight': ''}`}>
    </div>
  )
}

export default Bar
