function check(arr, value) {
    if (value == null || (!Number(value) && value != '0' && value.replace(/\s/g, '') == '')){
        arr.push("Warość nie może być pusta");
        return true;
    }
    return false;
}

function username(arr, value) {
    const pattern = /^[0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z liter i/lub cyfr.");
        return true;
    }
    return false;
}

function warehouseName(arr, value) {
    const pattern = /^[0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z liter i/lub cyfr.");
        return true;
    }
    return false;
}

function institutionName(arr, value) {
    const pattern = /^[0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z liter i/lub cyfr.");
        return true;
    }
    return false;
}

function name(arr, value) {
    const pattern = /^[0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z liter i/lub cyfr.");
        return true;
    }
    return false;
}

function quantity(arr, value) {
    const pattern = /^[0-9]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z cyfr.");
        return true;
    }
    return false;
}

function password(arr, value) {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/;

    if (!pattern.test(value)){
        arr.push("Hasło musi zawierać przynajmniej jedną dużą literę, jedną małą literę, jedną cyfre, jeden znak specjalny.");
        return true;
    }
    
    return false;
}

function min(arr, value, number) {
    if (value.length < number){
        arr.push("Wartość musi składać się z conajmniej "+number+" znaków");
        return true;
    }
    return false;
}
function max(arr, value, number) {
    if (value.length > number){
        arr.push("Wartość musi składać się z maksymalnie "+number+" znaków");
        return true;
    }
    return false;
}

module.exports = { check, username, warehouseName, institutionName, name, quantity, password, min, max };