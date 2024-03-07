exports.smartTrim = (str, length, delim, appendix) => {  //delim- empty space , appendix- ...

    
    let ns=str.replace(/<[^>]+>/g, '');

    if (ns.length <= length) {
        ns += ' ...'
        return ns
    }

    var trimmedStr = ns.substring(0, length + delim.length)

    var lastDelimIndex = trimmedStr.lastIndexOf(delim)

    if (lastDelimIndex >= 0) {
        trimmedStr = trimmedStr.substr(0, lastDelimIndex)
    }

    // if (trimmedStr) {
    //     trimmedStr += appendix
    // }

    return trimmedStr + ' ...';
}