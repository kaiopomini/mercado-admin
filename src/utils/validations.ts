export function validadeCPF(cpf: string | null | undefined): boolean {

  if(cpf === undefined || cpf ===  null){
    return false;
  }
  
  const validDigitsReg = new RegExp('^[0-9.-]+$');

  //valid format for CPF and CNPJ 
  const validFormatReg = new RegExp('([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})');
  
  if(!validDigitsReg.test(cpf) || validFormatReg.test(cpf)) {
    return false;
  }
  
  const onlyDigitsCPF = cpf.replace(/[^\d]/g, "");

  let sum = 0;
  let rest: number;

  if (onlyDigitsCPF === "00000000000" || onlyDigitsCPF.length !==  11) {
    console.log('length or 00000000000 error ')
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    sum +=  parseInt(onlyDigitsCPF.substring(i - 1, i)) * (11 - i);
  }
  
  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)){
    rest = 0;
  }

  if (rest !== parseInt(onlyDigitsCPF.substring(9, 10))){
    console.log('first check')
    return false;
  } 

  sum = 0;
  for (let i = 1; i <= 10; i++){
    sum += parseInt(onlyDigitsCPF.substring(i - 1, i)) * (12 - i);
  } 
  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)){
    rest = 0;
  }
  if (rest !== parseInt(onlyDigitsCPF.substring(10, 11))){
    console.log('second-check')
    return false;
  } 
  
  return true;
  
} 