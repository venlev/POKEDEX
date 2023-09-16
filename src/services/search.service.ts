const searchInList = (searchTerm: string, dataset: string[]): string[] => {
    var yourRegex = new RegExp(`${searchTerm}`);
    return dataset.filter(e => yourRegex.test(e));
}

export {
    searchInList
}