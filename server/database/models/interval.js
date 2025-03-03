

function createIntervals(prevDate, currentDate, endDate, interval, intervals = []) {
  if (currentDate >= endDate) {
    return intervals;
  }

  // function inits with startDate
  if (currentDate === prevDate) {
    prevDate = new Date(currentDate);
    currentDate = new Date(currentDate.setUTCDate(currentDate.getUTCDate() + interval))
    return createIntervals(prevDate, currentDate, endDate, interval)
  }

  const newInterval = {
    interval_number: intervals.length,
    start_date: prevDate.toISOString().slice(0, 10),
    end_date: currentDate.toISOString().slice(0, 10)
  }

  prevDate = new Date(currentDate);
  currentDate = new Date(currentDate.setUTCDate(currentDate.getUTCDate() + interval))
  return createIntervals(prevDate, currentDate, endDate, interval, [...intervals, newInterval])

}

const startDate = new Date('2025-04-25T00:00:00.000+00:00');
const endDate = new Date('2025-08-25T00:00:00.000+00:00');
const dateRange = createIntervals(startDate, startDate, endDate, 14);
console.log(dateRange);