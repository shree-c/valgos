import SortContainer from './components/SortContainer'
import { useState } from 'react'
import { Algorithms } from './algos/Sorting';
import './App.css'
import { Sorting } from './algos/Sorting';

const stopSorting = new Event('stopSorting')
const startSorting = new Event('startSorting')
const resetBars = new Event('resetBars')

function App() {
  const [algorithm, setAlgorithm] = useState<Algorithms>('b');
  const [numberOfBars, setNumberOfBars] = useState<number>(10)
  const eventBoy = new EventTarget()
  const sorter = new Sorting()
  const sort = () => {
    eventBoy.dispatchEvent(startSorting)
  }
  const refresh = () => {
    sorter.stopSorting()
    eventBoy.dispatchEvent(resetBars)
  }
  return (
    <div className='app'>
      <SortContainer sorter={sorter} numberOfBars={numberOfBars} algorithm={algorithm} eventBoy={eventBoy} />
      <button onClick={sort}>Sort</button>
      <button onClick={refresh}>Refresh</button>
      <button onClick={() => setNumberOfBars(numberOfBars + 1)}>+</button>
      <button onClick={() => setNumberOfBars((numberOfBars > 1) ? numberOfBars - 1 : numberOfBars)}>-</button>
      <select defaultValue={'b'} onChange={(v) => setAlgorithm(v.target.value as Algorithms)}>
        <option value="b"> bubbleSort </option>
        <option value="i"> insersionSort </option>
        <option value="q"> qsort </option>
      </select>
      <div> {numberOfBars}</div>
      <button onClick={() => { sorter.stopSorting() }}> Stop</button>
    </div>
  )
}

export default App
