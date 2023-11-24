/*
 * @Description: 本地存储
 * @Author: Sunly
 * @Date: 2023-11-17 06:39:52
 */
import { useState } from "react";

function useLocalStorage<T>(key: string, initialVal: T) {
  const [storage, setStorage] = useState<T>(() => {
    try {
      const val = localStorage.getItem(key);
      return val == null ? initialVal : JSON.parse(val);
    } catch (error) {
      console.error(error);
      return initialVal;
    }
  });

  const setVal = (key: string, val: T | ((arg: T) => T)) => {
    try {
      const newVal = val instanceof Function ? val(storage) : val;
      setStorage(newVal);
      localStorage.setItem(key, JSON.stringify(newVal));
    } catch (error) {
      console.log(error);
    }
  };

  return [storage, setVal] as const;
}

export { useLocalStorage };
