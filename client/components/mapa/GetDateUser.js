const GetDateUser = (selectedYearFunction, selectedMonthFunction, selectedHour, currentYear) =>{
    if (selectedYearFunction || selectedMonthFunction || selectedHour){
    const dateLimit = new Date();
    dateLimit.setFullYear(selectedYearFunction ? selectedYearFunction : currentYear); // Establecer el año 
    dateLimit.setMonth(selectedMonthFunction ? selectedMonthFunction : 0); // Marzo es el mes 2 (Enero es 0)
    dateLimit.setDate(1); // Establecer el día 1 
    dateLimit.setHours(selectedHour ? selectedHour : 0); // Establecer la hora 
    dateLimit.setMinutes(0); // Establecer los minutos
    dateLimit.setSeconds(0); // Establecer los segundos 
    dateLimit.setMilliseconds(0); // Establecer los milisegundos 
    return dateLimit;
    }else{
      //con el if verificamos que la funcion tiene parametros, y si no los tiene 
      //retornará null para usar la funcion mas adelante sin usar operadores ternarios 
      return null
    }
  }
export default GetDateUser;