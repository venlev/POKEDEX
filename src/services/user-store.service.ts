
const setUser = (user: any) => {
    sessionStorage.setItem('USER', JSON.stringify(user));
}

const getUser = (): any => {
    return JSON.parse(sessionStorage.getItem('USER') as string);
}

export {
    setUser,
    getUser
}