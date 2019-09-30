const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
 const isEmpty = (value)=>{
    return (
        value === undefined ||
        value == null ||
        (typeof value === "object" && Object.keys(value).length ===0) ||
        (typeof value === "string" && value.trim().length ===0)
    );
}




const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  isEmpty:isEmpty,
 }
