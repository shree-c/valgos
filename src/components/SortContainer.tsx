import Bar from "./Bar";
import { createElement, useEffect, useState } from 'react'
import { Sorting } from '../algos/Sorting';
import { Algorithms } from '../algos/Sorting';

function returnRandomIntegerArray(existingArray: number[], arrayLength: number): number[] {
  if (existingArray.length > arrayLength) {
    return existingArray.slice(0, arrayLength)
  }
  for (let i = existingArray.length; i < arrayLength; i++) {
    existingArray[i] = Math.floor(Math.random() * 200)
  }
  return existingArray;
}

function createBars(barValues: number[], toBeHighlighted: number[]): any[] {
  const barArray = new Array(barValues.length);
  for (let i = 0; i < barArray.length; i++) {
    let highlight = false;
    if (toBeHighlighted.includes(i)) {
      highlight = true;
    }
    barArray[i] = createElement(Bar, { value: barValues[i], highlight })
  }
  return barArray;
}

interface argObj {
  numberOfBars: number,
  delay: number
  algorithm: Algorithms,
  eventBoy: EventTarget
  sorter: Sorting
}


function SortContainer({ numberOfBars, delay, eventBoy, algorithm, sorter }: argObj) {
  const [arrayValues, setArrayValues] = useState<number[]>([])
  const [highlightArray, setHighlightArray] = useState<number[]>([])
  const handleReset = () => {
    sorter.stopSorting()
    setArrayValues([...returnRandomIntegerArray([], numberOfBars)])
  }
  const handleSorting = () => {
    sorter.sortFuns[algorithm](arrayValues, delay, setArrayValues, setHighlightArray).catch(() => {
      alert("A sort function is running already")
    })
  }
  useEffect(() => {
    eventBoy.addEventListener('startSorting', handleSorting)
    eventBoy.addEventListener('stopSorting', () => {
      sorter.stopSorting.call(sorter)
    })
    eventBoy.addEventListener('resetBars', handleReset)
    return () => {
      eventBoy.removeEventListener('startSorting', handleSorting)
      eventBoy.removeEventListener('stopSorting', () => {
        sorter.stopSorting.call(sorter)
      })
      eventBoy.removeEventListener('resetBars', handleReset)
    }
  }, [arrayValues, algorithm])
  useEffect(() => {
    setArrayValues([...returnRandomIntegerArray(arrayValues, numberOfBars)])
  }, [numberOfBars])
  return createElement('div', { className: 'barCon' }, ...createBars(arrayValues, highlightArray))
}

export default SortContainer
