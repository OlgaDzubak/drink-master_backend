// функція, що перетворює першу літеру кожного слова в заглавну, а також прибирає зайві пробіли з рядка

const toUpperCaseFirst = (str) => {
    
    str.trim().split(" ").map((item)=>{
        item[0].toUpperCase();
        return item;
    });
    console.log("str", str);
    return str;
}

module.exports = toUpperCaseFirst;