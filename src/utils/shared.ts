/*
 * @Description: 共享方法
 * @Author: Sunly
 * @Date: 2023-11-25 10:31:29
 */
/**
 * @description 获取经过的时间
 * @param time 时间戳
 * @returns  经过的时间
 */
export function getPassTime(time: number) {
  const now = new Date().getTime();
  const DAY = 24 * 60 * 60 * 1000;
  const HOUR = 60 * 60 * 1000;
  const passTime = now - time;
  // 如果不到一天，显示小时
  if (passTime < DAY) {
    return `${Math.floor(passTime / HOUR)}小时前`;
  }
  // 如果超过一天，显示天数和小时数
  return `${Math.floor(passTime / DAY)}天${Math.floor(
    (passTime % DAY) / HOUR
  )}小时前`;
}

/**
 * @description 温度中文说明
 */
export enum IVesselTemperature {
  high = "35℃ 室温",
  low = "4℃ 低温",
}
