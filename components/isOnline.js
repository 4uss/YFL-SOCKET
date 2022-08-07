/*
CODES:

  1337 - Still live
  2137 - Was live, now is offline

  997 - Still Offline
  777 - Was offline, now is online

  911 - Something wrong

*/

function check(streamer, name){
  if(streamer === true){
    return {
      status: 1337,
      json_name: name
    }
  }else if(streamer === false){
    return {
      status: 777,
      json_name: name
    }
  }
}
var isOnline = function(data, crew) {

  let returnInfo;
  switch (data.user_name.toLowerCase()) {
    case 'youngmulti':
      returnInfo = check(crew.youngmulti, "youngmulti")
      break;
    case 'xmerghani':
      returnInfo = check(crew.xmerghani, "xmerghani")
      break;
    case 'mrdzinold':
      returnInfo = check(crew.mrdzinold, "mrdzinold")
      break;
    case 'banduracartel':
      returnInfo = check(crew.banduracartel, "banduracartel")
      break;
    case 'mork':
      returnInfo = check(crew.mork, "mork")
      break;
    case 'xspeedyq':
      returnInfo = check(crew.xspeedyq, "xspeedyq")
      break;
    case 'xkaleson':
      returnInfo = check(crew.xkaleson, "xkaleson")
      break;
    case 'adrian1g__':
      returnInfo = check(crew.adrian1g__, "adrian1g__")
      break;
    default:
      returnInfo = {
        status: 911
      };
  }
  return (
      returnInfo
  )
}
export default isOnline;