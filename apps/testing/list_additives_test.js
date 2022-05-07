

exports.listAdditives = async (contract) => {
    console.log("Requesting list of sauces");
    let response = await contract.evaluateTransaction("ListAdditives", "sauce", 3, "");

    if (response.toString() === "") {
        throw "The list should not be empty";
    }
    console.log("List of sauces: " + response.toString());
    console.log("Requesting list of seasoning");
    response = await contract.evaluateTransaction("ListAdditives", "seasoning", 3, "");

    if (response.toString() === "") {
        throw "The list should not be empty";
    }
    console.log("List of seasoning: " + response.toString());

}