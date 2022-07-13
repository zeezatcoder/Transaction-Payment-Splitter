const { json } = require("body-parser");

const Users = (req, res) => {
  const { ID, Amount, SplitInfo,Currency,CustomerEmail} = req.body;
  if (toString(ID).trim().length < 1 || isNaN(ID) ){
 return res.status(400).json("invalid ID!(ID must be a number)")
}
if ( Amount < 1 || isNaN(Amount)){
  return res.status(400).json("invalid Amount(Enter a number)!")
}
if (SplitInfo.length < 1 || SplitInfo.length > 20){
  return res.status(400).json("invalid SplitInfo length( minimum of 1 split entity and a maximum of 20 entities)!")
}
if (`${Currency} `.trim().length < 1 || !isNaN(Currency) ){
  return res.status(400).json("Enter a valid Currency Description!")
}
if (`${CustomerEmail} `.trim().length < 1 || !`${CustomerEmail}`.includes('@')){
  return res.status(400).json("invalid email")
}


let Balance = Amount;

let SortedArray = [];
function SortArray(SplitType) {
  for (const element of SplitInfo) {
    if (element.SplitType === SplitType) {
      SortedArray.push(element);
    }
  }
}

SortArray("FLAT");
SortArray("PERCENTAGE");
SortArray("RATIO");

  for (const element of SortedArray) {
    if (element.SplitType === "FLAT") {
      Balance = Balance - element.SplitValue;
      element.amount = element.SplitValue;
    }
    if (element.SplitType === "PERCENTAGE") {
      let value = (element.SplitValue / 100) * Balance;
      Balance = Balance - value;
      element.amount = value;
    }
    if (element.SplitType === "RATIO") {
      let total = SortedArray.filter((type) => {
        return type.SplitType === "RATIO";
      });
      let totalRatio = total.reduce((prevalue, currentvalue) => {
        return prevalue + currentvalue.SplitValue;
      }, 0);

      let value = (element.SplitValue / totalRatio) * Balance;
      element.amount = value;
    }
  }

  let ratioDataArray = SortedArray.filter((type) => {
    return type.SplitType === "RATIO";
  });

  let finalBal = ratioDataArray.reduce((prevBal, currentAmount) => {
    return prevBal - currentAmount.amount;
  }, Balance);

  let resObject = {
    ID: ID,
    Balance: finalBal,
    SplitBreakdown: SortedArray.map((val) => {
      return { SplitEntityId: val.SplitEntityId, Amount: val.amount };
    }),
  };

  return res.status(200).json(resObject)
  
}



module.exports = {
  Users: Users,
};
