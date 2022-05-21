exports.isLoggedIn = () => {
    let contract = localStorage.getItem("contract");
    return contract != null;
};