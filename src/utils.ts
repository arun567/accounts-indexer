export async function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export async function sleep1(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function formatDate(date: Date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}
