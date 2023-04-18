import { SetStateAction } from 'react'

function swap(valuesArray: number[], from: number, to: number): void {
  [valuesArray[from], valuesArray[to]] = [valuesArray[to], valuesArray[from]]
}

async function delayedQsort(this: Sorting, valuesArray: number[], stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) {
  const partition = async (toBePartitioned: number[], lo: number, hi: number): Promise<number> => {
    const pivot = toBePartitioned[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (toBePartitioned[j] <= pivot) {
        i++;
        setHighlightArray([i, j]);
        [toBePartitioned[i], toBePartitioned[j]] = [toBePartitioned[j], toBePartitioned[i]]
        await this.wait()
        stateUpdater([...toBePartitioned])
        setHighlightArray([])
      }
    }
    i++;
    setHighlightArray([i, hi])
    await this.wait();
    [toBePartitioned[i], toBePartitioned[hi]] = [toBePartitioned[hi], toBePartitioned[i]]
    setHighlightArray([])
    return i
  }
  async function qs(toBeSroted: number[], lo: number, hi: number): Promise<void> {
    if (lo >= hi || lo < 0)
      return
    const pivotIndex = await partition(toBeSroted, lo, hi)
    await qs(toBeSroted, lo, pivotIndex - 1)
    await qs(toBeSroted, pivotIndex + 1, hi)
  }
  await qs(valuesArray, 0, valuesArray.length - 1)
}


async function delayedBubbleSort(this: Sorting, valuesArray: number[], stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<void> {
  console.log(this)
  if (this._running)
    return
  this._running = true
  let swapped = true;
  let timerId = setTimeout(async function findTheLargest(context) {
    swapped = false;
    for (let i = 1; i < valuesArray.length; i++) {
      if (valuesArray[i - 1] > valuesArray[i]) {
        setHighlightArray([i - 1, i])
        await context.wait();
        swap(valuesArray, i - 1, i);
        swapped = true
        stateUpdater([...valuesArray])
        setHighlightArray([])
      }
    }
    if (swapped && context._running) {
      timerId = setTimeout(findTheLargest, 0, context)
    }
  }, 0, this)
}

async function delayedInsersionSort(this: any, valuesArray: number[], stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<void> {
  for (let i = 1; i < valuesArray.length; i++) {
    for (let j = i; j > 0 && valuesArray[j - 1] > valuesArray[j]; j--) {
      setHighlightArray([j - 1, j])
      await this.wait()
      swap(valuesArray, j - 1, j)
      stateUpdater([...valuesArray])
      setHighlightArray([])
    }
  }
}

type sortFunction = (valuesArray: number[], stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) => Promise<void>
interface sortFuns {
  'b': sortFunction
  'q': sortFunction
  'i': sortFunction
}
export class Sorting {
  sortFuns: sortFuns
  _running: boolean
  delay: number
  constructor () {
    this.sortFuns = {
      'b': delayedBubbleSort.bind(this),
      'i': delayedInsersionSort.bind(this),
      'q': delayedQsort.bind(this)
    }
    this._running = false
    this.delay = 10
  }
  stopSorting = () => {
    this._running = false
  }
  setDelay = (delay: number) => {
    this.delay = delay
  }
  wait = async () => {
    return new Promise((resolve, _) => {
      setTimeout(resolve, this.delay)
    })
  }
}
export type Algorithms = 'b' | 'i' | 'q'
