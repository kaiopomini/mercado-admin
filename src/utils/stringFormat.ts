export function cpfFormat(value: string) {

    //Remove all non digits 
    const newValue = value.replace(/[^\d]/g, "");
    
    //return with mask
    return newValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
export function cpfHiddenFormat(value: string) {

    //Remove all non digits 
    const newValue = value.replace(/[^\d]/g, "");

    const formatedValue = newValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    //replace middle for •
    const hiddenValue = formatedValue.substring(0,5) + '••.•••' + formatedValue.substring(11)
    
    //return with mask
    return hiddenValue;
}

