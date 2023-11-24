/*
 * @Description: 判断是否点击了外面
 * @Author: Sunly
 * @Date: 2023-11-17 09:54:24
 */
import { useEffect } from "react";

function useClickOutside(
  refObj: React.RefObject<HTMLElement>,
  cb: () => unknown
) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!refObj.current?.contains(e.target as Node)) {
      cb();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
}

export { useClickOutside };
