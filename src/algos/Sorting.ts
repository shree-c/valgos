import { SetStateAction } from 'react'

function swap(valuesArray: number[], from: number, to: number): void {
  [valuesArray[from], valuesArray[to]] = [valuesArray[to], valuesArray[from]]
}

async function wait(delay: number): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(resolve, delay)
  })
}
async function qs(toBeSroted: number[], lo: number, hi: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, wait: (delay: number) => Promise<void>, delay: number, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<void> {
  if (lo >= hi || lo < 0)
    return

  const pivotIndex = await partition(toBeSroted, lo, hi, stateUpdater, delay, wait, setHighlightArray)
  await qs(toBeSroted, lo, pivotIndex - 1, stateUpdater, wait, delay, setHighlightArray)
  await qs(toBeSroted, pivotIndex + 1, hi, stateUpdater, wait, delay, setHighlightArray)

}

async function partition(toBePartitioned: number[], lo: number, hi: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, delay: number, wait: (delay: number) => Promise<void>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<number> {
  const pivot = toBePartitioned[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (toBePartitioned[j] <= pivot) {
      i++;
      setHighlightArray([i, j]);
      [toBePartitioned[i], toBePartitioned[j]] = [toBePartitioned[j], toBePartitioned[i]]
      await wait(delay);
      stateUpdater([...toBePartitioned])
      setHighlightArray([])
    }
  }
  i++;
  setHighlightArray([i, hi])
  await wait(delay);
  [toBePartitioned[i], toBePartitioned[hi]] = [toBePartitioned[hi], toBePartitioned[i]]
  setHighlightArray([])
  return i
}

async function delayedBubbleSort(this: Sorting, valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<void> {
  if (this._running)
    return
  this._running = true
  let swapped = true;
  while (swapped) {
    if (!this._running)
      break;
    swapped = false;
    for (let i = 1; i < valuesArray.length; i++) {
      if (valuesArray[i - 1] > valuesArray[i]) {
        setHighlightArray([i - 1, i])
        await wait(delay);
        swap(valuesArray, i - 1, i);
        swapped = true
        stateUpdater([...valuesArray])
        setHighlightArray([])
      }
    }
  }
  this._running = false;
}

async function delayedInsersionSort(valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>): Promise<void> {
  for (let i = 1; i < valuesArray.length; i++) {
    for (let j = i; j > 0 && valuesArray[j - 1] > valuesArray[j]; j--) {
      setHighlightArray([j - 1, j])
      await wait(delay)
      swap(valuesArray, j - 1, j)
      stateUpdater([...valuesArray])
      setHighlightArray([])
    }
  }
}

interface sortFuns {
  'b': (valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) => Promise<void>
  'q': (valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) => Promise<void>
  'i': (valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) => Promise<void>
}
export class Sorting {
  sortFuns: sortFuns
  _running: boolean
  constructor () {
    this.sortFuns = {
      'b': delayedBubbleSort.bind(this),
      'i': delayedInsersionSort.bind(this),
      'q': async function (valuesArray: number[], delay: number, stateUpdater: React.Dispatch<SetStateAction<number[]>>, setHighlightArray: React.Dispatch<SetStateAction<number[]>>) {
        return (await qs.call(this, valuesArray, 0, valuesArray.length - 1, stateUpdater, wait, delay, setHighlightArray));
      }
    }
    this._running = false
  }
  stopSorting() {
    this._running = false
  }
}
export type Algorithms = 'b' | 'i' | 'q'
